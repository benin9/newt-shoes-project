from django.conf import settings
from django.db import models

class Services(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'services'
    
    def __str__(self):
        return f"{self.name} - Rp {self.price}"


class Bookings(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Menunggu Pembayaran'),
        ('confirmed', 'Menunggu Kurir'),
        ('on_pickup', 'Sedang Dijemput'),
        ('processing', 'Sedang Diproses'),
        ('on_delivery', 'Sedang Diantar'),
        ('completed', 'Selesai'),
        ('cancelled', 'Dibatalkan'),
    ]
    
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    service = models.CharField(max_length=100)
    shoe_name = models.CharField(max_length=255, null=True, blank=True)
    shoe_size = models.CharField(max_length=50, null=True, blank=True)
    shoe_type = models.CharField(max_length=100)
    pickup_address = models.TextField()
    pickup_date = models.DateField()
    pickup_time = models.TimeField()
    notes = models.TextField(null=True, blank=True)
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'bookings'
    
    def __str__(self):
        return f"Booking #{self.id} - {self.service} ({self.status})"


class Users(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
        ('courier', 'Courier'),
    ]
    
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    password = models.CharField(max_length=255)
    phone = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'
    
    def __str__(self):
        return f"{self.name} ({self.email})"
