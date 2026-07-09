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
        user = Users.objects.filter(email__iexact=data.get('email', '').lower()).first()
        if user and verify_password(data.get('password'), user.password):
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
        token = request.headers.get('Authorization', '').replace('Bearer ', '')
        payload = signing.loads(token)
        user = Users.objects.get(email__iexact=payload.get('email'))
        
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
        return JsonResponse({"error": "Gagal memproses booking"}, status=500)

@api_view(['POST'])
def token_refresh_view(request):
    # Logika refresh token Anda di sini
    return Response({"message": "Token refreshed"})

@api_view(['POST'])
def course_enroll(request, course_id):
    # Tambahkan logika untuk melakukan enroll course di sini
    return Response({"message": f"Successfully enrolled in course {course_id}"})

# --- Utility Endpoints ---
@api_view(['GET'])
def get_services(request): 
    return JsonResponse({"services": list(Services.objects.all().values())})

@api_view(['GET'])
def root_view(request): 
    return JsonResponse({"message": "API running", "status": "success"})

# Placeholder Aman
def course_stats(request): return JsonResponse({"message": "OK"})
def get_my_courses(request): return JsonResponse({"courses": []})
def update_booking_status(request, booking_id): return JsonResponse({"message": "OK"})
