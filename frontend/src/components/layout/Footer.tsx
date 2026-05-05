"use client"

import { usePathname } from "next/navigation";

export function Footer() {

    const pathname = usePathname();
    if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-[#F9F8F6] text-[#f4efe8]">
      <div className="mx-auto max-w-7xl px-6 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold text-[#252527]">Newt Shoes&Clean</p>
          <p className="mt-2 text-sm text-[#393E46]">
            Professional shoe cleaning & care service.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#252527]">Services</p>
          <ul className="mt-2 space-y-1 text-[#393E46]">
            <li>Deep Cleaning</li>
            <li>Protection</li>
            <li>Repainting</li>
            <li>Whitening</li>
            <li>Repairs</li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-[#252527]">Contact</p>
          <p className="mt-2 text-[#393E46]">WhatsApp: 08xxxxxxxx</p>
          <p className="text-[#393E46]">Instagram: @newtshoesclean</p>
        </div>
      </div>
      <div className="border-t border-[#be9020]/30 py-4 text-center text-xs text-[#393E46]">
        © 2025 Newt Shoes&Clean. All rights reserved.
      </div>
    </footer>
  );
}
