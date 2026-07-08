"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-hot-toast";

// Ambil URL Backend secara dinamis dari file .env.local atau dashboard cloud
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth(); // Ambil fungsi refresh session jika ada
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Menembak langsung ke API URL production/lokal secara dinamis
      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.message || "Login gagal. Kredensial salah.");
      }

      // Jika berhasil, ambil data user-nya
      const user = result.user || result.data?.user;
      
      if (user) {
        toast.success(`Selamat datang kembali, ${user.name}!`);

        // Simpan token ke localStorage jika backend mengembalikan token jwt/session
        if (result.token) {
          localStorage.setItem("token", result.token);
        }

        // Ambil ulang data session di context global
        if (refreshUser) refreshUser(); 

        // Pengecekan Role untuk melakukan Redirect halaman
        if (user.role === "admin") {
          router.push("/admin");
        } else if (user.role === "courier" || user.role === "delivery") {
          router.push("/delivery");
        } else {
          router.push("/booking");
        }
      } else {
        throw new Error("Data user tidak ditemukan dalam respons server.");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "Login gagal. Periksa koneksi internet atau kredensial kamu.");
      toast.error(err.message || "Login gagal.");
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
    <div className="min-h-screen bg-gradient-to-br from-[#F9F8F6] via-[#f4efe8] to-[#f7f1e9] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#be9020]/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#3a2f1c]">Welcome Back</h1>
            <p className="text-[#5c4a2f] mt-2">Login to your account</p>
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
                htmlFor="email"
                className="block text-sm font-semibold text-[#3a2f1c] mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-[#3a2f1c] mb-2"
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
                className="w-full px-4 py-3 rounded-xl border border-[#be9020]/30 focus:outline-none focus:ring-2 focus:ring-[#be9020] focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#be9020] text-white font-semibold py-3 rounded-xl hover:bg-[#a67c1c] transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#5c4a2f]">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="text-[#be9020] font-semibold hover:underline"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}