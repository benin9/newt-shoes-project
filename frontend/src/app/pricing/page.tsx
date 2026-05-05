"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import Link from "next/link";
import React from "react";

const prices = [
  { id: 1, title: "Cleaning", price: "25K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: false, features: ["Basic cleaning", "Shoes only"] },
  { id: 2, title: "Deep Clean", price: "30K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: false, features: ["Deep cleaning", "Odor removal"] },
  { id: 3, title: "Deep Clean Express", price: "35K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: true, features: ["Deep cleaning", "24-hour service", "Express delivery"] },
  { id: 4, title: "Whitening", price: "35K", time: "24 - 72h", pickup: "exclude", warranty: "7 Days", popular: false, features: ["Whitening treatment", "UV protection"] },
  { id: 5, title: "Unyellowing", price: "45K", time: "24 - 72h", pickup: "exclude", warranty: "7 Days", popular: false, features: ["Yellow stain removal", "Color restoration"] },
  { id: 6, title: "Women Shoes", price: "25K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: false, features: ["Delicate handling", "Special care"] },
  { id: 7, title: "Bag", price: "35K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: false, features: ["Handbag cleaning", "Leather care"] },
  { id: 8, title: "Helmet", price: "35K", time: "24 - 48h", pickup: "exclude", warranty: "-", popular: false, features: ["Helmet cleaning", "Interior sanitization"] },
  { id: 9, title: "Reglue", price: "35K", time: "24 - 48h", pickup: "exclude", warranty: "-", note: "Start From", popular: false, features: ["Sole reattachment", "Glue application"] },
  { id: 10, title: "Repaint", price: "45K", time: "24 - 48h", pickup: "exclude", warranty: "7 Days", note: "Start From", popular: false, features: ["Color matching", "Paint application", "Protection coat"] },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export default function PricingPage() {
  return (
    <section className="min-h-screen bg-linear-to-b from-[#f9f5eb] to-[#f4ecdf] py-16">
      <div className="mx-auto max-w-7xl px-4">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block mb-4 px-4 py-2 rounded-full bg-[#be9020]/10 text-xs font-semibold text-[#be9020]">
            PRICELIST
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-[#3a2f1c]">
            NEWT SHOES & CLEAN
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-[#5c4a2f]/80">
            Harga transparan tanpa biaya tersembunyi. Semua paket belum termasuk pickup & delivery.
          </p>
        </motion.div>

        {/* PRICING GRID */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {prices.map((item) => (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6 }}
              className={`relative rounded-2xl border p-6 transition-all ${
                item.popular
                  ? "border-[#be9020] bg-linear-to-br from-[#fff6e6] to-[#f6e1b8] shadow-xl"
                  : "border-[#be9020]/20 bg-white/70"
              }`}
            >
              {/* POPULAR BADGE */}
              {item.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#be9020] text-white text-xs font-bold px-4 py-1 rounded-full">
                  MOST POPULAR
                </span>
              )}

              {/* PRICE */}
              <div className="mb-4">
                {item.note && (
                  <p className="text-xs font-semibold text-[#be9020] uppercase">
                    {item.note}
                  </p>
                )}
                <div className="flex items-end gap-1">
                  <span className="text-xl font-bold text-[#3a2f1c]">Rp</span>
                  <span className="text-4xl font-extrabold text-[#be9020]">
                    {item.price}
                  </span>
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-xl font-bold text-[#3a2f1c] mb-4">
                {item.title}
              </h3>

              {/* FEATURES */}
              <ul className="space-y-3 mb-6">
                {item.features.map((feature, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-[#5c4a2f]">
                    <span className="text-[#be9020]">✔</span>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={`/booking?service=${encodeURIComponent(item.title)}&price=${item.price}`}
                className="block text-center rounded-xl py-3 font-semibold bg-[#f4ecdf] hover:bg-[#e8dcc7] transition"
              >
                Pilih Layanan
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* FOOTER NOTE */}
        <p className="mt-16 text-center text-sm text-[#5c4a2f]/70">
          * Harga dapat berubah tergantung kondisi sepatu <br />
          ** Sudah termasuk biaya administrasi
        </p>

      </div>
    </section>
  );
}
