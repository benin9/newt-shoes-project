"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { authApi, bookingApi, servicesApi } from "@/lib/api";
import { toast } from "react-hot-toast";

declare global {
  interface Window {
    snap: any;
  }
}

const DELIVERY_FEE = 15000;

interface ServiceData {
  id: number;
  name: string;
  price: number | string;
}

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceFromUrl = searchParams.get("service");

  const [services, setServices] = useState<ServiceData[]>([]);
  const [useDelivery, setUseDelivery] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickup_address: "",
    shoe_name: "",
    shoe_size: "",
    shoe_type: "Sneakers",
    pickup_date: "",
    pickup_time: "",
    service: "",
    price: 0,
    notes: "",
  });

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push("/login");
    } else {
      const user = authApi.getUser();
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          phone: user.phone || "",
        }));
      }
    }
  }, [router]);

  useEffect(() => {
    const initBookingData = async () => {
      try {
        const data = await servicesApi.getAll();
        setServices(data);
        if (serviceFromUrl) {
          const preSelected = data.find((s: ServiceData) => s.name === serviceFromUrl);
          if (preSelected) {
            setFormData((prev) => ({
              ...prev,
              service: preSelected.name,
              price: Number(preSelected.price),
            }));
          }
        }
      } catch (error) {
        toast.error("Gagal memuat layanan");
      } finally {
        setLoadingServices(false);
      }
    };
    initBookingData();
  }, [serviceFromUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "service") {
      const selected = services.find((s) => s.name === value);
      setFormData((prev) => ({ ...prev, service: value, price: selected ? Number(selected.price) : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const totalEstimation = Number(formData.price) + (useDelivery ? DELIVERY_FEE : 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = { ...formData, total_price: Math.round(totalEstimation), pickup_address: useDelivery ? formData.pickup_address : "Self Service" };
    
    try {
      const response = await bookingApi.create(payload);
      if (response.token && window.snap) {
        window.snap.pay(response.token, {
          onSuccess: async () => { 
            await bookingApi.updatePaymentStatus(response.bookingId); 
            router.push("/my-bookings"); 
          },
          onClose: () => setLoading(false),
        });
      }
    } catch (error: any) {
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] flex flex-col md:flex-row font-sans text-[#393E46]">
       {/* (Sisa kode UI Anda tetap diletakkan di sini...) */}
       {/* Pastikan struktur return HTML Anda diletakkan di bagian ini */}
    </div>
  );
}