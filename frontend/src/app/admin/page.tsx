"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";

// Definisikan Interface untuk Data Statistik Utama dari Django Backend
interface DashboardStats {
  total_users: number;
  total_bookings: number;
  status_breakdown: { status: string; count: number }[];
  recent_activity: {
    id: number;
    user_name: string;
    service: string;
    status: string;
    created_at: string;
  }[];
}

// Interface Tipe Data untuk Komponen StatsCard agar Bebas dari Eror 'any'
interface StatsCardProps {
  label: string;
  value: number | undefined;
  icon: string;
  color: "gold" | "dark" | "yellow" | "green";
  highlight?: boolean;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/admin/dashboard-stats");
        setStats(res.data);
      } catch (err) {
        console.error("Gagal memuat statistik admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // Fungsi pembantu untuk mengambil kalkulasi jumlah status tertentu
  const getCount = (status: string): number =>
    stats?.status_breakdown.find((s) => s.status === status)?.count || 0;

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse text-[#393E46] font-medium">
        Memuat Dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* --- HEADER BAR --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-[#be9020]/20 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-[#393E46]">Halo, Admin! 👋</h1>
          <p className="text-[#393E46]/60 text-sm mt-1">
            Ada <span className="font-bold text-[#be9020]">{getCount("pending")} pesanan baru</span> yang perlu diproses hari ini.
          </p>
        </div>
        <Link
          href="/admin/bookings"
          className="px-6 py-2.5 bg-[#be9020] text-white font-medium rounded-lg hover:bg-[#a37a1b] transition shadow-lg shadow-[#be9020]/30 text-sm"
        >
          Kelola Pesanan →
        </Link>
      </div>

      {/* --- CARDS GRID STATISTIK --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          label="Total Pengguna"
          value={stats?.total_users}
          icon="👥"
          color="gold"
        />
        <StatsCard
          label="Total Pesanan"
          value={stats?.total_bookings}
          icon="📦"
          color="dark"
        />
        <StatsCard
          label="Perlu Proses"
          value={getCount("pending")}
          icon="⏳"
          color="yellow"
          highlight
        />
        <StatsCard
          label="Selesai"
          value={getCount("completed")}
          icon="✅"
          color="green"
        />
      </div>

      {/* --- TABEL DAFTAR PESANAN MASUK TERBARU --- */}
      <div className="bg-white rounded-xl shadow-sm border border-[#be9020]/10 overflow-hidden">
        <div className="px-6 py-5 border-b border-[#be9020]/10 flex justify-between items-center bg-[#F9F8F6]">
          <h2 className="font-bold text-[#393E46]">Pesanan Masuk Terbaru</h2>
          <Link
            href="/admin/bookings"
            className="text-xs font-semibold text-[#be9020] hover:underline"
          >
            Lihat Semua
          </Link>
        </div>

        <div className="divide-y divide-[#be9020]/10">
          {!stats?.recent_activity || stats.recent_activity.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              Belum ada pesanan masuk.
            </div>
          ) : (
            stats.recent_activity.map((item) => (
              <div
                key={item.id}
                className="p-4 flex items-center justify-between hover:bg-[#F9F8F6]/50 transition"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${
                      item.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    #{item.id}
                  </div>
                  <div>
                    <p className="font-semibold text-[#393E46] text-sm">
                      {item.user_name}
                    </p>
                    <p className="text-xs text-[#393E46]/60">{item.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StatusBadge status={item.status} />
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- SUB-KOMPONEN KECIL (SUDAH STABIL & FULLY TYPED) ---

function StatsCard({ label, value, icon, color, highlight }: StatsCardProps) {
  const colors: Record<string, string> = {
    gold: "bg-[#be9020]/10 text-[#be9020]",
    dark: "bg-[#393E46]/10 text-[#393E46]",
    yellow: "bg-yellow-50 text-yellow-600",
    green: "bg-green-50 text-green-600",
  };

  return (
    <div
      className={`p-6 rounded-xl border bg-white flex items-center justify-between transition-all duration-300 ${
        highlight
          ? "ring-2 ring-yellow-400 border-transparent shadow-md"
          : "border-[#be9020]/10 shadow-sm hover:shadow"
      }`}
    >
      <div>
        <p className="text-xs font-bold text-[#393E46]/50 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-extrabold text-[#393E46] mt-2">
          {value ?? 0}
        </p>
      </div>
      <div className={`p-3 rounded-lg ${colors[color] || colors.dark}`}>
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    processing: "bg-[#be9020]/20 text-[#be9020]", // Menggunakan warna tema aksen emas Anda
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status}
    </span>
  );
}