// backend/src/routes/delivery.ts

import express, { Request, Response } from "express";
import pool from "../config/database";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

// GET: Ambil Daftar Tugas Kurir
router.get("/tasks", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    // UPDATE QUERY: Tambahkan 'on_pickup' dan 'on_delivery' agar tugas tidak hilang saat proses
    const [rows] = await pool.query(
      `SELECT * FROM bookings 
       WHERE status IN ('confirmed', 'on_pickup', 'processing', 'on_delivery') 
       AND pickup_address IS NOT NULL AND pickup_address != ''
       ORDER BY created_at ASC`
    );

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal mengambil tugas delivery" });
  }
});

// PATCH: Update Status
router.patch("/:id/update-status", authMiddleware, async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { action } = req.body; 

    let newStatus = "";

    // MAPPING ALUR BARU
    if (action === "start_pickup") newStatus = "on_pickup";         // Kurir OTW Jemput
    else if (action === "arrived_at_shop") newStatus = "processing"; // Kurir Sampai Toko (Masuk antrian cuci)
    else if (action === "start_delivery") newStatus = "on_delivery"; // Kurir OTW Antar
    else if (action === "finish_delivery") newStatus = "completed";  // Kurir Sampai Tujuan (Selesai)

    if (!newStatus) {
      res.status(400).json({ error: "Aksi tidak valid" });
      return;
    }

    await pool.query(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    res.json({ message: "Status berhasil diperbarui", status: newStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal update status" });
  }
});

export default router;