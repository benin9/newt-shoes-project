import os
import sys
import dj_database_url
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# 1. Keamanan: Gunakan Environment Variable
SECRET_KEY = os.environ.get('SECRET_KEY', 'django-insecure-default-key-for-dev')

# 2. DEBUG otomatis mati di Railway
DEBUG = os.environ.get('DEBUG', 'False') == 'True'

# 3. ALLOWED_HOSTS yang dinamis
ALLOWED_HOSTS = ['*'] # '*' sudah cukup untuk Railway, sistem internal mereka aman.

# 4. Konfigurasi Database (Penting untuk Railway)
IS_RAILWAY = os.environ.get('RAILWAY_ENVIRONMENT_NAME') is not None
if IS_RAILWAY:
    DATABASES = {
        'default': dj_database_url.config(conn_max_age=600, ssl_require=True)
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.mysql',
            'NAME': 'newt_shoes',
            'USER': 'root',
            'PASSWORD': 'root',
            'HOST': '127.0.0.1',
            'PORT': '3306',
        }
    }

# Aplikasi & Middleware (Tetap seperti milikmu)
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'drf_yasg',
    'shoes',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'
WSGI_APPLICATION = 'core.wsgi.application'

# Static Files
STATIC_URL = 'static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# CORS (Izinkan Frontend)
CORS_ALLOW_ALL_ORIGINS = True
CSRF_TRUSTED_ORIGINS = [
    'https://newt-shoes-project.vercel.app',
    'https://*.up.railway.app'
]
