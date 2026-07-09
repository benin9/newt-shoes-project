"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#be9020]/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-extrabold tracking-wide text-[#252527]">
            Newt Shoes&Clean
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-[#3a2f1c]">
          <Link
            href="/"
            className="hover:text-[#be9020] transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            href="/services"
            className="hover:text-[#be9020] transition-colors duration-200"
          >
            Services
          </Link>
          <Link
            href="/pricing"
            className="hover:text-[#be9020] transition-colors duration-200"
          >
            Pricing
          </Link>
          <Link
            href="/booking"
            className="hover:text-[#be9020] transition-colors duration-200"
          >
            Booking
          </Link>
          
          {/* MENU ADMIN (Arahkan ke URL Backend) */}
          {isAuthenticated && user?.role === 'admin' && (
            <a
              href="https://newt-shoes-backend.up.railway.app/admin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 hover:text-red-800 font-bold transition-colors duration-200"
            >
              Admin Dashboard
            </a>
          )}

          {isAuthenticated && (
            <Link
              href="/my-bookings"
              className="hover:text-[#be9020] transition-colors duration-200"
            >
              My Bookings
            </Link>
          )}
        </nav>

        {/* Desktop Auth Section */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#252527]">
                  {user?.name}
                </p>
                <p className="text-xs text-[#5c4a2f]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-[#252527] px-5 py-2 text-sm font-semibold text-white hover:bg-[#be9020] transition-colors duration-200"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden relative z-60 w-10 h-10 flex flex-col justify-center items-center group"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <div className="relative w-6 h-5">
            <span
              className={`absolute top-0 left-0 w-full h-0.5 bg-[#252527] transition-all duration-300 ${
                isMenuOpen ? "rotate-45 top-2" : ""
              }`}
            />
            <span
              className={`absolute top-2 left-0 w-full h-0.5 bg-[#252527] transition-all duration-300 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute top-4 left-0 w-full h-0.5 bg-[#252527] transition-all duration-300 ${
                isMenuOpen ? "-rotate-45 top-2" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ease-out ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={closeMenu}
        />
        <div
          className={`absolute top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-white">
              {isAuthenticated ? (
                <div>
                  <p className="text-lg font-bold text-[#252527]">{user?.name}</p>
                  <p className="text-sm text-[#5c4a2f]">{user?.email}</p>
                </div>
              ) : (
                <span className="text-xl font-extrabold text-[#252527]">Newt Shoes&Clean</span>
              )}
            </div>

            <nav className="flex-1 p-6 space-y-4 bg-white">
              <Link href="/" onClick={closeMenu} className="block p-3 text-lg font-medium text-[#3a2f1c] hover:bg-gray-50 rounded-lg">Home</Link>
              <Link href="/services" onClick={closeMenu} className="block p-3 text-lg font-medium text-[#3a2f1c] hover:bg-gray-50 rounded-lg">Services</Link>
              <Link href="/pricing" onClick={closeMenu} className="block p-3 text-lg font-medium text-[#3a2f1c] hover:bg-gray-50 rounded-lg">Pricing</Link>
              <Link href="/booking" onClick={closeMenu} className="block p-3 text-lg font-medium text-[#3a2f1c] hover:bg-gray-50 rounded-lg">Booking</Link>

              {/* MOBILE ADMIN LINK */}
              {isAuthenticated && user?.role === 'admin' && (
                <a
                  href="https://newt-shoes-backend.up.railway.app/admin"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                  className="block p-3 text-lg font-bold text-red-600 hover:bg-red-50 rounded-lg"
                >
                  Admin Dashboard
                </a>
              )}

              {isAuthenticated && (
                <Link href="/my-bookings" onClick={closeMenu} className="block p-3 text-lg font-medium text-[#3a2f1c] hover:bg-gray-50 rounded-lg">My Bookings</Link>
              )}
            </nav>

            <div className="p-6 border-t border-gray-100 bg-white">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="block w-full rounded-xl bg-red-600 py-3 font-semibold text-white">Logout</button>
              ) : (
                <Link href="/login" onClick={closeMenu} className="block w-full rounded-xl bg-[#252527] py-3 text-center font-semibold text-white">Login</Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
