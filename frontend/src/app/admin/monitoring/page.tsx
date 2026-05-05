"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import AnalyticsChart from "@/components/admin/AnalyticsChart";
import StatusPieChart from "@/components/admin/StatusPieChart";

interface AnalyticsData {
  daily: { date: string; total: number }[];
  monthly: { date: string; total: number }[];
  status: { status: string; total: number }[];
}

export default function MonitoringPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/admin/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Gagal memuat analitik", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-10 text-center animate-pulse text-[#393E46]">Memuat Data Analitik...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#393E46]">Monitoring & Analytics</h1>
        <p className="text-sm text-[#393E46]/60">Analisis pertumbuhan pesanan dan tren bisnis.</p>
      </div>

      {/* 1. GRAFIK TREN (Area Chart) */}
      {data && <AnalyticsChart data={data} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. DISTRIBUSI PESANAN (Pie Chart) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-[#be9020]/20">
          <h3 className="font-bold text-[#393E46] mb-4">Distribusi Status Pesanan</h3>
          {data && <StatusPieChart data={data.status} />}
        </div>

        {/* 3. PREDIKSI TREN */}
        <div className="bg-gradient-to-br from-[#be9020]/10 to-[#F9F8F6] p-6 rounded-xl border border-[#be9020]/20 flex flex-col items-center justify-center text-center">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4 border border-[#be9020]/10">
                <span className="text-2xl">✨</span>
            </div>
            <h3 className="font-bold text-[#393E46] mb-2">AI Trend Prediction</h3>
            <p className="text-sm text-[#be9020] mb-4">
                Fitur ini akan memprediksi lonjakan pesanan minggu depan berdasarkan data historis kamu.
            </p>
            <span className="px-3 py-1 bg-[#be9020]/20 text-[#be9020] text-xs font-bold rounded-full uppercase tracking-wide">
                Coming Soon
            </span>
        </div>
      </div>
    </div>
  );
}