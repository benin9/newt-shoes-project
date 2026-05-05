"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingApi, servicesApi } from "@/lib/api"; // Pastikan import servicesApi ada
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// Interface untuk data layanan dari API
interface ServiceData {
  id: number;
  name: string;
  price: number;
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State Data
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "", // Kita simpan ID layanan, bukan string nama
    serviceName: "", // Untuk display/validasi
    shoeType: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
    notes: "",
  });

  // 1. Fetch Daftar Layanan saat komponen dimuat
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data);

        // Cek apakah ada query param dari halaman Pricing (misal: ?service=Deep%20Clean)
        const preSelectedService = searchParams.get("service");
        if (preSelectedService && data.length > 0) {
          const found = data.find((s: ServiceData) => s.name === preSelectedService);
          if (found) {
             setFormData(prev => ({ 
               ...prev, 
               serviceId: found.id.toString(),
               serviceName: found.name 
             }));
          }
        }
      } catch (error) {
        toast.error("Gagal memuat daftar layanan. Cek koneksi internet.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
      // Jika user memilih layanan, update juga nama servicenya untuk dikirim ke API
      const selected = services.find(s => s.id.toString() === value);
      setFormData(prev => ({
        ...prev,
        serviceId: value,
        serviceName: selected ? selected.name : ""
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validasi sederhana
    if (!formData.serviceName) {
      toast.error("Silakan pilih layanan terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    // Persiapan data untuk API
    // Sesuaikan field ini dengan apa yang backend 'bookingApi.create' harapkan
    const payload = {
      service: formData.serviceName, // Backend butuh string nama layanan
      shoe_type: formData.shoeType,
      pickup_address: formData.address,
      pickup_date: formData.pickupDate,
      pickup_time: formData.pickupTime,
      notes: formData.notes
    };

    const bookingPromise = bookingApi.create(payload);

    toast.promise(bookingPromise, {
      loading: 'Mengirim pesanan...',
      success: (res) => {
        if (res.error) throw new Error(res.error);
        router.push('/my-bookings'); // Redirect ke halaman history user
        return 'Pesanan berhasil dibuat! Tim kami akan segera menghubungi.';
      },
      error: (err) => `Gagal: ${err.message || 'Terjadi kesalahan'}`,
    });

    try {
      await bookingPromise;
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-[#be9020]/20"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#3a2f1c]">Formulir Pemesanan</h2>
        <p className="text-[#5c4a2f]/70 text-sm mt-2">Lengkapi data untuk penjemputan sepatu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Pilih Layanan (DINAMIS DARI DB) */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Pilih Layanan</label>
          {loadingServices ? (
             <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
          ) : (
            <select
              name="serviceId"
              value={formData.serviceId}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c]"
            >
              <option value="" disabled>-- Pilih Paket Cuci --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>
                  {svc.name} — Rp {svc.price.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Jenis Sepatu */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Jenis Sepatu</label>
          <input
            type="text"
            name="shoeType"
            value={formData.shoeType}
            onChange={handleChange}
            placeholder="Contoh: Sneakers Putih, Boots Kulit, dll"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c] placeholder:text-gray-400"
          />
        </div>

        {/* Jadwal Pickup (Grid 2 Kolom) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#3a2f1c]">Tanggal Jemput</label>
            <input
              type="date"
              name="pickupDate"
              value={formData.pickupDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c]"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-[#3a2f1c]">Jam Jemput</label>
            <input
              type="time"
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c]"
            />
          </div>
        </div>

        {/* Alamat */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Alamat Lengkap</label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            placeholder="Nama jalan, nomor rumah, patokan..."
            required
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c] placeholder:text-gray-400"
          ></textarea>
        </div>

        {/* Catatan Tambahan */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Catatan (Opsional)</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Contoh: Noda tinta di bagian kiri..."
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c] placeholder:text-gray-400"
          />
        </div>

        {/* Tombol Submit */}
        <button
          type="submit"
          disabled={isSubmitting || loadingServices}
          className="w-full py-4 mt-4 bg-[#be9020] text-white font-bold rounded-xl shadow-lg shadow-[#be9020]/30 hover:bg-[#a37a1b] hover:shadow-[#be9020]/50 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Memproses...
            </span>
          ) : (
            "Booking Sekarang 🚀"
          )}
        </button>
      </form>
    </motion.div>
  );
}