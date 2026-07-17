import bcrypt
import os
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core import signing
from rest_framework.decorators import api_view, throttle_classes
from rest_framework.throttling import UserRateThrottle
from rest_framework.response import Response
from .models import Users, Bookings, Services

logger = logging.getLogger(__name__)

# --- Throttle Configuration ---
class FiveRequestsPerMinuteThrottle(UserRateThrottle):
    scope = 'five_per_minute'

# --- Helper ---
def verify_password(raw_password, stored_hash):
    if not raw_password or not stored_hash: return False
    return bcrypt.checkpw(raw_password.encode('utf-8'), stored_hash.encode('utf-8'))

# --- Auth Endpoints ---
@api_view(['POST'])
@csrf_exempt
def register_view(request):
    try:
        data = request.data
        email = data.get('email', '').lower()
        if Users.objects.filter(email__iexact=email).exists():
            return JsonResponse({"error": "Email sudah terdaftar"}, status=400)
        
        hashed_pw = bcrypt.hashpw(data.get('password').encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        Users.objects.create(name=data.get('name'), email=email, password=hashed_pw, role=data.get('role', 'user'))
        return JsonResponse({"message": "Registrasi berhasil"}, status=201)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@api_view(['POST'])
@csrf_exempt
def login_view(request):
    try:
        data = request.data
        email = data.get('email', '').lower()
        password = data.get('password', '')
        user = Users.objects.filter(email__iexact=email).first()

        if user:
            if user.password.startswith('$2'):
                is_valid = bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8'))
            else:
                is_valid = (password == user.password)

            if is_valid:
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
@api_view(['GET', 'POST'])
@csrf_exempt
def bookings_view(request):
    try:
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        if not token:
            return JsonResponse({"error": "Token tidak ditemukan"}, status=401)
            
        payload = signing.loads(token)
        user = Users.objects.get(email__iexact=payload.get('email'))
        
        if request.method == 'GET':
            user_bookings = list(Bookings.objects.filter(user_id=user.id).values())
            return JsonResponse({"bookings": user_bookings}, status=200)

        if request.method == 'POST':
            data = request.data
            booking = Bookings.objects.create(
                user_id=user.id, service=data.get('service'), 
                total_price=data.get('total_price'), status='pending'
            )
            
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
            return JsonResponse({"message": "Booking sukses", "token": transaction['token']}, status=201)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

# --- Endpoint Lainnya ---
@api_view(['POST'])
def token_refresh_view(request): return Response({"message": "OK"})

@api_view(['POST'])
def course_enroll(request, course_id): return Response({"message": f"Enrolled {course_id}"})

@api_view(['POST'])
def post_comment(request): return Response({"message": "Comment posted"})

@api_view(['GET'])
def get_services(request): return JsonResponse({"services": list(Services.objects.all().values())})

@api_view(['GET'])
def root_view(request): return JsonResponse({"message": "API running", "status": "success"})

# --- Throttled Endpoint ---
@api_view(['GET'])
@throttle_classes([FiveRequestsPerMinuteThrottle])
def hello_throttled(request): return JsonResponse({"message": "OK"})

@api_view(['GET'])
def get_paginated_courses(request): return JsonResponse({"courses": [], "total": 0})

@api_view(['GET'])
def get_booking_by_id(request, booking_id): return JsonResponse({"booking": booking_id})

@api_view(['POST'])
def update_payment_status(request): return JsonResponse({"message": "OK"})

@api_view(['GET'])
def admin_get_users(request): 
    users = list(Users.objects.all().values('id', 'name', 'email', 'role'))
    return JsonResponse({"users": users})
    
@api_view(['PATCH'])
def update_booking_status(request, booking_id): return JsonResponse({"message": "OK"})

@api_view(['GET'])
def course_stats(request): return JsonResponse({"message": "OK"})

@api_view(['GET'])
def get_my_courses(request): return JsonResponse({"courses": []})