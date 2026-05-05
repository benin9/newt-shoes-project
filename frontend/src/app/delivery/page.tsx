"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

interface Task {
  id: number;
  user_name?: string;
  pickup_address: string;
  shoe_name: string;
  status: string;
  user_phone?: string;
}

export default function DeliveryDashboard() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek user login & role
    const user = authApi.getUser();
    if (!authApi.isAuthenticated() || !user) {
      router.push("/login");
      return;
    }
    if (user.role !== "admin" && user.role !== "courier") {
      router.push("/booking");
    } else {
      fetchTasks();
    }
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/delivery/tasks");
      setTasks(res.data);
    } catch (error) {
      toast.error("Gagal memuat tugas");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: number, action: string) => {
    const loadingToast = toast.loading("Mengupdate status...");
    try {
      await api.patch(`/delivery/${id}/update-status`, { action });
      toast.success("Status diperbarui!", { id: loadingToast });
      fetchTasks(); // Refresh list agar tombol berubah
    } catch (error) {
      toast.error("Gagal update", { id: loadingToast });
    }
  };

  // LOGIKA FILTER TUGAS
  // Pickup Tasks: Termasuk yang 'confirmed' (belum dijemput) DAN 'on_pickup' (sedang di jalan)
  const pickupTasks = tasks.filter(t => t.status === 'confirmed' || t.status === 'on_pickup');
  
  // Delivery Tasks: Termasuk 'processing' (siap antar) DAN 'on_delivery' (sedang di jalan)
  const deliveryTasks = tasks.filter(t => t.status === 'processing' || t.status === 'on_delivery');

  if (loading) return <div className="p-10 text-center">Memuat Tugas...</div>;

  return (
    <div className="min-h-screen bg-[#F9F8F6] p-4 md:p-6 font-sans text-[#393E46]">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-[#be9020]">Delivery Dashboard 🚚</h1>
            <button onClick={() => { authApi.logout(); router.push("/login"); }} className="text-red-500 text-sm font-bold bg-white px-3 py-1 rounded shadow">Logout</button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
            {/* =======================
                KOLOM TUGAS PENJEMPUTAN
               ======================= */}
            <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2 border-gray-200">
                    📍 Penjemputan <span className="bg-yellow-100 text-yellow-700 px-2 rounded text-sm">{pickupTasks.length}</span>
                </h2>
                <div className="space-y-4">
                    {pickupTasks.length === 0 && <p className="text-gray-400 text-sm italic">Tidak ada tugas jemput.</p>}
                    
                    {pickupTasks.map(task => (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                            {/* Indikator Status di Card */}
                            {task.status === 'on_pickup' && (
                                <div className="absolute top-0 right-0 bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                    SEDANG DI JALAN
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-2 mt-2">
                                <span className="font-bold text-lg">Order #{task.id}</span>
                                {task.user_phone && (
                                  <a href={`https://wa.me/${task.user_phone}`} target="_blank" className="text-green-600 text-xs font-bold border border-green-200 px-2 py-1 rounded hover:bg-green-50">
                                    WhatsApp
                                  </a>
                                )}
                            </div>
                            <p className="text-sm text-gray-800 font-bold mb-1">👟 {task.shoe_name}</p>
                            <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">🏠 {task.pickup_address}</p>
                            
                            {/* TOMBOL BERUBAH SESUAI STATUS */}
                            {task.status === 'confirmed' ? (
                                <button 
                                    onClick={() => handleAction(task.id, "start_pickup")}
                                    className="w-full bg-[#be9020] text-white py-3 rounded-lg font-bold hover:bg-[#a37a1b] transition shadow-lg shadow-orange-100"
                                >
                                    🛵 Jemput Sekarang
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleAction(task.id, "arrived_at_shop")}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                                >
                                    🏢 Sampai di Toko
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* =======================
                KOLOM TUGAS PENGANTARAN
               ======================= */}
            <div>
                <h2 className="font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2 border-gray-200">
                    📦 Pengantaran <span className="bg-blue-100 text-blue-700 px-2 rounded text-sm">{deliveryTasks.length}</span>
                </h2>
                <div className="space-y-4">
                    {deliveryTasks.length === 0 && <p className="text-gray-400 text-sm italic">Tidak ada tugas antar.</p>}
                    
                    {deliveryTasks.map(task => (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} key={task.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
                             {/* Indikator Status di Card */}
                             {task.status === 'on_delivery' && (
                                <div className="absolute top-0 right-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                                    SEDANG DI JALAN
                                </div>
                            )}

                             <div className="flex justify-between items-start mb-2 mt-2">
                                <span className="font-bold text-lg">Order #{task.id}</span>
                                {task.status === 'processing' && <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">SIAP ANTAR</span>}
                            </div>
                            <p className="text-sm text-gray-800 font-bold mb-1">👟 {task.shoe_name}</p>
                            <p className="text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">🏠 {task.pickup_address}</p>
                            
                            {/* TOMBOL BERUBAH SESUAI STATUS */}
                            {task.status === 'processing' ? (
                                <button 
                                    onClick={() => handleAction(task.id, "start_delivery")}
                                    className="w-full bg-[#393E46] text-white py-3 rounded-lg font-bold hover:bg-black transition shadow-lg shadow-gray-200"
                                >
                                    🛵 Antar Sekarang
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleAction(task.id, "finish_delivery")}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-lg shadow-green-100 flex items-center justify-center gap-2"
                                >
                                    ✅ Sampai di Alamat Tujuan
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}