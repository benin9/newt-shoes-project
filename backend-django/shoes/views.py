import bcrypt
import os
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import signing
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Users, Bookings, Services

logger = logging.getLogger(__name__)

# --- Helper ---
def verify_password(raw_password, stored_hash):
    if not raw_password or not stored_hash: return False
    return bcrypt.checkpw(raw_password.encode('utf-8'), stored_hash.encode('utf-8'))

# --- Login Endpoint ---
@api_view(['POST'])
@csrf_exempt
def login_view(request):
    try:
        data = request.data
        email = data.get('email', '').lower()
        password = data.get('password', '')
        
        user = Users.objects.filter(email__iexact=email).first()
        
        if user and verify_password(password, user.password):
            token = signing.dumps({"email": user.email})
            return JsonResponse({
                "message": "Login berhasil",
                "user": {"id": user.id, "name": user.name, "email": user.email, "role": user.role},
                "token": token
            }, status=200)
        
        return JsonResponse({"error": "Email atau password salah"}, status=401)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# --- Booking Endpoint ---
@api_view(['POST'])
@csrf_exempt
def bookings_view(request):
    try:
        auth_header = request.headers.get('Authorization')
        if not auth_header: return JsonResponse({"error": "Unauthorized"}, status=401)
        
        token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header
        payload = signing.loads(token)
        user = Users.objects.get(email__iexact=payload.get('email'))
        
        data = request.data
        booking = Bookings.objects.create(
            user_id=user.id,
            service=data.get('service'),
            total_price=data.get('total_price'),
            status='pending'
        )
        
        # Integrasi Midtrans
        import midtransclient
        snap = midtransclient.Snap(
            is_production=os.environ.get('MIDTRANS_IS_PRODUCTION') == 'True',
            server_key=os.environ.get('MIDTRANS_SERVER_KEY'),
            client_key=os.environ.get('MIDTRANS_CLIENT_KEY')
        )
        transaction = snap.create_transaction({
            "transaction_details": {"order_id": f"ORDER-{booking.id}", "gross_amount": int(float(data.get('total_price', 0)))},
            "customer_details": {"first_name": user.name, "email": user.email}
        })
        
        return JsonResponse({"message": "Booking sukses", "bookingId": booking.id, "token": transaction['token']}, status=201)
    except Exception as e:
        logger.error(f"Booking Error: {str(e)}")
        return JsonResponse({"error": "Gagal memproses"}, status=500)

# --- Endpoints Lainnya ---
@api_view(['GET'])
def get_services(request): 
    return JsonResponse({"services": list(Services.objects.all().values())})

@api_view(['GET'])
def root_view(request): 
    return JsonResponse({"message": "Newt Shoes API is running!", "status": "success"})

# Placeholder untuk mencegah AttributeError
def course_stats(request): return JsonResponse({"message": "OK"})
def token_refresh_view(request): return JsonResponse({"message": "OK"})
def get_my_courses(request): return JsonResponse({"courses": []})
def course_enroll(request, course_id): return JsonResponse({"message": "OK"})
def post_comment(request): return JsonResponse({"message": "OK"})
def hello_throttled(request): return JsonResponse({"message": "OK"})
def get_paginated_courses(request): return JsonResponse({"courses": []})
def get_booking_by_id(request, booking_id): return JsonResponse({"booking": booking_id})
def update_payment_status(request): return JsonResponse({"message": "OK"})
def admin_get_users(request): return JsonResponse({"users": []})
def update_booking_status(request, booking_id): return JsonResponse({"message": "OK"})
def register_view(request): return JsonResponse({"message": "OK"})
