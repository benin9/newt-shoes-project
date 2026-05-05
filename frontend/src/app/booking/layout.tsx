// src/app/booking/layout.tsx
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Booking Layanan - Newt Shoes & Clean',
  description: 'Booking layanan cuci dan perawatan sepatu profesional. Pickup & delivery tersedia.',
};

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense 
      fallback={
        <div className="min-h-screen bg-linear-to-br from-[#f4efe8] via-[#f0e6d2] to-[#e8dbc3] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#be9020] mx-auto"></div>
            <p className="mt-4 text-[#5c4a2f] font-medium">Memuat halaman booking...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}