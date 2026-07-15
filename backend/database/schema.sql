-- Create database
CREATE DATABASE IF NOT EXISTS newt_shoes;
USE newt_shoes;

-- 1. Tabel Users
-- Menambahkan kolom role untuk membedakan admin dan pelanggan biasa
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Tabel Services
-- Tabel baru untuk menyimpan daftar layanan dan harga
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Tabel Bookings
-- Menyesuaikan kolom dengan data transaksi terbaru
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  service VARCHAR(100) NOT NULL, -- Menyimpan nama layanan
  shoe_name VARCHAR(255) DEFAULT NULL, -- Nama sepatu yang dibersihkan
  shoe_size VARCHAR(50) DEFAULT NULL,  -- Ukuran/berat sepatu
  shoe_type VARCHAR(100) NOT NULL,
  pickup_address TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME NOT NULL,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0, -- Harga total pembayaran
  notes TEXT,
  status ENUM('pending', 'confirmed', 'on_pickup', 'processing', 'on_delivery', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_pickup_date (pickup_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- INSERT Sample Data untuk Services
INSERT INTO services (name, description, price, duration) VALUES
('Cleaning', 'Pembersihan dasar sepatu standar', 25000, '1-2 jam'),
('Deep Clean', 'Pembersihan mendalam dengan steam & deep conditioning', 30000, '2-3 jam'),
('Whitening', 'Pemutihan untuk sepatu putih atau cream', 35000, '3-4 jam'),
('Unyellowing', 'Menghilangkan kekuningan pada sepatu', 45000, '3-4 jam'),
('Protection', 'Perawatan proteksi noda dan air tahan lama', 20000, '1 jam'),
('Repainting', 'Pewarnaan ulang untuk sepatu rusak', 50000, '1-2 hari')
ON DUPLICATE KEY UPDATE price=price;
