"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  // 1. Proteksi Halaman Admin
  useEffect(() => {
    setMounted(true);
    if (!isLoading && (!user || user.role !== "admin")) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Tampilkan Loading State
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F8F6]">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#be9020] border-t-transparent"></div>
          <span className="text-[#393E46] font-medium text-sm">Memverifikasi Akses Admin...</span>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  // 2. Helper untuk Styling Menu Aktif
  const getMenuClass = (path: string) => {
    const isActive = pathname === path;
    return `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
      isActive
        ? "bg-[#be9020] text-white shadow-lg shadow-[#be9020]/30 translate-x-1" // Style Aktif (Gold)
        : "text-[#393E46]/70 hover:bg-[#be9020]/10 hover:text-[#be9020] hover:translate-x-1" // Style Tidak Aktif
    }`;
  };

  return (
    // Background Utama diganti ke #F9F8F6
    <div className="flex min-h-screen bg-[#F9F8F6] font-sans text-[#393E46]">
      
      {/* --- SIDEBAR (Desktop) --- */}
      <aside className="w-64 bg-white hidden md:flex flex-col fixed inset-y-0 left-0 z-20 border-r border-[#be9020]/10 shadow-sm">
        {/* Header Sidebar */}
        <div className="p-6 border-b border-[#be9020]/10 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#be9020] rounded-lg flex items-center justify-center text-white font-bold">
            N
          </div>
          <h2 className="text-xl font-extrabold text-[#393E46] tracking-tight">
            Newt<span className="text-[#be9020]">Admin</span>
          </h2>
        </div>
        
        {/* Menu Navigasi */}
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
          {/* Kategori: MAIN MENU */}
          <div className="px-4 py-2 text-xs font-bold text-[#393E46]/50 uppercase tracking-wider">
            Main Menu
          </div>
          
          <Link href="/admin" className={getMenuClass("/admin")}>
            <span>🏠</span> Dashboard
          </Link>
          
          <Link href="/admin/monitoring" className={getMenuClass("/admin/monitoring")}>
            <span>📈</span> Monitoring
          </Link>

          {/* Kategori: OPERASIONAL */}
          <div className="px-4 py-2 mt-4 text-xs font-bold text-[#393E46]/50 uppercase tracking-wider">
            Operasional
          </div>

          <Link href="/admin/bookings" className={getMenuClass("/admin/bookings")}>
            <span>📦</span> Pesanan Masuk
          </Link>

          <Link href="/delivery" className={getMenuClass("/delivery")}>
            <span>🛵</span> Delivery Panel
          </Link>

          <Link href="/admin/services" className={getMenuClass("/admin/services")}>
            <span>🏷️</span> Layanan & Harga
          </Link>

           {/* Placeholder Settings */}
           <button disabled className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 cursor-not-allowed mt-2">
            <span>⚙️</span> Pengaturan
          </button>
        </nav>

        {/* Footer Sidebar (User Profile) */}
        <div className="p-4 border-t border-[#be9020]/10 bg-[#F9F8F6]">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-[#be9020]/20 flex items-center justify-center text-xs font-bold text-[#be9020] uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#393E46] truncate">{user.name}</p>
              <p className="text-xs text-[#393E46]/60 truncate">Administrator</p>
            </div>
          </div>
          <Link 
            href="/" 
            className="flex items-center justify-center w-full py-2 px-4 text-sm font-bold text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg transition-colors shadow-sm"
          >
            Keluar ke Home
          </Link>
        </div>
      </aside>

      {/* --- CONTENT WRAPPER --- */}
      <div className="flex-1 md:ml-64 transition-all duration-300 flex flex-col min-h-screen">
        
        {/* Header Mobile */}
        <header className="md:hidden bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-30 border-b border-[#be9020]/10">
          <div className="flex items-center gap-2">
             <span className="font-extrabold text-lg text-[#be9020]">NewtAdmin</span>
          </div>
          <div className="flex gap-4 text-sm font-medium">
             <Link href="/admin" className={pathname === "/admin" ? "text-[#be9020]" : "text-[#393E46]/60"}>Home</Link>
             <Link href="/admin/bookings" className={pathname === "/admin/bookings" ? "text-[#be9020]" : "text-[#393E46]/60"}>Order</Link>
             <Link href="/" className="text-red-500">Exit</Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

        {/* Footer Admin Kecil */}
        <footer className="p-6 text-center text-xs text-[#393E46]/40 mt-auto">
          &copy; {new Date().getFullYear()} Newt Shoes & Clean Admin Panel.
        </footer>
      </div>
    </div>
  );
}