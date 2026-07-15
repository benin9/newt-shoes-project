"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi, bookingApi } from "@/lib/api";

// 1. Update Interface agar sesuai Database & Backend
interface Booking {
  id: number;
  service: string;
  shoe_name?: string; // Baru
  shoe_size?: string; // Baru
  shoe_type: string;
  pickup_address: string;
  pickup_date: string;
  pickup_time: string;
  status: string;
  created_at: string;
  total_price?: number; 
  notes?: string;
}

export default function MyBookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push("/login");
      return;
    }
    fetchBookings();
  }, [router]);

  const fetchBookings = async () => {
    try {
      const result = await bookingApi.getAll();

      if (result.error) {
        setError(result.error);
      } else {
        // Safe check: pastikan data array
        const dataBookings = Array.isArray(result.data) ? result.data : [];
        setBookings(dataBookings);
      }
    } catch (err) {
      setError("Gagal memuat riwayat booking.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Helper: Mengubah Status Teknis jadi Bahasa Manusia (User Friendly)
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Menunggu Pembayaran";
      case "confirmed": return "Menunggu Kurir"; // Status awal setelah bayar
      
      case "on_pickup": 
        return "Sedang menuju ke alamat tujuan."; // <--- Request: Kurir OTW Jemput
      
      case "processing": return "Sedang Dicuci / Diproses"; // Setelah sampai toko
      
      case "on_delivery": 
        return "Sedang diantar ke alamat tujuan."; // <--- Request: Kurir OTW Antar
      
      case "completed": return "✅ Selesai"; // Setelah sampai alamat user
      case "cancelled": return "❌ Dibatalkan";
      default: return status;
    }
  };

  // 3. Helper: Warna Badge Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "on_pickup": return "bg-orange-100 text-orange-800 border-orange-200"; // Warna Jemput
      case "processing": return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "on_delivery": return "bg-purple-100 text-purple-800 border-purple-200"; // Warna Antar
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] py-12 px-4 text-[#393E46]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Page */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#393E46]">My Bookings</h1>
              <p className="text-[#393E46]/70 mt-1">Riwayat & Lacak Status Pesanan</p>
            </div>
            <button
              onClick={() => router.push("/booking")}
              className="bg-[#be9020] text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#a67c1c] transition-all shadow-md flex items-center gap-2"
            >
              <span>+</span> Booking Baru
            </button>
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-10 h-10 border-4 border-[#be9020] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-400">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl shadow-sm border border-[#be9020]/10">
              <p className="text-gray-400 text-lg mb-4">Belum ada riwayat booking.</p>
              <button
                onClick={() => router.push("/booking")}
                className="text-[#be9020] font-bold hover:underline"
              >
                Buat pesanan pertamamu sekarang
              </button>
            </div>
          ) : (
            
            /* --- LIST BOOKING --- */
            <div className="space-y-6">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#be9020]/10 hover:shadow-md transition-shadow"
                >
                  {/* Bagian Atas: Service & Status */}
                  <div className="flex flex-col md:flex-row justify-between md:items-start mb-4 gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#393E46]">
                        {booking.service}
                      </h3>
                      {/* Tampilkan Pesan Status yang Ramah */}
                      <p className="text-sm font-bold text-[#be9020] mt-1">
                         {getStatusLabel(booking.status)}
                      </p>
                      <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mt-1">
                        ORDER #{booking.id}
                      </p>
                    </div>
                    
                    {/* Badge Status */}
                    <div className="self-start">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(booking.status)}`}>
                        {booking.status.replace('_', ' ')}
                        </span>
                    </div>
                  </div>

                  {/* Bagian Tengah: Detail Info */}
                  <div className="grid md:grid-cols-2 gap-4 text-sm text-[#393E46]/80 border-t border-dashed border-[#be9020]/20 pt-4">
                    
                    {/* Detail Sepatu (NEW) */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1 font-bold uppercase">Detail Sepatu</p>
                      <p className="font-bold text-[#393E46] text-base">
                        {booking.shoe_name || "Nama Tidak Dicantumkan"}
                      </p>
                      <p className="text-xs text-gray-500">
                         {booking.shoe_type} • Size: {booking.shoe_size || "-"}
                      </p>
                    </div>

                    {/* Jadwal Pickup */}
                    <div>
                      <p className="text-gray-400 text-xs mb-1 font-bold uppercase">Jadwal Pickup</p>
                      <p className="font-medium">
                         {new Date(booking.pickup_date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-500">
                         Jam: {booking.pickup_time}
                      </p>
                    </div>

                    {/* Alamat */}
                    <div className="md:col-span-2">
                       <p className="text-gray-400 text-xs mb-1 font-bold uppercase">Alamat Jemput / Antar</p>
                       <p className="font-medium bg-[#F9F8F6] p-2 rounded-lg border border-[#be9020]/10">
                        {booking.pickup_address}
                       </p>
                    </div>

                    {/* Catatan & Harga */}
                    {booking.notes && (
                      <div className="md:col-span-2 bg-yellow-50 p-2 rounded-lg text-xs">
                        <span className="font-bold text-yellow-700">Catatan:</span> <span className="text-yellow-800">{booking.notes}</span>
                      </div>
                    )}
                    
                    {/* Total Harga */}
                    {booking.total_price && (
                        <div className="md:col-span-2 flex justify-between items-center border-t border-[#be9020]/10 pt-2 mt-1">
                            <span className="font-bold text-gray-500">Total Biaya</span>
                            <span className="font-bold text-[#be9020] text-lg">
                                Rp {Number(booking.total_price).toLocaleString("id-ID")}
                            </span>
                        </div>
                    )}

                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}