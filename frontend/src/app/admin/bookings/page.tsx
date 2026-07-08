"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Booking {
  id: number;
  user_name: string;
  user_email: string;
  user_phone?: string;
  service: string;
  shoe_type: string;
  pickup_date: string;
  pickup_time: string;
  pickup_address: string;
  status: 'pending' | 'confirmed' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/bookings");
      setBookings(res.data);
      setFilteredBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Gagal mengambil data pesanan. Cek koneksi server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    if (filterStatus !== "all") {
      result = result.filter((b) => b.status === filterStatus);
    }
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(
        (b) =>
          b.user_name.toLowerCase().includes(lowerTerm) ||
          b.user_email.toLowerCase().includes(lowerTerm) ||
          b.id.toString().includes(lowerTerm)
      );
    }
    setFilteredBookings(result);
  }, [searchTerm, filterStatus, bookings]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    setUpdatingId(id);
    const processPromise = api.patch(`/admin/bookings/${id}/status`, { status: newStatus });
    toast.promise(processPromise, {
      loading: 'Menyimpan perubahan...',
      success: (data) => {
        const updatedList = bookings.map((b) => 
          b.id === id ? { ...b, status: newStatus as any } : b
        );
        setBookings(updatedList);
        return `Status berhasil diubah menjadi ${newStatus}!`;
      },
      error: 'Gagal mengupdate status.',
    });
    try {
      await processPromise;
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing": return "bg-[#be9020]/20 text-[#8a6815] border-[#be9020]/30"; // GOLD theme
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-[#be9020] rounded-full mb-2"></div>
          <p className="text-[#393E46] font-medium">Memuat data pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* --- HEADER & TOOLBAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-[#be9020]/20">
        <div>
          <h1 className="text-2xl font-bold text-[#393E46]">Manajemen Pesanan</h1>
          <p className="text-sm text-[#393E46]/60">Kelola semua pesanan masuk di satu tempat.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Cari Nama / ID..."
              className="pl-10 pr-4 py-2 border border-[#be9020]/30 rounded-lg text-sm focus:ring-2 focus:ring-[#be9020] focus:border-[#be9020] w-full sm:w-64 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter Dropdown */}
          <select
            className="border border-[#be9020]/30 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#be9020] bg-white cursor-pointer hover:border-[#be9020] transition-all outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">📂 Semua Status</option>
            <option value="pending">⚠️ Pending</option>
            <option value="confirmed">✅ Confirmed</option>
            <option value="processing">⚙️ Processing</option>
            <option value="completed">🎉 Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>

          {/* Refresh Button */}
          <button 
            onClick={fetchBookings}
            className="p-2 text-gray-500 hover:text-[#be9020] hover:bg-[#be9020]/10 rounded-lg transition-colors"
            title="Refresh Data"
          >
            🔄
          </button>
        </div>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl shadow-sm border border-[#be9020]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#F9F8F6] text-[#393E46]/60 text-xs uppercase tracking-wider font-semibold border-b border-[#be9020]/10">
              <tr>
                <th className="px-6 py-4 w-20">ID</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Detail Layanan</th>
                <th className="px-6 py-4">Jadwal Pickup</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#be9020]/10 bg-white">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-[#F9F8F6] transition-colors group">
                    <td className="px-6 py-4 text-xs font-mono text-gray-400">
                      #{booking.id}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#393E46]">{booking.user_name}</span>
                        <span className="text-xs text-gray-500">{booking.user_email}</span>
                        {booking.user_phone && (
                          <span className="text-xs text-gray-400 mt-0.5">📞 {booking.user_phone}</span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-[#393E46] bg-[#F9F8F6] px-2 py-0.5 rounded w-fit">
                          {booking.service}
                        </span>
                        <span className="text-xs text-gray-500">Tipe: {booking.shoe_type}</span>
                        {booking.notes && (
                          <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100 italic mt-1">
                            &ldquo;Note:&nbsp;{booking.notes}&rdquo;
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-[#393E46] font-medium">
                          {new Date(booking.pickup_date).toLocaleDateString("id-ID", {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                        <span className="text-xs text-gray-500">Jam: {booking.pickup_time}</span>
                        <div className="group relative mt-1">
                          <span className="text-xs text-[#be9020] cursor-help border-b border-dashed border-[#be9020]/50 truncate max-w-[150px] inline-block">
                            📍 Lihat Alamat
                          </span>
                          <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 bg-[#393E46] text-[#F9F8F6] text-xs p-2 rounded shadow-lg z-10">
                            {booking.pickup_address}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="relative inline-block w-full">
                        <select
                          className={`appearance-none w-full text-sm border rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-[#be9020] cursor-pointer transition-all
                            ${updatingId === booking.id ? 'bg-gray-100 text-gray-400 cursor-wait' : 'bg-white border-[#be9020]/30 hover:border-[#be9020]'}
                          `}
                          value={booking.status}
                          disabled={updatingId === booking.id}
                          onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="confirmed">✅ Konfirmasi</option>
                          <option value="processing">⚙️ Proses</option>
                          <option value="completed">🎉 Selesai</option>
                          <option value="cancelled">❌ Batalkan</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                          </svg>
                        </div>
                        {updatingId === booking.id && (
                          <div className="absolute right-8 top-3">
                            <div className="animate-spin h-4 w-4 border-2 border-[#be9020] border-t-transparent rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-4xl mb-3">📭</span>
                      <p className="text-lg font-medium text-gray-500">Tidak ada data ditemukan</p>
                      <button 
                        onClick={() => {setSearchTerm(""); setFilterStatus("all");}}
                        className="mt-4 text-[#be9020] hover:underline text-sm"
                      >
                        Reset Filter
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-[#F9F8F6] px-6 py-4 border-t border-[#be9020]/10 text-xs text-gray-500 flex justify-between">
          <span>Menampilkan {filteredBookings.length} dari {bookings.length} total pesanan</span>
          <span>Data diurutkan dari yang terbaru</span>
        </div>
      </div>
    </div>
  );
}