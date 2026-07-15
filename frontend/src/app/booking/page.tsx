"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi, bookingApi, servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    snap: any;
  }
}

const DELIVERY_FEE = 15000;

interface ServiceData {
  id: number;
  name: string;
  price: number | string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");

  const [services, setServices] = useState<ServiceData[]>([]);
  const [useDelivery, setUseDelivery] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  // State Form Lengkap
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickup_address: "",
    shoe_name: "",  // Input Baru
    shoe_size: "",  // Input Baru
    shoe_type: "Sneakers",
    pickup_date: "",
    pickup_time: "",
    service: "",
    price: 0,
    notes: "",
  });

  // Auth Check
  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push("/login");
    } else {
      const user = authApi.getUser();
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || "",
        }));
      }
    }
  }, [router]);

  // Fetch Services
  useEffect(() => {
    const initBookingData = async () => {
      try {
        const data = await servicesApi.getAll(); 
        setServices(data);

        if (serviceFromUrl) {
          const preSelected = data.find((s: ServiceData) => s.name === serviceFromUrl);
          if (preSelected) {
            setFormData((prev) => ({
              ...prev,
              service: preSelected.name,
              price: Number(preSelected.price), 
            }));
            toast.success(`Paket "${preSelected.name}" terpilih!`);
          }
        }
      } catch (error) {
        console.error("Gagal load layanan", error);
        toast.error("Gagal memuat daftar layanan");
      } finally {
        setLoadingServices(false);
      }
    };

    initBookingData();
  }, [serviceFromUrl]);

  // Handle Input
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "service") {
      const selectedService = services.find((s) => s.name === value);
      setFormData((prev) => ({
        ...prev,
        service: value,
        price: selectedService ? Number(selectedService.price) : 0, 
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalEstimation = Number(formData.price) + (useDelivery ? DELIVERY_FEE : 0);

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.service) {
      toast.error("Mohon pilih layanan terlebih dahulu");
      setLoading(false);
      return;
    }

    const finalPrice = Math.round(totalEstimation);

    const payload = {
      service: formData.service,
      shoe_name: formData.shoe_name,
      shoe_size: formData.shoe_size,
      shoe_type: formData.shoe_type,
      pickup_address: useDelivery ? formData.pickup_address : "Drop di Toko (Self Service)",
      pickup_date: formData.pickup_date,
      pickup_time: formData.pickup_time,
      notes: formData.notes,
      total_price: finalPrice, 
    };

    try {
      const response = await bookingApi.create(payload);

      if (response.token) {
        // Jika mock token (untuk testing), langsung update status dan redirect
        if (response.isMock) {
          toast.success("✓ Pesanan Anda Berhasil Dibuat! (Mode Testing)");
          console.log("📋 Mock Payment Token:", response.token);
          await bookingApi.updatePaymentStatus(response.bookingId);
          setTimeout(() => {
            router.push("/my-bookings");
          }, 1500);
          return;
        }

        // Jika real token dari Midtrans
        if (window.snap) {
          window.snap.pay(response.token, {
            onSuccess: async function (result: any) {
              toast.success("Pembayaran Berhasil! Pesanan diproses.");
              await bookingApi.updatePaymentStatus(response.bookingId);
              router.push("/my-bookings");
            },
            onPending: function (result: any) {
              toast("Menunggu pembayaran...", { icon: "⏳" });
              router.push("/my-bookings");
            },
            onError: function (result: any) {
              toast.error("Pembayaran Gagal.");
              setLoading(false);
            },
            onClose: function () {
              toast.error("Kamu menutup pembayaran.");
              setLoading(false);
            },
          });
        } else {
          toast.error("Script pembayaran belum siap. Refresh halaman.");
          setLoading(false);
        }
      } else {
        throw new Error("Gagal mendapatkan token pembayaran");
      }

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan sistem");
      setLoading(false);
    }
  };

  return (
    // CONTAINER UTAMA: Full Cream (#F9F8F6) & Full Height (Split Screen)
    <div className="min-h-screen md:h-screen bg-[#F9F8F6] flex flex-col md:flex-row font-sans md:overflow-hidden text-[#393E46]">
      
      {/* ==============================================
          BAGIAN KIRI: BRANDING (FIXED)
         ============================================== */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-5/12 bg-[#F9F8F6] p-8 md:p-16 flex flex-col justify-center relative md:h-full z-10"
      >
         {/* Dekorasi Background Halus */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-[#be9020]/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#be9020]/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

        <div className="relative z-10 max-w-md mx-auto md:mx-0">
            {/* Badge */}
            <span className="inline-block px-4 py-2 rounded-full bg-[#be9020]/10 text-[#be9020] text-sm font-bold mb-6 border border-[#be9020]/20">
                Newt Shoes & Clean
            </span>

            {/* Headline Besar */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#393E46] leading-tight mb-2">
                Booking Layanan
            </h1>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#be9020] leading-tight mb-6">
                Cuci & Perawatan <br/> Sepatu
            </h1>

            {/* Deskripsi */}
            <p className="text-[#393E46]/70 text-lg mb-10 leading-relaxed">
                Percayakan sepatu favoritmu kepada tim profesional kami. Proses mudah, cepat, dan bisa pickup & delivery langsung ke rumah.
            </p>

            {/* List Fitur */}
            <ul className="space-y-5">
                {[
                    "Deep Cleaning & Treatment Profesional",
                    "Layanan Fleksibel sesuai Kebutuhan",
                    "Pickup & Delivery Aman"
                ].map((text, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-[#393E46] font-medium text-lg">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#be9020] flex items-center justify-center shadow-lg shadow-[#be9020]/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        {text}
                    </li>
                ))}
            </ul>
        </div>
      </motion.div>

      {/* ==============================================
          BAGIAN KANAN: FORM BOOKING (SCROLLABLE)
         ============================================== */}
      <motion.div 
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full md:w-7/12 bg-[#F9F8F6] md:h-full md:overflow-y-auto"
      >
        <div className="p-4 md:p-12 lg:p-16">
            <div className="max-w-xl mx-auto bg-white p-6 md:p-10 rounded-3xl shadow-xl border border-[#be9020]/10">
            
            {/* Header Mobile Only */}
            <div className="md:hidden mb-6 text-center">
                <h2 className="text-2xl font-bold text-[#393E46]">Isi Form Pemesanan</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* 1. Pilih Layanan */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-[#393E46] uppercase tracking-wider">Pilih Layanan</label>
                    {loadingServices ? (
                        <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    ) : (
                        <div className="relative">
                            <select
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                required
                                className="w-full appearance-none rounded-xl border border-gray-200 bg-[#F9F8F6] px-5 py-3 text-[#393E46] focus:border-[#be9020] focus:ring-1 focus:ring-[#be9020] outline-none font-semibold transition-all cursor-pointer"
                            >
                                <option value="" disabled>-- Pilih Paket --</option>
                                {services.map((svc) => (
                                <option key={svc.id} value={svc.name}>{svc.name}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#be9020]">▼</div>
                        </div>
                    )}
                    
                    {/* Rincian Harga */}
                    <div className="bg-[#be9020]/5 p-4 rounded-xl border border-[#be9020]/10 flex flex-col gap-2 mt-2">
                        <div className="flex justify-between text-sm text-[#393E46]/70">
                            <span>Harga Paket</span>
                            <span className="font-mono">Rp {Number(formData.price).toLocaleString("id-ID")}</span>
                        </div>
                        {useDelivery && (
                        <div className="flex justify-between text-sm text-[#393E46]/70">
                            <span>Biaya Antar Jemput</span>
                            <span className="font-mono">Rp {DELIVERY_FEE.toLocaleString("id-ID")}</span>
                        </div>
                        )}
                        <div className="flex justify-between items-center pt-2 mt-1 border-t border-[#be9020]/10">
                            <span className="font-bold text-[#393E46]">Total Estimasi</span>
                            <span className="text-xl font-bold text-[#be9020]">Rp {totalEstimation.toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                {/* 2. Data Diri */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama</label>
                    <input
                    name="name" value={formData.name} onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-2 focus:border-[#be9020] outline-none bg-transparent transition-colors font-medium text-[#393E46]"
                    placeholder="Nama Kamu" required
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">WhatsApp</label>
                    <input
                    name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full border-b-2 border-gray-200 py-2 focus:border-[#be9020] outline-none bg-transparent transition-colors font-medium text-[#393E46]"
                    placeholder="08..." required
                    />
                </div>
                </div>

                {/* 3. Detail Sepatu (INPUT BARU) */}
                <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-200 pb-2">
                        <span className="text-lg">👟</span>
                        <h3 className="font-bold text-[#393E46]">Detail Sepatu</h3>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5 mb-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Merk Sepatu</label>
                            <input
                                name="shoe_name" 
                                value={formData.shoe_name} 
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#be9020] outline-none text-[#393E46]"
                                placeholder="Contoh: Nike Air Force" 
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Ukuran</label>
                            <input
                                name="shoe_size" 
                                value={formData.shoe_size} 
                                onChange={handleChange}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#be9020] outline-none text-[#393E46]"
                                placeholder="ex: 42" 
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jenis Bahan</label>
                        <div className="relative">
                            <select
                            name="shoe_type" value={formData.shoe_type} onChange={handleChange}
                            className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-[#be9020] outline-none appearance-none cursor-pointer text-[#393E46]"
                            >
                            {["Sneakers", "Leather", "Suede", "Boots", "Canvas", "Sport", "Heels"].map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 text-xs">▼</div>
                        </div>
                    </div>
                </div>

                {/* 4. Delivery Toggle */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 flex items-start gap-3 cursor-pointer hover:bg-blue-100/50 transition-colors" onClick={() => setUseDelivery(!useDelivery)}>
                <input
                    type="checkbox"
                    id="useDelivery"
                    checked={useDelivery}
                    onChange={() => {}} // handled by parent div
                    className="mt-1 h-5 w-5 accent-blue-600 cursor-pointer"
                />
                <label htmlFor="useDelivery" className="text-sm text-[#393E46] cursor-pointer pointer-events-none">
                    <span className="font-bold block text-blue-800">Gunakan Layanan Antar Jemput</span>
                    <span className="text-xs text-blue-600/80">Kurir kami akan menjemput sepatumu (+Rp {DELIVERY_FEE.toLocaleString("id-ID")})</span>
                </label>
                </div>

                {useDelivery && (
                <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                >
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Alamat Lengkap</label>
                    <textarea
                    name="pickup_address" value={formData.pickup_address} onChange={handleChange}
                    rows={2}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:border-[#be9020] focus:ring-1 focus:ring-[#be9020] outline-none resize-none text-[#393E46]"
                    placeholder="Nama jalan, nomor rumah, patokan..." 
                    required={useDelivery}
                    />
                </motion.div>
                )}

                {/* 5. Jadwal */}
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tanggal Pickup</label>
                    <input
                    type="date" name="pickup_date" value={formData.pickup_date} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:border-[#be9020] outline-none cursor-pointer text-[#393E46]"
                    required
                    />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Jam Pickup</label>
                    <input
                    type="time" name="pickup_time" value={formData.pickup_time} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:border-[#be9020] outline-none cursor-pointer text-[#393E46]"
                    required
                    />
                </div>
                </div>

                {/* 6. Tombol Aksi */}
                <div className="pt-2">
                    <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#be9020] text-white font-bold py-4 rounded-xl hover:bg-[#a37a1b] transition-all shadow-lg shadow-[#be9020]/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 transform active:scale-[0.98]"
                    >
                    {loading ? (
                        <>
                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            <span>Memproses...</span>
                        </>
                    ) : (
                        <>
                        <span>Booking Sekarang</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </>
                    )}
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Pembayaran aman & terverifikasi oleh Midtrans
                    </p>
                </div>

            </form>
            </div>
        </div>
      </motion.div>
    </div>
  );
}