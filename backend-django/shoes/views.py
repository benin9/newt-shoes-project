from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import Avg, Max, Min, Count
from .models import Services # Pastikan class di models.py namanya 'Services'


def course_stats(request):
    try:
        # Menghitung statistik dari tabel services
        stats = Services.objects.aggregate(
            course_count=Count('service_id'),
            max_price=Max('harga'),
            min_price=Min('harga'),
            avg_price=Avg('harga')
        )
        return JsonResponse({
            "course_count": stats['course_count'],
            "courses": {
                "max_price": stats['max_price'],
                "min_price": stats['min_price'],
                "avg_price": stats['avg_price']
            }
        })
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
    # Tambahkan ini di views.py
def get_services(request):
    from .models import Services # Pastikan import modelnya benar
    services = Services.objects.all()
    
    # Kuncinya ada di sini: kita ubah nama field-nya saat dikirim ke frontend
    data = [
        {
            "id": s.service_id,    # Diubah dari service_id menjadi id
            "name": s.nama_layanan, # Diubah dari nama_layanan menjadi name
            "price": s.harga       # Tetap price
        } 
        for s in services
    ]
    return JsonResponse(data, safe=False)

def login_view(request):
    # ... logika login ...
    return JsonResponse({"message": "Success"}) # Harus ada return ini!