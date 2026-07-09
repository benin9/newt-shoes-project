"""
URL configuration for core project.
"""
from django.contrib import admin
from django.urls import path, include
from shoes import views 

# Import modul untuk Swagger
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Konfigurasi informasi dokumentasi API
schema_view = get_schema_view(
   openapi.Info(
      title="Newt Shoes API Docs",
      default_version='v1',
      description="Dokumentasi API interaktif untuk proyek Newt Shoes",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Swagger Documentation Endpoints
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # API Endpoints dari aplikasi shoes
    path('api/stats/', views.course_stats, name='course_stats'),
    path('api/services/', views.get_services, name='get_services'),
    
    # Rute auth login yang kompatibel dengan frontend
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/login', views.login_view, name='login_no_slash'),
    path('api/auth/sign-in/', views.login_view, name='login_view'),
    path('api-auth/auth/sign-in', views.login_view, name='legacy_sign_in'),
    
    # Rute auth lainnya
    path('api/auth/register/', views.register_view, name='register'),
    path('api/auth/register/', views.register_view, name='register_view'),
    path('api/login/', views.login_view, name='legacy_login'),
    
    # Rute untuk tugas nomor 4 dan 5 (Tanpa duplikasi)
    path('api/mycourses/', views.get_my_courses, name='get_my_courses'),
    path('api/course/<int:course_id>/enroll/', views.course_enroll, name='course_enroll'),
    path('api/comments/', views.post_comment, name='post_comment'),
    
    # Tambahkan baris ini di dalam list urlpatterns Anda:
    path('api/auth/token-refresh', views.token_refresh_view, name='token_refresh'),
    
    # Tambahkan baris ini untuk rute Throttling:
    path('api/hello-throttled/', views.hello_throttled, name='hello_throttled'),
    # Tambahkan baris ini untuk rute Pagination:
    path('api/courses/', views.get_paginated_courses, name='get_paginated_courses'),
    
    # Bookings Endpoints
    path('api/bookings/', views.bookings_view, name='bookings_view'),
    path('api/bookings', views.bookings_view, name='bookings_view_no_slash'),
    path('api/bookings/<int:booking_id>/', views.get_booking_by_id, name='get_booking_by_id'),
    path('api/bookings/payment-success', views.update_payment_status, name='update_payment_status'),
    
    # Admin & Courier Endpoints
    path('api/admin/users/', views.admin_get_users, name='admin_get_users'),
    path('api/bookings/<int:booking_id>/status', views.update_booking_status, name='update_booking_status'),
]