"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Animasi variants dengan tipe yang benar untuk Framer Motion
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { 
      opacity: 1, 
      x: 0,
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { 
      opacity: 1, 
      x: 0,
    }
  };

  // Stagger container
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    }
  };

  // Card animation
  const cardAnimation = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
    }
  };

  // Popular badge animation
  const badgeAnimation = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
    }
  };

  return (
    <div className="space-y-28">
      {/* HERO SECTION */}
      <section className="bg-linear-to-br from-[#F9F8F6] via-[#f4efe8] to-[#f7f1e9] overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 py-28 grid md:grid-cols-2 gap-14 items-center">
          <motion.div
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
            variants={slideInLeft}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-extrabold leading-tight text-[#3a2f1c]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            >
              Premium Shoe
              <motion.span 
                className="block text-[#be9020]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
              >
                Cleaning WebApp
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="mt-6 text-lg text-[#5c4a2f] max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              Layanan cuci, perawatan, dan restorasi sepatu profesional dengan sistem booking online & pickup delivery.
            </motion.p>
            
            <motion.div 
              className="mt-8 flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            >
              <Link
                href="/booking"
                className="rounded-2xl bg-[#be9020] px-7 py-3 font-semibold text-[#f4efe8] hover:bg-[#a67c1c] transition-all duration-300 hover:shadow-lg hover:shadow-[#be9020]/30"
              >
                Book Sekarang
              </Link>
              <Link
                href="/services"
                className="rounded-2xl border border-[#be9020]/40 px-7 py-3 font-semibold text-[#3a2f1c] hover:bg-[#be9020]/10 transition-all duration-300 hover:shadow-md"
              >
                Lihat Layanan
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isMounted ? "visible" : "hidden"}
            variants={slideInRight}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="h-134 rounded-3xl overflow-hidden flex items-center justify-center"
          >
            <Image
              src="/hero_image.jpg"
              alt="Premium Shoe Cleaning Service"
              width={600}
              height={400}
              className="w-full h-full object-cover"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* PACKAGES SECTION - ANIMASI ELEGAN */}
      <section className="bg-[#f4ecdf] overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-14">
          {/* HEADER */}
          <motion.div 
            className="flex items-center justify-between"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUp}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div>
              <motion.h2 
                className="text-2xl sm:text-3xl font-extrabold text-[#3a2f1c]"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                Paket & Harga
              </motion.h2>
              <motion.p 
                className="mt-1 text-xs sm:text-sm text-[#5c4a2f]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
              >
                Beberapa layanan favorit pelanggan
              </motion.p>
            </div>

            <motion.a
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border border-[#be9020] px-4 py-2 text-sm font-semibold text-[#be9020] hover:bg-[#be9020] hover:text-[#3a2f1c] transition-all duration-300"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              whileHover={{ 
                scale: 1.05,
                backgroundColor: "#be9020",
                color: "#3a2f1c",
                transition: { duration: 0.3 }
              }}
            >
              Lihat Detail
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }}
              >
                →
              </motion.span>
            </motion.a>
          </motion.div>
          {/* CARDS GRID - ANIMASI SMOOTH */}
<motion.div 
  className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-8" 
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.1 }}
  variants={staggerContainer}
  transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
>
  {[
    { title: "Cleaning", price: "25K" },
    { title: "Deep Clean", price: "30K", popular: true },
    { title: "Whitening", price: "35K" },
    { title: "Unyellowing", price: "45K" },
  ].map((item, index) => (
    <motion.div
      key={item.title}
      variants={cardAnimation}
      transition={{ 
        delay: index * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -6,
        boxShadow: "0 12px 24px rgba(190, 144, 32, 0.15)",
        transition: { 
          duration: 0.4,
          ease: "easeInOut"
        }
      }}
      className={`relative rounded-2xl bg-[#ede4d6] p-8 text-center border-2 transition-all duration-300 cursor-pointer overflow-visible mt-4
        item.popular
          ? "border-[#be9020]"
          : "border-[#be9020]/30"
      }`}
    >
      {/* Badge MOST POPULAR */}
      {item.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"> {/* Ubah -top-2.5 ke -top-4 */}
          <motion.span 
            className="inline-block rounded-full bg-linear-to-r from-[#be9020] to-[#d4a017] px-4 py-1.5 text-xs font-bold text-white shadow-lg"
            initial={{ scale: 0, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ 
              delay: 0.5, 
              type: "spring",
              stiffness: 300,
              damping: 15
            }}
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 8px 16px rgba(190, 144, 32, 0.3)"
            }}
          >
            ⭐ MOST POPULAR
          </motion.span>
        </div>
      )}

      {/* Background shimmer effect on hover */}
      <motion.div 
        className="absolute inset-0 bg-linear-to-r from-transparent via-[#be9020]/5 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
      
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <p className="text-3xl font-extrabold text-[#be9020]">
          {item.price}
        </p>
      </motion.div>
      
      <motion.p 
        className="mt-3 text-sm font-semibold text-[#3a2f1c]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 + (index * 0.1), duration: 0.6, ease: "easeOut" }}
      >
        {item.title}
      </motion.p>

      {/* Decorative dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
        {[...Array(3)].map((_, i) => (
          <motion.span
            key={i}
            className="w-1 h-1 rounded-full bg-[#be9020]/30"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              delay: 0.6 + (index * 0.1) + (i * 0.1),
              duration: 0.4,
              ease: "easeOut"
            }}
          />
        ))}
      </div>
    </motion.div>
  ))}
</motion.div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 overflow-hidden">
        <motion.h2 
          className="text-center text-5xl font-bold text-[#3a2f1c]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Testimoni NEWTIZEN
        </motion.h2>
        
        <motion.div 
          className="mt-14 grid gap-8 md:grid-cols-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {[1, 2, 3].map((i, index) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.6,
                ease: "easeOut"
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px rgba(190, 144, 32, 0.1)",
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              className="rounded-3xl bg-[#f4efe8] p-8 border border-[#be9020]/30 cursor-pointer"
            >
              <p className="text-sm text-[#5c4a2f]">
                "Sepatu saya jadi seperti baru lagi. Pelayanan cepat dan profesional!"
              </p>
              <p className="mt-4 font-semibold text-[#be9020]">Customer {i}</p>
              <div className="mt-2 text-xs text-[#5c4a2f]">
                ★★★★★
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section 
        className="bg-linear-to-r from-[#8b6627] via-[#d28a26] to-[#b6770a] overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        <div className="mx-auto max-w-7xl px-6 py-20 text-center">
          <motion.h2 
            className="text-4xl font-extrabold text-[#f4efe8]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Siap Bersihin Sepatu Favoritmu?
          </motion.h2>
          
          <motion.p 
            className="mt-4 text-[#f4efe8]/90 text-xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
          >
            Booking sekarang dan nikmati layanan pickup & delivery
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ 
              delay: 0.4, 
              duration: 0.6,
              ease: "easeOut"
            }}
          >
            <motion.div
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3, ease: "easeInOut" }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href="/booking"
                className="mt-8 inline-block rounded-2xl bg-[#f4efe8] px-8 py-3 font-bold text-[#be9020] hover:bg-[#ede4d6] hover:shadow-xl transition-all duration-300"
              >
                Booking Sekarang
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}