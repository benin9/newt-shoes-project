import json
import bcrypt
import os
import midtransclient
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import signing
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Users, Bookings, Services

logger = logging.getLogger(__name__)

# --- Booking Endpoint yang Diperbaiki ---
@api_view(['POST'])
@csrf_exempt
def bookings_view(request):
    if request.method != 'POST':
        return Response({"detail": "Method not allowed"}, status=405)
        
    try:
        # 1. Otentikasi User (PENTING: Mengambil user dari token)
        auth_header = request.headers.get('Authorization')
        if not auth_header:
            return Response({"error": "Unauthorized"}, status=401)
        
        token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
        payload = signing.loads(token)
        user = Users.objects.get(email=payload.get('email'))
        
        # 2. Ambil data booking
        data = request.data if isinstance(request.data, dict) else {}
        
        # 3. Simpan ke Database
        booking = Bookings.objects.create(
            user_id=user.id,
            service=data.get('service'),
            total_price=data.get('total_price'),
            status='pending'
        )

        # 4. Integrasi Midtrans
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
        
        # Kirim respons sukses
        return JsonResponse({
            "message": "Booking created successfully",
            "bookingId": booking.id,
            "token": transaction['token']
        }, status=201)

    except Users.DoesNotExist:
        return Response({"error": "User tidak ditemukan"}, status=404)
    except Exception as e:
        logger.error(f"Booking Error: {str(e)}")
        return JsonResponse({"error": f"Gagal memproses: {str(e)}"}, status=500)

# --- Pastikan Placeholder Tetap Ada ---
@api_view(['GET'])
def get_services(request): return Response({"services": list(Services.objects.all().values())})
@api_view(['GET'])
def course_stats(request): return Response({"message": "OK"})
@api_view(['POST'])
def token_refresh_view(request): return Response({"message": "OK"})
@api_view(['GET'])
def get_my_courses(request): return Response({"courses": []})
@api_view(['POST'])
def course_enroll(request, course_id): return Response({"message": "OK"})
@api_view(['POST'])
def post_comment(request): return Response({"message": "OK"})
@api_view(['GET'])
def hello_throttled(request): return Response({"message": "OK"})
@api_view(['GET'])
def get_paginated_courses(request): return Response({"courses": []})
@api_view(['GET'])
def get_booking_by_id(request, booking_id): return Response({"booking": booking_id})
@api_view(['POST'])
def update_payment_status(request): return Response({"message": "OK"})
@api_view(['GET'])
def admin_get_users(request): return Response({"users": []})
@api_view(['PATCH'])
def update_booking_status(request, booking_id): return Response({"message": "OK"})
@api_view(['POST'])
def login_view(request): return Response({"message": "OK"})
@api_view(['POST'])
def register_view(request): return Response({"message": "OK"})
@api_view(['GET'])
def root_view(request):
    return JsonResponse({"message": "Newt Shoes API is running!", "status": "success"})
