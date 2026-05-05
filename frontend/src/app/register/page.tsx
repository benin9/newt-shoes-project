"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { authApi } from "@/lib/api";
import { toast } from "react-hot-toast"; // Import Toast untuk notifikasi

export default function RegisterPage() {
  const router = useRouter();
  
  // State form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Panggil API Register
      const result = await authApi.register(
        formData.name,
        formData.email,
        formData.password,
        formData.phone
      );

      if (result.error) {
        setError(result.error);
        setLoading(false);
      } else {
        // --- MODIFIKASI DI SINI ---
        // 2. Jika sukses, tampilkan notifikasi & redirect ke Login
        toast.success("Registrasi berhasil! Silakan login.");
        
        // Beri jeda sedikit agar user bisa membaca pesan sukses (optional)
        setTimeout(() => {
            router.push("/login");
        }, 1500);
      }
    } catch (err) {
      setError("Terjadi kesalahan saat mendaftar.");
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#f4efe8] to-[#f7f1e9] flex items-center justify-center px-4 py-12 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#be9020]/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#393E46]">
              Create Account
            </h1>
            <p className="text-[#393E46]/70 mt-2">Join us today</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-[#393E46] mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all text-[#393E46]"
                placeholder="Namakamuuu"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-[#393E46] mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all text-[#393E46]"
                placeholder="emailmuuuu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-semibold text-[#393E46] mb-2"
              >
                Phone (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all text-[#393E46]"
                placeholder="08123456789"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#393E46] mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all text-[#393E46]"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#be9020] text-white font-semibold py-3 rounded-xl hover:bg-[#a67c1c] transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#393E46]/70">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#be9020] font-semibold hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}