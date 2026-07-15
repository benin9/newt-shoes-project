"use client";

import { useEffect, useState } from "react";
import { servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  const fetchServices = async () => {
    try {
      const data = await servicesApi.getAll();
      setServices(data);
    } catch (error) {
      toast.error("Gagal memuat data layanan");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenModal = (service?: Service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        duration: service.duration,
      });
    } else {
      setEditingService(null);
      setFormData({ name: "", description: "", price: "", duration: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading("Menyimpan data...");
    
    try {
      if (editingService) {
        await servicesApi.update(editingService.id, formData);
        toast.success("Layanan berhasil diperbarui!", { id: loadingToast });
      } else {
        await servicesApi.create(formData);
        toast.success("Layanan baru berhasil ditambahkan!", { id: loadingToast });
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      toast.error("Gagal menyimpan data.", { id: loadingToast });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus layanan ini?")) return;
    const loadingToast = toast.loading("Menghapus...");
    try {
      await servicesApi.delete(id);
      toast.success("Layanan dihapus.", { id: loadingToast });
      fetchServices();
    } catch (error) {
      toast.error("Gagal menghapus.", { id: loadingToast });
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse text-[#393E46]">Memuat Layanan...</div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[#393E46]">Manajemen Layanan & Harga</h1>
          <p className="text-sm text-[#393E46]/60">Atur daftar layanan cuci sepatu yang tersedia di website.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-[#be9020] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#a37a1b] transition shadow-lg shadow-[#be9020]/30 flex items-center gap-2"
        >
          <span>+</span> Tambah Layanan
        </button>
      </div>

      {/* --- TABEL LAYANAN --- */}
      <div className="bg-white rounded-xl shadow-sm border border-[#be9020]/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#F9F8F6] text-[#393E46]/60 text-xs uppercase tracking-wider font-semibold border-b border-[#be9020]/10">
            <tr>
              <th className="px-6 py-4">Nama Layanan</th>
              <th className="px-6 py-4">Deskripsi</th>
              <th className="px-6 py-4">Estimasi Waktu</th>
              <th className="px-6 py-4">Harga</th>
              <th className="px-6 py-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#be9020]/10">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-[#F9F8F6] transition">
                <td className="px-6 py-4 font-semibold text-[#393E46]">{service.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{service.description}</td>
                <td className="px-6 py-4 text-sm text-gray-600 bg-[#F9F8F6] rounded w-fit my-2 mx-6 border border-[#be9020]/10">⏱ {service.duration}</td>
                <td className="px-6 py-4 font-bold text-[#be9020]">
                  Rp {Number(service.price).toLocaleString("id-ID")}
                </td>
                <td className="px-6 py-4 flex justify-center gap-2">
                  <button 
                    onClick={() => handleOpenModal(service)}
                    className="p-2 text-[#be9020] hover:bg-[#be9020]/10 rounded transition"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="p-10 text-center text-gray-400">Belum ada layanan. Silakan tambah baru.</div>
        )}
      </div>

      {/* --- MODAL FORM --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#393E46]/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[#be9020]/10 flex justify-between items-center bg-[#F9F8F6]">
              <h3 className="font-bold text-lg text-[#393E46]">
                {editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#393E46] mb-1">Nama Layanan</label>
                <input 
                  type="text" required 
                  className="w-full border border-[#be9020]/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#be9020] outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="Contoh: Deep Clean"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#393E46] mb-1">Harga (Rp)</label>
                  <input 
                    type="number" required 
                    className="w-full border border-[#be9020]/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#be9020] outline-none"
                    value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    placeholder="35000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#393E46] mb-1">Durasi</label>
                  <input 
                    type="text" required 
                    className="w-full border border-[#be9020]/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#be9020] outline-none"
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    placeholder="2-3 Hari"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#393E46] mb-1">Deskripsi Singkat</label>
                <textarea 
                  required rows={3}
                  className="w-full border border-[#be9020]/30 rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#be9020] outline-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Jelaskan detail layanan ini..."
                />
              </div>

              <div className="pt-2 flex gap-3 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-[#be9020] text-white rounded-lg font-bold hover:bg-[#a37a1b] transition shadow-lg shadow-[#be9020]/30"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}