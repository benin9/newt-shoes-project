import { Router, type Request, type Response } from "express";
import pool from "../config/database";
import type { RowDataPacket } from "mysql2";

const router = Router();

// GET /api/services
// Endpoint Public: Untuk Dropdown Booking & Halaman Pricing
router.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    // Ambil semua data layanan, urutkan dari harga termurah
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM services ORDER BY price ASC"
    );
    
    res.json(rows);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

export default router;