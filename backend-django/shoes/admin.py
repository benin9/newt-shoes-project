from django.contrib import admin
from .models import Users, Bookings, Services # Nama harus sama dengan di models.py

admin.site.register(Users)
admin.site.register(Bookings)
admin.site.register(Services)