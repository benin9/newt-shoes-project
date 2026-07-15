"use client";

import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  daily: { date: string; total: number }[];
  monthly: { date: string; total: number }[];
}

export default function AnalyticsChart({ data }: { data: ChartData }) {
  const [view, setView] = useState<"daily" | "monthly">("daily");

  // Pilih data berdasarkan tab yang aktif
  // Jika data null/undefined, gunakan array kosong agar tidak error
  const chartData = view === "daily" ? (data?.daily || []) : (data?.monthly || []);

  // Format tanggal agar lebih mudah dibaca (YYYY-MM-DD -> DD MMM)
  const formatXAxis = (tickItem: string) => {
    if (!tickItem) return "";
    const date = new Date(tickItem);
    if (view === "daily") {
      return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
    } else {
      return date.toLocaleDateString("id-ID", { month: "short", year: "2-digit" });
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Tren Pemesanan</h2>
          <p className="text-sm text-gray-500">
            Monitoring performa {view === "daily" ? "7 hari terakhir" : "tahun ini"}
          </p>
        </div>

        {/* Toggle Button */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setView("daily")}
            className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${
              view === "daily"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Harian
          </button>
          <button
            onClick={() => setView("monthly")}
            className={`px-4 py-1 text-sm font-medium rounded-md transition-all ${
              view === "monthly"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Bulanan
          </button>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatXAxis} 
              stroke="#9CA3AF" 
              fontSize={12}
              tickMargin={10}
            />
            <YAxis stroke="#9CA3AF" fontSize={12} allowDecimals={false} />
            <Tooltip 
              contentStyle={{ borderRadius: "8px", border: "none" }}
              // Ubah baris formatter menjadi ini:
              formatter={(value: any) => [`${value ?? 0} Order`, "Jumlah"]}
            />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3B82F6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorTotal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}