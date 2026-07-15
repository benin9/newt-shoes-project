import type React from "react";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
// 1. Import Toaster dari react-hot-toast
import { Toaster } from "react-hot-toast";
import Script from "next/script";

export const metadata = {
  title: "Newt Shoes & Clean",
  description: "Professional shoe cleaning web application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#F9F8F6] text-[#3a2f1c]">
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key="Mid-client-Rvo5WSVGyvWSuoOE" 
          strategy="lazyOnload"
        />
        <AuthProvider>
          <Toaster 
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '8px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981', // Warna hijau emerald
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444', // Warna merah
                  secondary: 'white',
                },
              },
            }}
          />
          
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}