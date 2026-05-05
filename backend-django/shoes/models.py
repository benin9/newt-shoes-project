from django.db import models

class Services(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False  # Jangan biarkan Django mengubah tabel ini
        db_table = 'services'
    
    def __str__(self):
        return f"{self.name} - Rp {self.price}"


class Bookings(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('processing', 'Processing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.AutoField(primary_key=True)
    user_id = models.IntegerField()
    service = models.CharField(max_length=100)
    shoes_name = models.CharField(max_length=255, null=True, blank=True)
    shoes_kg = models.CharField(max_length=50, null=True, blank=True)
    shoes_type = models.CharField(max_length=100)
    pickup_address = models.TextField()
    pickup_date = models.DateField()
    pickup_time = models.TimeField()
    notes = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False  # Jangan biarkan Django mengubah tabel ini
        db_table = 'bookings'
    
    def __str__(self):
        return f"Booking #{self.id} - {self.service} ({self.status})"


class Users(models.Model):
    ROLE_CHOICES = [
        ('user', 'User'),
        ('admin', 'Admin'),
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
        managed = False  # Jangan biarkan Django mengubah tabel ini
        db_table = 'users'
    
    def __str__(self):
        return f"{self.name} ({self.email})"
