import os
import django
from django.contrib.auth.hashers import make_password

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from shoes.models import Users

def init_users():
    # Admin user
    admin_email = 'admin@newt.local'
    if not Users.objects.filter(email=admin_email).exists():
        Users.objects.create(
            name='Admin',
            email=admin_email,
            role='admin',
            password=make_password('admin123'),
            phone='081234567890'
        )
        print(f"Admin user created: {admin_email} / admin123")
    else:
        print(f"Admin user {admin_email} already exists")
    
    # Courier user
    courier_email = 'kurir@newt.local'
    if not Users.objects.filter(email=courier_email).exists():
        Users.objects.create(
            name='Kurir',
            email=courier_email,
            role='courier',
            password=make_password('courier123'),
            phone='081234567891'
        )
        print(f"Courier user created: {courier_email} / courier123")
    else:
        print(f"Courier user {courier_email} already exists")

if __name__ == '__main__':
    init_users()
