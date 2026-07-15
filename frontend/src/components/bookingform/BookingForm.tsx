"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
<<<<<<< HEAD
import { bookingApi, servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

=======
import { bookingApi, servicesApi } from "@/lib/api"; // Pastikan import servicesApi ada
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

// Interface untuk data layanan dari API
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
interface ServiceData {
  id: number;
  name: string;
  price: number;
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
<<<<<<< HEAD
=======
  // State Data
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

<<<<<<< HEAD
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    serviceName: "",
=======
  // State Form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "", // Kita simpan ID layanan, bukan string nama
    serviceName: "", // Untuk display/validasi
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
    shoeType: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
    notes: "",
  });

<<<<<<< HEAD
=======
  // 1. Fetch Daftar Layanan saat komponen dimuat
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
<<<<<<< HEAD
        setServices(data || []);

        const preSelectedService = searchParams.get("service");
        if (preSelectedService && data && data.length > 0) {
=======
        setServices(data);

        // Cek apakah ada query param dari halaman Pricing (misal: ?service=Deep%20Clean)
        const preSelectedService = searchParams.get("service");
        if (preSelectedService && data.length > 0) {
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
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
<<<<<<< HEAD
        toast.error("Gagal memuat daftar layanan.");
=======
        toast.error("Gagal memuat daftar layanan. Cek koneksi internet.");
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [searchParams]);

<<<<<<< HEAD
=======
  // Handle Input Change
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "serviceId") {
<<<<<<< HEAD
=======
      // Jika user memilih layanan, update juga nama servicenya untuk dikirim ke API
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
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

<<<<<<< HEAD
=======
  // Handle Submit
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

<<<<<<< HEAD
=======
    // Validasi sederhana
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
    if (!formData.serviceName) {
      toast.error("Silakan pilih layanan terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

<<<<<<< HEAD
    const payload = {
      service: formData.serviceName,
=======
    // Persiapan data untuk API
    // Sesuaikan field ini dengan apa yang backend 'bookingApi.create' harapkan
    const payload = {
      service: formData.serviceName, // Backend butuh string nama layanan
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
      shoe_type: formData.shoeType,
      pickup_address: formData.address,
      pickup_date: formData.pickupDate,
      pickup_time: formData.pickupTime,
      notes: formData.notes
    };

<<<<<<< HEAD
    try {
      const res = await bookingApi.create(payload);
      if (res?.error) throw new Error(res.error);
      
      toast.success("Pesanan berhasil dibuat!");
      router.push('/my-bookings');
    } catch (err: any) {
      toast.error(`Gagal: ${err.message || 'Terjadi kesalahan'}`);
=======
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
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
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
<<<<<<< HEAD
=======
        
        {/* Pilih Layanan (DINAMIS DARI DB) */}
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
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
<<<<<<< HEAD
              {services?.map((svc) => (
=======
              {services.map((svc) => (
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
                <option key={svc.id} value={svc.id}>
                  {svc.name} — Rp {svc.price.toLocaleString("id-ID")}
                </option>
              ))}
            </select>
          )}
        </div>

<<<<<<< HEAD
=======
        {/* Jenis Sepatu */}
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Jenis Sepatu</label>
          <input
            type="text"
            name="shoeType"
            value={formData.shoeType}
            onChange={handleChange}
            placeholder="Contoh: Sneakers Putih, Boots Kulit, dll"
            required
<<<<<<< HEAD
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c]"
          />
        </div>

=======
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c] placeholder:text-gray-400"
          />
        </div>

        {/* Jadwal Pickup (Grid 2 Kolom) */}
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
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

<<<<<<< HEAD
=======
        {/* Alamat */}
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Alamat Lengkap</label>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            placeholder="Nama jalan, nomor rumah, patokan..."
            required
<<<<<<< HEAD
            className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] focus:bg-white focus:ring-0 transition-all text-[#3a2f1c]"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || loadingServices}
          className="w-full py-4 mt-4 bg-[#be9020] text-white font-bold rounded-xl hover:bg-[#a37a1b] transition-all disabled:opacity-70"
        >
          {isSubmitting ? "Memproses..." : "Booking Sekarang 🚀"}
=======
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
>>>>>>> 30e01891e008c52fbde9746b3d6a7227648b383c
        </button>
      </form>
    </motion.div>
  );
}