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

from rest_framework.decorators import api_view
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
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

# --- Main Endpoints ---
@api_view(['GET'])
def root_view(request):
    return Response({"message": "Newt Shoes API is running!", "status": "success"})

@api_view(['GET'])
def get_services(request):
    services = list(Services.objects.all().values())
    return Response({"services": services})

@api_view(['POST'])
@csrf_exempt
def bookings_view(request):
    if request.method == 'POST':
        try:
            # Pastikan request.data adalah dict
            data = request.data if isinstance(request.data, dict) else {}
            
            # ... (Logika otentikasi user seperti sebelumnya)

            # 1. Simpan ke Database
            booking = Bookings.objects.create(
                user_id=user.id,
                service=data.get('service'),
                total_price=data.get('total_price'),
                status='pending'
                # ... field lainnya
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
                    "gross_amount": int(float(data.get('total_price', 0))),
                },
                "customer_details": {
                    "first_name": user.name,
                    "email": user.email,
                }
            }
            
            transaction = snap.create_transaction(param)
            
            # Respons sukses yang diharapkan frontend
            return JsonResponse({
                "message": "Booking created successfully",
                "bookingId": booking.id,
                "token": transaction['token']
            }, status=201)

        except Exception as e:
            # Log error ke Railway agar bisa dicek di Deploy Logs
            print(f"ERROR SAAT BOOKING: {str(e)}")
            return JsonResponse({"error": "Gagal memproses pembayaran"}, status=500)
    
    return JsonResponse({"detail": "Method not allowed"}, status=405)

# --- Placeholders untuk mencegah AttributeError ---
@api_view(['GET'])
def course_stats(request): return Response({"message": "Stats OK"})
@api_view(['POST'])
def token_refresh_view(request): return Response({"message": "Refreshed"})
@api_view(['GET'])
def get_my_courses(request): return Response({"courses": []})
@api_view(['POST'])
def course_enroll(request, course_id): return Response({"message": "Enrolled"})
@api_view(['POST'])
def post_comment(request): return Response({"message": "Commented"})
@api_view(['GET'])
def hello_throttled(request): return Response({"message": "Hello"})
@api_view(['GET'])
def get_paginated_courses(request): return Response({"courses": []})
@api_view(['GET'])
def get_booking_by_id(request, booking_id): return Response({"booking": booking_id})
@api_view(['POST'])
def update_payment_status(request): return Response({"message": "Updated"})
@api_view(['GET'])
def admin_get_users(request): return Response({"users": []})
@api_view(['PATCH'])
def update_booking_status(request, booking_id): return Response({"message": "Updated"})
@api_view(['POST'])
def login_view(request): return Response({"message": "Login logic here"})
@api_view(['POST'])
def register_view(request): return Response({"message": "Register logic here"})
