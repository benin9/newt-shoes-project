#!/usr/bin/env python
"""Test script untuk memastikan server berjalan"""
import os
import django
from django.http import JsonResponse

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.test import Client

# Test root view
client = Client()
response = client.get('/')
print(f"Status Code: {response.status_code}")
print(f"Content: {response.json()}")

if response.status_code == 200:
    print("\n✅ Backend berjalan dengan baik secara lokal!")
else:
    print("\n❌ Ada error")

