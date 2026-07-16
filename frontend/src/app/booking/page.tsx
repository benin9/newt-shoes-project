"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi, bookingApi, servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";

declare global { interface Window { snap: any; } }
const DELIVERY_FEE = 15000;

interface ServiceData { id: number; name: string; price: number | string; }

export default function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");

  const [services, setServices] = useState<ServiceData[]>([]);
  const [useDelivery, setUseDelivery] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", pickup_address: "", shoe_name: "", shoe_size: "",
    shoe_type: "Sneakers", pickup_date: "", pickup_time: "", service: "", price: 0, notes: ""
  });

  useEffect(() => {
    if (!authApi.isAuthenticated()) { router.push("/login"); return; }
    const user = authApi.getUser();
    if (user) setFormData(prev => ({ ...prev, name: user.name || "", phone: user.phone || "" }));
    
    const initBookingData = async () => {
      try {
        const data = await servicesApi.getAll(); 
        setServices(data);

        if (serviceFromUrl) {
          const preSelected = data.find((s: ServiceData) => s.name === serviceFromUrl);
          if (preSelected) setFormData(prev => ({ ...prev, service: preSelected.name, price: Number(preSelected.price) }));
        }
      } catch (error) { toast.error("Gagal memuat layanan"); }
    };
    initBookingData();
  }, [serviceFromUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const total = Number(formData.price) + (useDelivery ? DELIVERY_FEE : 0);
    try {
      const res = await bookingApi.create({ ...formData, total_price: Math.round(total), pickup_address: useDelivery ? formData.pickup_address : "Self Service" });
      if (res.token && window.snap) {
        window.snap.pay(res.token, {
          onSuccess: async () => { await bookingApi.updatePaymentStatus(res.bookingId); router.push("/my-bookings"); },
          onClose: () => setLoading(false),
        });
      }
    } catch (error: any) { toast.error(error.message); setLoading(false); }
  };

  return (
  <div className="min-h-screen flex items-center justify-center">
    <h1 className="text-4xl font-bold text-red-500">
      Booking Page
    </h1>
  </div>
);
}