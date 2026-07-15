from django.contrib import admin
from django.urls import path
from shoes import views 

# ... (simpan bagian schema_view Anda di sini)

urlpatterns = [
    path('', views.root_view, name='root'),
    path('admin/', admin.site.urls),
    
    # Swagger Documentation
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    # Auth
    path('api/auth/login/', views.login_view, name='login'),
    path('api/auth/register/', views.register_view, name='register'),
    path('api/auth/token-refresh/', views.token_refresh_view, name='token_refresh'),
    
    # Bookings
    path('api/bookings/', views.bookings_view, name='bookings_view'),
    path('api/bookings/<int:booking_id>/', views.get_booking_by_id, name='get_booking_by_id'),
    path('api/bookings/<int:booking_id>/status/', views.update_booking_status, name='update_booking_status'),
    path('api/bookings/payment-success/', views.update_payment_status, name='update_payment_status'),
    
    # Services & Courses
    path('api/services/', views.get_services, name='get_services'),
    path('api/courses/', views.get_paginated_courses, name='get_paginated_courses'),
    path('api/mycourses/', views.get_my_courses, name='get_my_courses'),
    path('api/course/<int:course_id>/enroll/', views.course_enroll, name='course_enroll'),
    
    # Misc
    path('api/stats/', views.course_stats, name='course_stats'),
    path('api/comments/', views.post_comment, name='post_comment'),
    path('api/hello-throttled/', views.hello_throttled, name='hello_throttled'),
    path('api/admin/users/', views.admin_get_users, name='admin_get_users'),
]