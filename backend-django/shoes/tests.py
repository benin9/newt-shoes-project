from django.test import TestCase, Client
from django.urls import reverse
from django.contrib.auth.hashers import make_password
from .models import Services, Users
import json


class NewtShoesAPITestCase(TestCase):

    def setUp(self):
        """
        Menyiapkan data tiruan (mock data) di database temporary untuk keperluan pengujian.
        """
        self.client = Client()
        
        # 1. Buat User dummy untuk simulasi login
        self.test_password = "password123"
        self.hashed_password = make_password(self.test_password)
        self.user = Users.objects.create(
            name="Bening Pramudita",
            email="bening@gmail.com",
            password=self.hashed_password,
            role="customer"
        )
        
        # 2. Buat beberapa data Layanan Sepatu dummy untuk simulasi pagination/filtering
        Services.objects.create(name="Whitening", price=30000, description="Memutihkan kembali sol sepatu")
        Services.objects.create(name="Repainting", price=50000, description="Mengecat ulang warna sepatu")
        Services.objects.create(name="Deep Clean", price=30000, description="Pembersihan menyeluruh luar dalam")

    def test_login_success(self):
        """
        Skenario 1: Menguji endpoint login dengan kredensial yang BENAR.
        Harus mengembalikan status 200 OK dan token.
        """
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({
                'username': 'bening@gmail.com',
                'password': self.test_password
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('token', data)
        self.assertEqual(data['message'], 'success')

    def test_login_failed_wrong_password(self):
        """
        Skenario 2: Menguji endpoint login dengan password yang SALAH.
        Harus mengembalikan status 401 Unauthorized.
        """
        response = self.client.post(
            reverse('login_view'),
            data=json.dumps({
                'username': 'bening@gmail.com',
                'password': 'password_salah_123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 401)
        data = response.json()
        self.assertEqual(data['error'], 'Invalid credentials')

    def test_register_new_user(self):
        """
        Skenario 3: Menguji registrasi user baru dengan email yang belum terdaftar.
        Harus mengembalikan status 200/201.
        """
        response = self.client.post(
            reverse('register_view'),
            data=json.dumps({
                'name': 'Andi Setiawan',
                'email': 'andi@gmail.com',
                'password': 'passwordbaru123'
            }),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['message'], 'registered')

    def test_admin_and_courier_login_return_role(self):
        """
        Skenario 4: Menguji login account dengan role admin dan courier.
        Harus mengembalikan token serta role yang sesuai.
        """
        admin_user = Users.objects.create(
            name='Admin User',
            email='admin@example.com',
            password=make_password('admin123'),
            role='admin'
        )
        courier_user = Users.objects.create(
            name='Courier User',
            email='courier@example.com',
            password=make_password('courier123'),
            role='courier'
        )

        admin_response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'email': admin_user.email, 'password': 'admin123'}),
            content_type='application/json'
        )
        self.assertEqual(admin_response.status_code, 200)
        self.assertEqual(admin_response.json()['user']['role'], 'admin')

        courier_response = self.client.post(
            reverse('login_view'),
            data=json.dumps({'email': courier_user.email, 'password': 'courier123'}),
            content_type='application/json'
        )
        self.assertEqual(courier_response.status_code, 200)
        self.assertEqual(courier_response.json()['user']['role'], 'courier')

    def test_get_paginated_courses(self):
        """
        Skenario 4: Menguji fungsi pagination, filtering, dan sorting data layanan sepatu.
        Harus mengembalikan struktur 'items' dan total data 'count' yang valid.
        """
        response = self.client.get(reverse('get_paginated_courses') + '?page=1&page_size=2&sort_by=id')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('items', data)
        self.assertIn('count', data)
        # Sesuai data setUp, total service ada 3, tapi dibatasi page_size=2
        self.assertEqual(len(data['items']), 2)
        self.assertEqual(data['count'], 3)

    def test_hello_throttled_endpoint(self):
        """
        Skenario 5: Menguji ketersediaan endpoint hello_throttled.
        """
        response = self.client.get(reverse('hello_throttled'))
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('message', data)