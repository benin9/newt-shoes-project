"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

const services = [
  { title: "Deep Cleaning", desc: "Pembersihan menyeluruh pada upper, midsole, outsole, dan insole.", icon: "🧼" },
  { title: "Deep Clean Express", desc: "Solusi cepat untuk hasil maksimal dalam waktu singkat.", icon: "⚡" },
  { title: "Whitening", desc: "Memutihkan kembali bagian upper atau midsole yang menguning.", icon: "✨" },
  { title: "Unyellowing", desc: "Treatment khusus untuk menghilangkan warna kuning pada midsole.", icon: "🧪" },
  { title: "Repaint", desc: "Mengembalikan warna sepatu yang pudar agar terlihat seperti baru.", icon: "🎨" },
  { title: "Reglue", desc: "Merekatkan kembali bagian sole sepatu yang terlepas.", icon: "🧷" },
];

const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const cardAnimation = { hidden: { opacity: 0, y: 40, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1 } };
const imageAnimation = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } };

export default function ServicesPage() {
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const filteredServices = services.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="bg-linear-to-b from-[#f9f5eb] to-[#f4ecdf]">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16 md:py-20">
        
        {/* HERO */}
        <motion.div className="text-center max-w-2xl mx-auto" initial="hidden" animate="visible" variants={fadeInUp}>
          <span className="inline-block rounded-full bg-[#be9020]/20 px-4 py-1 text-base font-semibold text-[#be9020]">Layanan Kami</span>
          <h1 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#3a2f1c]">Perawatan Sepatu Profesional</h1>
          <div className="mt-8">
            <input
              type="text"
              placeholder="Cari layanan..."
              className="w-full max-w-md px-6 py-3 rounded-full border border-[#be9020]/30 focus:border-[#be9020] focus:ring-2 focus:ring-[#be9020]/20 outline-none bg-white/50 transition-all text-center"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        {/* GRID SERVICES */}
        <motion.div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3" ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} variants={staggerContainer}>
          {filteredServices.length > 0 ? (
            filteredServices.map((item) => (
              <motion.div key={item.title} variants={cardAnimation} className="rounded-2xl border border-[#be9020]/20 bg-[#ede4d6] p-6 hover:border-[#be9020] transition-all duration-300 cursor-pointer overflow-hidden relative">
                <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="text-3xl mb-4">{item.icon}</motion.div>
                <h3 className="text-lg font-bold text-[#3a2f1c]">{item.title}</h3>
                <p className="mt-2 text-sm text-[#5c4a2f]">{item.desc}</p>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-[#5c4a2f] mt-10">
              Maaf, layanan &quot;{search}&quot; tidak ditemukan.
            </p>
          )}
        </motion.div>

        {/* BEFORE AFTER */}
        <motion.div 
          className="mt-20"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <motion.h2 
            className="text-center text-2xl sm:text-3xl font-extrabold text-[#3a2f1c]"
            variants={fadeInUp}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            Before & After
          </motion.h2>
          
          <motion.p 
            className="mt-3 text-center text-sm text-[#5c4a2f]"
            variants={fadeInUp}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Hasil nyata dari layanan Newt Shoes & Clean
          </motion.p>

          <motion.div 
            className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3"
            variants={staggerContainer}
            transition={{ staggerChildren: 0.2 }}
          >
            {/* Gambar 1 */}
            <motion.div
              variants={imageAnimation}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ duration: 0.4 }}
              className="rounded-xl overflow-hidden bg-[#e6dccb] cursor-pointer"
            >
              <div className="relative w-full h-64 sm:h-72 md:h-80">
                <Image
                  src="/before_after1.jpg"
                  alt="Contoh hasil cleaning sepatu 1"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay effect */}
                <motion.div 
                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                />
                
                {/* Label */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 opacity-0 translate-y-4"
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-semibold text-[#3a2f1c]">Before → After</p>
                  <p className="text-xs text-[#5c4a2f] mt-1">Deep Cleaning Treatment</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Gambar 2 */}
            <motion.div
              variants={imageAnimation}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="rounded-xl overflow-hidden bg-[#e6dccb] cursor-pointer"
            >
              <div className="relative w-full h-64 sm:h-72 md:h-80">
                <Image
                  src="/before_after2.jpg"
                  alt="Contoh hasil cleaning sepatu 2"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay effect */}
                <motion.div 
                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                />
                
                {/* Label */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 opacity-0 translate-y-4"
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-semibold text-[#3a2f1c]">Before → After</p>
                  <p className="text-xs text-[#5c4a2f] mt-1">Whitening & Restoration</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Gambar 3 */}
            <motion.div
              variants={imageAnimation}
              whileHover={{ 
                scale: 1.03,
                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)"
              }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="rounded-xl overflow-hidden bg-[#e6dccb] cursor-pointer"
            >
              <div className="relative w-full h-64 sm:h-72 md:h-80">
                <Image
                  src="/before_after3.jpg"
                  alt="Contoh hasil cleaning sepatu 3"
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                {/* Overlay effect */}
                <motion.div 
                  className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all duration-300"
                  whileHover={{ backgroundColor: "rgba(0,0,0,0.2)" }}
                />
                
                {/* Label */}
                <motion.div 
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 opacity-0 translate-y-4"
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-xs font-semibold text-[#3a2f1c]">Before → After</p>
                  <p className="text-xs text-[#5c4a2f] mt-1">Complete Restoration</p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Link
              href="/booking"
              className="inline-block rounded-full bg-[#be9020] px-8 py-3 text-sm font-bold text-[#f4efe8] hover:bg-[#a67c1c] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#be9020]/30"
            >
              Booking Sekarang
            </Link>
          </motion.div>
          
          {/* Decorative elements */}
          <motion.div 
            className="mt-6 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-[#be9020]/40"
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 1, 0.4]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 1.5,
                  delay: i * 0.1
                }}
              />
            ))}
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}