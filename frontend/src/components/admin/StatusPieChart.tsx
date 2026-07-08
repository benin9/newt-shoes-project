"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#FBBF24", "#3B82F6", "#6366F1", "#10B981", "#EF4444"]; // Yellow, Blue, Indigo, Green, Red

export default function StatusPieChart({ data }: { data: { status: string; total: number }[] }) {
  // Format data agar sesuai Recharts (pastikan total number)
  const chartData = data.map(item => ({
    name: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize
    value: Number(item.total)
  }));

  if (chartData.length === 0) return <div className="text-center text-gray-400 py-10">Belum ada data.</div>;

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60} // Membuat efek Donut
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => {
              const count = Number(value ?? 0);
              return `${count} Order`;
            }}
            labelFormatter={() => "Jumlah"}
            contentStyle={{ borderRadius: "8px", border: "none" }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}