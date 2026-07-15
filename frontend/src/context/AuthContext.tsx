"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api"; 

// Definisi tipe User
interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string; // Pastikan role ada
}

// Update Interface Context: Tambahkan isLoading
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 1. Tambahkan State Loading (Default true)
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gunakan try-finally agar loading mati apapun yang terjadi
    try {
      const storedUser = authApi.getUser() as User | null;
      const token = authApi.getToken();

      if (storedUser && token) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth init error:", error);
    } finally {
      // 2. Matikan loading setelah pengecekan selesai
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
    // Tidak perlu reset loading di sini
  };

  const refreshUser = () => {
    try {
      const storedUser = authApi.getUser() as User | null;
      const token = authApi.getToken();

      if (storedUser && token) {
        setUser(storedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth refresh error:", error);
    }
  };

  return (
    <AuthContext.Provider
      // 3. Masukkan isLoading ke dalam value provider
      value={{ user, isAuthenticated, isLoading, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}