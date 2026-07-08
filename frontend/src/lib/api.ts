import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "" : "http://localhost:8000/api");

if (process.env.NODE_ENV === "production" && !API_URL) {
  throw new Error(
    "Missing NEXT_PUBLIC_API_URL environment variable. Set this in Vercel to your Railway backend URL."
  );
}

// --- Tipe Data Response Standar ---
interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  token?: string;     // Khusus untuk response Midtrans
  bookingId?: number; // Khusus untuk response Midtrans
}

// --- 1. AXIOS INSTANCE ---
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: Otomatis pasang Token dari Cookie ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- 2. AUTH API ---
export const authApi = {
  login: async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/login/", { email, password });
      const data = response.data;

      // SIMPAN TOKEN KE COOKIES & LOCALSTORAGE
      if (data.token) {
        const user = data.user || {
          id: data.id || 0,
          name: data.name || data.email || "User",
          email: data.email,
          role: data.role || "user",
        };

        Cookies.set("token", data.token, { expires: 7 }); 
        Cookies.set("user_data", JSON.stringify(user), { expires: 7 });
        
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      return { data };
    } catch (error: any) {
      return { error: error.response?.data?.error || "Login failed" };
    }
  },

  register: async (name: string, email: string, password: string, phone?: string): Promise<ApiResponse> => {
    try {
      const response = await api.post("/auth/register/", { name, email, password, phone });
      const data = response.data;

      if (data.token) {
        const user = data.user || {
          id: data.id || 0,
          name: data.name || data.email || "User",
          email: data.email,
          role: data.role || "user",
        };

        Cookies.set("token", data.token, { expires: 7 });
        Cookies.set("user_data", JSON.stringify(user), { expires: 7 });
        
        if (typeof window !== "undefined") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(user));
        }
      }

      return { data };
    } catch (error: any) {
      return { error: error.response?.data?.error || "Registration failed" };
    }
  },

  logout: () => {
    Cookies.remove("token");
    Cookies.remove("user_data");
    Cookies.remove("user_role");

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  getToken: (): string | null => {
    return Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
  },

  getUser: () => {
    const cookieUser = Cookies.get("user_data");
    if (cookieUser) {
      try { return JSON.parse(cookieUser); } catch {}
    }
    if (typeof window !== "undefined") {
      const localUser = localStorage.getItem("user");
      return localUser ? JSON.parse(localUser) : null;
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get("token");
  },
};

// --- 3. BOOKING API (Midtrans Ready) ---
export const bookingApi = {
  // CREATE: Return raw data agar frontend bisa akses .token dan .bookingId
  create: async (bookingData: any) => {
    try {
      // Endpoint plural '/bookings' sesuai backend route
      const response = await api.post("/bookings", bookingData);
      return response.data; // Mengembalikan { message, bookingId, token }
    } catch (error: any) {
      return { error: error.response?.data?.error || "Booking failed" };
    }
  },

  // GET ALL (User History / Admin)
  getAll: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get("/bookings");
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || "Failed to fetch bookings" };
    }
  },

  // UPDATE PAYMENT STATUS (Dipanggil setelah Midtrans Sukses)
updatePaymentStatus: async (bookingId: number) => {
    try {
      const response = await api.post("/bookings/payment-success", { bookingId });
      return response.data;
    } catch (error: any) {
      return { error: error.response?.data?.error || "Failed update status" };
    }
  },

  getById: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return { data: response.data };
    } catch (error: any) {
      return { error: error.response?.data?.error || "Failed to fetch booking" };
    }
  },
};

// --- 4. SERVICES API (Public & Admin) ---
export const servicesApi = {
  // GET ALL: Endpoint Public (Tanpa Login)
  getAll: async () => {
    try {
      const res = await api.get("/services"); 
      return res.data;
    } catch (error: any) {
      // Jika error 404/Network, kembalikan array kosong agar tidak crash
      console.error("Service fetch error", error);
      return [];
    }
  },

  // ADMIN: Create
  create: async (data: any) => {
    try {
      const res = await api.post("/admin/services", data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Gagal membuat layanan");
    }
  },

  // ADMIN: Update
  update: async (id: number, data: any) => {
    try {
      const res = await api.put(`/admin/services/${id}`, data);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Gagal update layanan");
    }
  },

  // ADMIN: Delete
  delete: async (id: number) => {
    try {
      const res = await api.delete(`/admin/services/${id}`);
      return res.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || "Gagal menghapus layanan");
    }
  },
};