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
    path('', views.root_view, name='root'),
    path('admin/', admin.site.urls),
    
    # Swagger Documentation Endpoints
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # API Endpoints (Dengan dan tanpa prefix /api)
    # Stats & Services
    # path('api/stats/', views.course_stats, name='course_stats'),
    path('stats/', views.course_stats, name='course_stats_no_api'),
    path('api/services/', views.get_services, name='get_services'),
    path('services/', views.get_services, name='get_services_no_api'),
    
    # Auth
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/login', views.login_view, name='login_no_slash'),
    path('auth/login/', views.login_view, name='login_no_api'),
    path('auth/login', views.login_view, name='login_no_slash_no_api'),
    path('api/auth/sign-in/', views.login_view, name='login_view'),
    path('api-auth/auth/sign-in', views.login_view, name='legacy_sign_in'),
    path('api/auth/register/', views.register_view, name='register'),
    path('auth/register/', views.register_view, name='register_no_api'),
    path('api/login/', views.login_view, name='legacy_login'),
    path('api/auth/token-refresh', views.token_refresh_view, name='token_refresh'),
    path('auth/token-refresh', views.token_refresh_view, name='token_refresh_no_api'),
    
    # Courses & Comments
    path('api/mycourses/', views.get_my_courses, name='get_my_courses'),
    path('mycourses/', views.get_my_courses, name='get_my_courses_no_api'),
    path('api/course/<int:course_id>/enroll/', views.course_enroll, name='course_enroll'),
    path('course/<int:course_id>/enroll/', views.course_enroll, name='course_enroll_no_api'),
    path('api/comments/', views.post_comment, name='post_comment'),
    path('comments/', views.post_comment, name='post_comment_no_api'),
    path('api/hello-throttled/', views.hello_throttled, name='hello_throttled'),
    path('hello-throttled/', views.hello_throttled, name='hello_throttled_no_api'),
    path('api/courses/', views.get_paginated_courses, name='get_paginated_courses'),
    path('courses/', views.get_paginated_courses, name='get_paginated_courses_no_api'),
    
    # Bookings
    path('api/bookings/', views.bookings_view, name='bookings_view'),
<<<<<<< HEAD
    path('api/bookings/', views.bookings_view, name='bookings_view'),
    path('api/bookings', views.bookings_view, name='bookings_view_no_slash'),
    path('bookings/', views.bookings_view, name='bookings_view_no_api'),
    path('bookings', views.bookings_view, name='bookings_view_no_slash_no_api'),
=======
    path('api/bookings', views.bookings_view, name='bookings_view_no_slash'),
    path('bookings/', views.bookings_view, name='bookings_view_no_api'),
    path('bookings', views.bookings_view, name='bookings_view_no_slash_no_api'),
    path('api/bookings/<int:booking_id>/', views.get_booking_by_id, name='get_booking_by_id'),
    path('bookings/<int:booking_id>/', views.get_booking_by_id, name='get_booking_by_id_no_api'),
    path('api/bookings/payment-success', views.update_payment_status, name='update_payment_status'),
    path('bookings/payment-success', views.update_payment_status, name='update_payment_status_no_api'),
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
    
    # Admin & Courier
    path('api/admin/users/', views.admin_get_users, name='admin_get_users'),
    path('admin/users/', views.admin_get_users, name='admin_get_users_no_api'),
    path('api/bookings/<int:booking_id>/status', views.update_booking_status, name='update_booking_status'),
    path('bookings/<int:booking_id>/status', views.update_booking_status, name='update_booking_status_no_api'),
]
