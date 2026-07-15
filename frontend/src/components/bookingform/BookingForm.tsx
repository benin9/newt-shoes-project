"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { bookingApi, servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface ServiceData {
  id: number;
  name: string;
  price: number;
}

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [services, setServices] = useState<ServiceData[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    serviceId: "",
    serviceName: "",
    shoeType: "",
    pickupDate: "",
    pickupTime: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data || []);

        const preSelectedService = searchParams.get("service");
        if (preSelectedService && data && data.length > 0) {
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
        toast.error("Gagal memuat daftar layanan.");
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "serviceId") {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.serviceName) {
      toast.error("Silakan pilih layanan terlebih dahulu");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      service: formData.serviceName,
      shoe_type: formData.shoeType,
      pickup_address: formData.address,
      pickup_date: formData.pickupDate,
      pickup_time: formData.pickupTime,
      notes: formData.notes
    };

    try {
      const res = await bookingApi.create(payload);
      if (res?.error) throw new Error(res.error);
      toast.success('Pesanan berhasil dibuat!');
      router.push('/my-bookings');
    } catch (err: any) {
      toast.error(`Gagal: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-[#be9020]/20 w-full max-w-lg"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#3a2f1c]">Formulir Pemesanan</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Form Fields Anda */}
        <div className="space-y-1">
          <label className="text-sm font-semibold text-[#3a2f1c]">Pilih Layanan</label>
          {loadingServices ? (
             <div className="h-10 w-full bg-gray-100 rounded-xl animate-pulse"></div>
          ) : (
            <select name="serviceId" value={formData.serviceId} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb] border-transparent focus:border-[#be9020] transition-all text-[#3a2f1c]">
              <option value="" disabled>-- Pilih Paket --</option>
              {services.map((svc) => (
                <option key={svc.id} value={svc.id}>{svc.name} — Rp {svc.price.toLocaleString("id-ID")}</option>
              ))}
            </select>
          )}
        </div>

        <input type="text" name="shoeType" placeholder="Jenis Sepatu" value={formData.shoeType} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb]" />
        
        <div className="grid grid-cols-2 gap-4">
            <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb]" />
            <input type="time" name="pickupTime" value={formData.pickupTime} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb]" />
        </div>

        <textarea name="address" placeholder="Alamat Lengkap" value={formData.address} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl bg-[#f9f5eb]" rows={3}></textarea>

        <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#be9020] text-white font-bold rounded-xl">
          {isSubmitting ? "Memproses..." : "Booking Sekarang 🚀"}
        </button>
      </form>
    </motion.div>
  );
}