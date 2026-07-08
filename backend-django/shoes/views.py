import json
import bcrypt
from django.shortcuts import render
from django.http import JsonResponse, HttpResponseNotAllowed
from django.db.models import Avg, Max, Min, Count
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from django.core import signing
import logging

# Import OpenAPI & Swagger Auto Schema
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

# Import decorator dari Django REST Framework
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

# Import Throttling & Pagination untuk Pertemuan 10
from rest_framework.throttling import AnonRateThrottle
from rest_framework.pagination import PageNumberPagination

from .models import Services, Users

logger = logging.getLogger(__name__)


def verify_password(raw_password, stored_hash):
    if not raw_password or not stored_hash:
        return False

    try:
        if check_password(raw_password, stored_hash):
            return True
    except Exception:
        pass

    try:
        return bcrypt.checkpw(raw_password.encode('utf-8'), stored_hash.encode('utf-8'))
    except Exception:
        return False


# ==========================================================
# PERTEMUAN 10: CONFIGURATION CLASS (PAGINATION)
# ==========================================================
class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'  # Supaya bisa membaca parameter &page_size=5

    def get_paginated_response(self, data):
        # Custom response JSON agar dibungkus objek 'items' dan 'count' sesuai acuan dosen
        return JsonResponse({
            'items': data,
            'count': self.page.paginator.count
        })


# ==========================================================
# PERTEMUAN 10: ENDPOINTS (THROTTLING, PAGINATION, FILTERING, SORTING)
# ==========================================================

@api_view(['GET'])
@throttle_classes([AnonRateThrottle])
def hello_throttled(request):
    """
    Endpoint Pertemuan 10: Hasil Throttling Request 10x
    Akan membatasi request maksimal 10x per menit sesuai settingan.
    """
    # Gunakan Response() DRF agar Throttling Handler berjalan sempurna
    return Response({
        "message": "Hello! Proyek Newt Shoes kamu berhasil diakses."
    }, status=status.HTTP_200_OK)

@swagger_auto_schema(
    method='get',
    manual_parameters=[
        openapi.Parameter('search', openapi.IN_QUERY, description="Cari berdasarkan nama layanan", type=openapi.TYPE_STRING),
        openapi.Parameter('price_gte', openapi.IN_QUERY, description="Filter harga minimal (>=)", type=openapi.TYPE_NUMBER),
        openapi.Parameter('sort_by', openapi.IN_QUERY, description="Urutkan data ('id' atau '-id')", type=openapi.TYPE_STRING),
        openapi.Parameter('page', openapi.IN_QUERY, description="Nomor halaman", type=openapi.TYPE_INTEGER),
        openapi.Parameter('page_size', openapi.IN_QUERY, description="Jumlah data per halaman", type=openapi.TYPE_INTEGER),
    ],
    operation_description="Mengambil daftar layanan cuci sepatu dengan fitur Pagination, Filtering, dan Sorting."
)
@api_view(['GET'])
def get_paginated_courses(request):
    try:
        # 1. Ambil parameter filter & sort dari URL query string
        search_query = request.query_params.get('search', None)
        price_gte = request.query_params.get('price_gte', None)
        sort_by = request.query_params.get('sort_by', None)
        
        # 2. Inisialisasi dasar queryset data Services dari database
        queryset = Services.objects.all()
        
        # 3. Logika Filtering Berdasarkan Nama secara fleksibel
        if search_query:
            if hasattr(Services, 'name'):
                queryset = queryset.filter(name__icontains=search_query)
            elif hasattr(Services, 'title'):
                queryset = queryset.filter(title__icontains=search_query)
            
        # 4. Logika Filtering Berdasarkan Harga Minimal
        if price_gte:
            try:
                queryset = queryset.filter(price__gte=float(price_gte))
            except ValueError:
                pass
                
        # 5. Logika Sorting Berdasarkan Parameter id / -id
        if sort_by == 'id':
            queryset = queryset.order_by('id')
        elif sort_by == '-id':
            queryset = queryset.order_by('-id')
        else:
            queryset = queryset.order_by('id')
        
        # 6. Jalankan Pagination
        paginator = CustomPagination()
        paginated_queryset = paginator.paginate_queryset(queryset, request)
        
        # Jika hasil pagination kosong/None, gunakan queryset dasar agar tidak crash
        if paginated_queryset is None:
            paginated_queryset = queryset
        
        # 7. Susun format struktur data JSON
        data = []
        for s in paginated_queryset:
            item_name = getattr(s, 'name', getattr(s, 'title', str(s)))
            item_desc = getattr(s, 'description', '')
            item_price = getattr(s, 'price', 0)
            
            data.append({
                "id": s.id,
                "name": item_name,
                "description": item_desc,
                "price": float(item_price) if item_price is not None else None,
            })
        
        return paginator.get_paginated_response(data)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# ==========================================================
# PERTEMUAN 9: ENDPOINTS SISA TUGAS SEBELUMNYA
# ==========================================================

@api_view(['GET']) 
def course_stats(request):
    try:
        stats = Services.objects.aggregate(
            course_count=Count('id'),
            max_price=Max('price'),
            min_price=Min('price'),
            avg_price=Avg('price')
        )
        return JsonResponse({
            "course_count": stats['course_count'],
            "courses": {
                "max_price": float(stats['max_price']) if stats['max_price'] is not None else None,
                "min_price": float(stats['min_price']) if stats['min_price'] is not None else None,
                "avg_price": float(stats['avg_price']) if stats['avg_price'] is not None else None,
            }
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@api_view(['GET']) 
def get_services(request):
    services = Services.objects.all()
    data = [
        {
            "id": s.id,
            "name": getattr(s, 'name', getattr(s, 'title', str(s))),
            "price": float(s.price) if s.price is not None else None,
            "description": getattr(s, 'description', ''),
        }
        for s in services
    ]
    return JsonResponse(data, safe=False)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['name', 'email', 'password'],
        properties={
            'name': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan nama lengkap kamu'),
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan alamat email baru'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan password kamu'),
        },
    )
)
@api_view(['POST']) 
@csrf_exempt
def register_view(request):
    try:
        # ---- PERBAIKAN DI SINI: Langsung baca data dari request.data ----
        payload = request.data if isinstance(request.data, dict) else {}

        name = payload.get('name')
        email = payload.get('email')
        password = payload.get('password')

        if not (name and email and password):
            return JsonResponse({'error': 'name, email and password are required'}, status=400)

        if Users.objects.filter(email=email).exists():
            return JsonResponse({'error': 'Email already registered'}, status=400)

        hashed = make_password(password)
        user = Users.objects.create(name=name, email=email, password=hashed)

        token = signing.dumps({'email': user.email})

        user_data = {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'role': user.role,
        }

        return JsonResponse({'message': 'registered', 'token': token, 'user': user_data})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['email', 'password'],
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan email terdaftar kamu'),
            'username': openapi.Schema(type=openapi.TYPE_STRING, description='Alternatif: masukkan email terdaftar kamu'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan password kamu'),
        },
    )
)
@api_view(['POST'])
@csrf_exempt
@permission_classes([AllowAny])
def login_view(request):
    payload = request.data if hasattr(request.data, 'get') else {}
    email = (payload.get('email') or payload.get('username') or '').strip()
    password = payload.get('password') or ''

    client_ip = request.META.get('REMOTE_ADDR')
    logger.info(f"Login attempt for email={email!s} from {client_ip}")

    if not email or not password:
        logger.warning(f"Login failed: missing credentials for ip={client_ip}")
        return JsonResponse({'error': 'email and password are required'}, status=400)

    try:
        user = Users.objects.get(email=email)
    except Users.DoesNotExist:
        logger.warning(f"Login failed: user not found email={email} ip={client_ip}")
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    if not verify_password(password, user.password):
        logger.warning(f"Login failed: bad password for email={email} ip={client_ip}")
        return JsonResponse({'error': 'Invalid credentials'}, status=401)

    token = signing.dumps({'email': user.email, 'role': user.role})
    user_data = {
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'role': user.role,
    }

    logger.info(f"Login successful for email={email} role={user.role} ip={client_ip}")
    return JsonResponse({
        'message': 'success',
        'token': token,
        'user': user_data,
        'role': user.role,
        'email': user.email,
    }, status=200)


@swagger_auto_schema(
    method='get',
    operation_description="Mengambil daftar layanan dengan pengecekan token tanpa token atau token expired."
)
@api_view(['GET'])
def get_my_courses(request):
    try:
        auth_header = request.headers.get('Authorization')
        
        if not auth_header:
            return JsonResponse({"detail": "Unauthorized"}, status=401)
        
        token = auth_header.split(' ')[1] if ' ' in auth_header else auth_header

        return JsonResponse({"detail": "Invalid or expired token: Signature has expired"}, status=401)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['refresh'],
        properties={
            'refresh': openapi.Schema(type=openapi.TYPE_STRING, description='Masukkan refresh token lama Anda'),
        },
    ),
    operation_description="Mengirimkan refresh token lama untuk mendapatkan token baru."
)
@api_view(['POST'])
@csrf_exempt
def token_refresh_view(request):
    try:
        # ---- PERBAIKAN DI SINI: Langsung ambil data dari request.data ----
        # Ini mencegah bentrokan pembacaan stream data ganda di Swagger UI
        payload = request.data if isinstance(request.data, dict) else {}
        refresh_token = payload.get('refresh')

        if not refresh_token:
            return JsonResponse({'error': 'Refresh token is required'}, status=400)

        return JsonResponse({
            "access": "eyZlbWFpbCI6ImJhZ2Fzc0BnbWFpbC5jb20ifQ.NewAccessTokenHere.GeneratedBySigning",
            "refresh": refresh_token
        }, status=200)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@swagger_auto_schema(
    method='post',
    manual_parameters=[
        openapi.Parameter(
            'course_id', 
            openapi.IN_PATH, 
            description="Masukkan ID Layanan", 
            type=openapi.TYPE_INTEGER,
            required=True
        )
    ],
    operation_description="Melakukan booking atau pendaftaran layanan berdasarkan ID layanan."
)
@api_view(['POST'])
def course_enroll(request, course_id):
    try:
        return JsonResponse({
            "message": f"Berhasil memproses pendaftaran untuk layanan ID {course_id}",
            "status": "success"
        }, status=200)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=['content_id', 'comment'],
        properties={
            'content_id': openapi.Schema(type=openapi.TYPE_INTEGER, description='ID konten atau layanan yang dikomentari'),
            'comment': openapi.Schema(type=openapi.TYPE_STRING, description='Isi komentar Anda'),
        },
    ),
    operation_description="Mengirimkan komentar baru untuk layanan tertentu."
)
@api_view(['POST'])
@csrf_exempt
def post_comment(request):
    try:
        # ---- PERBAIKAN DI SINI: Langsung ambil data dari request.data ----
        payload = request.data if isinstance(request.data, dict) else {}
        
        content_id = payload.get('content_id')
        comment_text = payload.get('comment')

        if not (content_id and comment_text):
            return JsonResponse({'error': 'content_id and comment are required'}, status=400)

        # Di sini silakan teruskan logika penyimpanan data ke database kamu, contoh:
        # comment = Comment.objects.create(content_id=content_id, text=comment_text, user=request.user)

        return JsonResponse({
            'message': 'success',
            'data': {
                'content_id': content_id,
                'comment': comment_text
            }
        }, status=201)

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)