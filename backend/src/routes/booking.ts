import { Router, type Request, type Response } from "express";
import pool from "../config/database";
import { authMiddleware } from "../middleware/auth";
import type { ResultSetHeader } from "mysql2";
// 1. Import Midtrans
const midtransClient = require("midtrans-client");

const router = Router();

// 2. Konfigurasi Midtrans Snap
const snap = new midtransClient.Snap({
  isProduction: false, // Mode Sandbox (Testing)
  serverKey: process.env.MIDTRANS_SERVER_KEY, // ⚠️ Masukkan Server Key dari Dashboard Midtrans
});

// --- CREATE BOOKING & GET PAYMENT TOKEN ---
router.post("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("DEBUG USER DATA:", (req as any).user);
    const userId = (req as any).user.userId;
    const {
      service,
      shoe_name,
      shoe_size,
      shoe_type,
      pickup_address,
      pickup_date,
      pickup_time,
      notes,
      total_price // Frontend wajib kirim ini
    } = req.body;

    // --- FIX PENTING: VALIDASI HARGA ---
    // Pastikan total_price ada. Jika tidak, ambil default dummy atau reject.
    let finalPrice = Number(total_price);
    
    if (isNaN(finalPrice) || finalPrice <= 0) {
        console.error("Harga Invalid diterima:", total_price);
        // Fallback safety (misal 1000 perak) atau return error
        // Disini kita return error agar ketahuan
        res.status(400).json({ error: "Total harga tidak valid (0 atau null)" });
        return;
    }
    
    // Bulatkan agar tidak desimal
    finalPrice = Math.round(finalPrice);
    // ------------------------------------

    // A. Simpan ke Database dulu (Status awal: 'pending')
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bookings 
      (user_id, service, shoe_name, shoe_size, shoe_type, pickup_address, pickup_date, pickup_time, notes, status, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())`,
      [userId, service, shoe_name, shoe_size, shoe_type, pickup_address, pickup_date, pickup_time, notes]
    );

    const bookingId = result.insertId;

    // B. Siapkan Parameter untuk Midtrans
    // Order ID harus unik, kita gabungkan 'ORDER-' + bookingId + timestamp
    const orderId = `ORDER-${bookingId}-${Date.now()}`;
    const grossAmount = finalPrice; // Midtrans menolak desimal

    const parameter = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: (req as any).user.name || "Customer", // Fallback jika nama kosong
        email: (req as any).user.email || "customer@mail.com", // Penting: Jangan biarkan null
        phone: (req as any).user.phone || "08123456789", // Pastikan ada string nomor telpon
      },
      item_details: [{
          id: service.substring(0, 50), // ID item (optional)
          price: grossAmount,
          quantity: 1,
          name: `${service} (${shoe_name} - ${shoe_size})`.substring(0, 50)
      }]
    };

    // C. Minta Token ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    // D. Kirim Token & Booking ID ke Frontend
    res.json({ 
      message: "Booking Created", 
      bookingId: bookingId,
      token: transaction.token 
    });

  } catch (error) {
    console.error("Booking Error:", error);
    res.status(500).json({ error: "Gagal memproses booking" });
  }
});

// --- ENDPOINT BARU: Update Status ke 'confirmed' (Setelah Bayar) ---
router.post("/payment-success", authMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { bookingId } = req.body;
        
        // --- PERBAIKAN DI SINI ---
        // SEBELUMNYA: status = 'processing'
        // UBAH JADI: status = 'confirmed'
        // Agar masuk antrian kurir (Perlu Dijemput)
        await pool.query(
            "UPDATE bookings SET status = 'confirmed' WHERE id = ?",
            [bookingId]
        );

        res.json({ message: "Status updated to confirmed" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Gagal update status" });
    }
});


router.get("/", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    const userId = user.userId;

    // Ambil data booking milik user yang sedang login saja
    // Diurutkan dari yang terbaru (DESC)
    const [rows] = await pool.query(
      `SELECT * FROM bookings 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Fetch Booking Error:", error);
    res.status(500).json({ error: "Gagal mengambil data booking" });
  }
});
export default router;