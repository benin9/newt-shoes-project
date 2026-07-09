import json
import bcrypt
import os
import midtransclient
import logging
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.db.models import Avg, Max, Min, Count
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.core import signing

from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework.throttling import AnonRateThrottle
from rest_framework.pagination import PageNumberPagination

from .models import Services, Users, Bookings

logger = logging.getLogger(__name__)

# --- Helper & Class ---
def verify_password(raw_password, stored_hash):
    if not raw_password or not stored_hash: return False
    try:
        if check_password(raw_password, stored_hash): return True
    except Exception: pass
    try:
        return bcrypt.checkpw(raw_password.encode('utf-8'), stored_hash.encode('utf-8'))
    except Exception: return False

class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    def get_paginated_response(self, data):
        return JsonResponse({'items': data, 'count': self.page.paginator.count})

# --- Endpoints ---
def root_view(request):
    return JsonResponse({"message": "Newt Shoes API is running!", "status": "success"})

# Di dalam shoes/views.py

@api_view(['GET'])
def course_stats(request):
    # Tambahkan logika perhitungan statistik Anda di sini
    return Response({"message": "Data statistik berhasil diambil"})

@api_view(['POST'])
@csrf_exempt
def bookings_view(request):
    if request.method == 'GET':
        # ... (Logika GET dibiarkan sama seperti sebelumnya)
        return JsonResponse({"detail": "Use POST to book"}, status=405)
    
    elif request.method == 'POST':
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return JsonResponse({"detail": "Unauthorized"}, status=401)
            
            token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
            payload = signing.loads(token)
            user = Users.objects.get(email=payload.get('email'))
            
            data = request.data if isinstance(request.data, dict) else {}
            
            # 1. Simpan ke database
            booking = Bookings.objects.create(
                user_id=user.id,
                service=data.get('service'),
                shoe_name=data.get('shoe_name'),
                shoe_size=data.get('shoe_size'),
                shoe_type=data.get('shoe_type'),
                pickup_address=data.get('pickup_address'),
                pickup_date=data.get('pickup_date'),
                pickup_time=data.get('pickup_time'),
                notes=data.get('notes'),
                total_price=data.get('total_price'),
                status='pending'
            )

            # 2. Integrasi Midtrans
            snap = midtransclient.Snap(
                is_production=os.environ.get('MIDTRANS_IS_PRODUCTION') == 'True',
                server_key=os.environ.get('MIDTRANS_SERVER_KEY'),
                client_key=os.environ.get('MIDTRANS_CLIENT_KEY')
            )

            param = {
                "transaction_details": {
                    "order_id": f"ORDER-{booking.id}",
                    "gross_amount": int(float(booking.total_price)),
                },
                "customer_details": {
                    "first_name": user.name,
                    "email": user.email,
                }
            }
            
            transaction = snap.create_transaction(param)
            
            # 3. Respons dengan Token
            return JsonResponse({
                "message": "Booking created successfully",
                "bookingId": booking.id,
                "token": transaction['token']
            }, status=201)

        except Exception as e:
            # Gunakan logging untuk melihat error di tab Logs Railway
            logger.error(f"Midtrans Error: {str(e)}") 
            return JsonResponse({"error": f"Internal Error: {str(e)}"}, status=500)
            
# Catatan: Fungsi lainnya (register_view, login_view, dll) 
# tetap Anda pertahankan di bawah fungsi bookings_view ini.
