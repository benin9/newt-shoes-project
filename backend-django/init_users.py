import os
import django
from django.contrib.auth.hashers import make_password

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from shoes.models import Users

def init_users():
    print("Starting user initialization...")
    
    try:
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
            print(f"✅ Admin user created: {admin_email} / admin123")
        else:
            print(f"ℹ️ Admin user {admin_email} already exists")
        
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
            print(f"✅ Courier user created: {courier_email} / courier123")
        else:
            print(f"ℹ️ Courier user {courier_email} already exists")
        
        print("✅ User initialization complete!")
    except Exception as e:
        print(f"❌ Error initializing users: {e}")
        # Jangan biarkan init users gagal menghambat startup server
        pass

if __name__ == '__main__':
    init_users()

