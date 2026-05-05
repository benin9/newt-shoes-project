import { Router, type Request, type Response } from "express";
import pool from "../config/database";
import { authMiddleware, adminMiddleware } from "../middleware/auth";
import type { RowDataPacket } from "mysql2";

const router = Router();

// Endpoint Dashboard: Mengambil Statistik Ringkas
router.get(
  "/dashboard-stats",
  authMiddleware, // Cek login
  adminMiddleware, // Cek apakah admin
  async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Hitung Total User
      const [userCount] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM users WHERE role = 'user'"
      );

      // 2. Hitung Total Booking
      const [bookingCount] = await pool.query<RowDataPacket[]>(
        "SELECT COUNT(*) as total FROM bookings"
      );

      // 3. Hitung Booking berdasarkan Status (Pending, Confirmed, Completed)
      const [statusStats] = await pool.query<RowDataPacket[]>(
        "SELECT status, COUNT(*) as count FROM bookings GROUP BY status"
      );

      // 4. Ambil 5 Booking Terbaru (untuk real-time feed)
      const [recentBookings] = await pool.query<RowDataPacket[]>(
        `SELECT b.id, u.name as user_name, b.service, b.status, b.created_at 
         FROM bookings b 
         JOIN users u ON b.user_id = u.id 
         ORDER BY b.created_at DESC LIMIT 5`
      );

      res.json({
        total_users: userCount[0].total,
        total_bookings: bookingCount[0].total,
        status_breakdown: statusStats,
        recent_activity: recentBookings,
      });
    } catch (error) {
      console.error("Admin dashboard error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Endpoint: Update Status Booking (Fitur Admin untuk memproses pesanan)
router.patch(
  "/bookings/:id/status",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validasi status yang diperbolehkan
        const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: "Invalid status" });
            return;
        }

        await pool.query(
            "UPDATE bookings SET status = ? WHERE id = ?",
            [status, id]
        );

        res.json({ message: "Booking status updated", newStatus: status });
    } catch (error) {
        res.status(500).json({ error: "Failed to update status" });
    }
  }
);

router.get(
  "/bookings",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Query join untuk mengambil nama user pemilik booking
      const [bookings] = await pool.query<RowDataPacket[]>(
        `SELECT b.*, u.name as user_name, u.email as user_email, u.phone as user_phone
         FROM bookings b 
         JOIN users u ON b.user_id = u.id 
         ORDER BY b.created_at DESC`
      );

      res.json(bookings);
    } catch (error) {
      console.error("Admin all bookings error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

router.get(
  "/analytics",
  authMiddleware,
  adminMiddleware,
  async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Data Harian (7 Hari Terakhir)
      const [dailyStats] = await pool.query<RowDataPacket[]>(
        `SELECT 
           DATE_FORMAT(created_at, '%Y-%m-%d') as date, 
           COUNT(*) as total 
         FROM bookings 
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
         GROUP BY DATE(created_at) 
         ORDER BY date ASC`
      );

      // 2. Data Bulanan (12 Bulan Terakhir)
      const [monthlyStats] = await pool.query<RowDataPacket[]>(
        `SELECT 
           DATE_FORMAT(created_at, '%Y-%m') as date, 
           COUNT(*) as total 
         FROM bookings 
         WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
         GROUP BY DATE_FORMAT(created_at, '%Y-%m') 
         ORDER BY date ASC`
      );

      // 3. Status Distribusi (Pie Chart)
      const [statusStats] = await pool.query<RowDataPacket[]>(
        `SELECT status, COUNT(*) as total FROM bookings GROUP BY status`
      );

      res.json({
        daily: dailyStats,
        monthly: monthlyStats,
        status: statusStats
      });
    } catch (error) {
      console.error("Analytics error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// --- MANAJEMEN LAYANAN (SERVICES) ---

// 1. GET ALL SERVICES
router.get("/services", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM services ORDER BY price ASC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// 2. ADD SERVICE
router.post("/services", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    await pool.query(
      "INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)",
      [name, description, price, duration]
    );
    res.json({ message: "Service created successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to create service" });
  }
});

// 3. UPDATE SERVICE
router.put("/services/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, duration } = req.body;
    await pool.query(
      "UPDATE services SET name=?, description=?, price=?, duration=? WHERE id=?",
      [name, description, price, duration, id]
    );
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service" });
  }
});

// 4. DELETE SERVICE
router.delete("/services/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM services WHERE id=?", [id]);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete service" });
  }
});

export default router;