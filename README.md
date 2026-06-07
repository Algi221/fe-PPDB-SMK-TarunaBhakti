# Panduan Sistem PPDB SMK Taruna Bhakti Depok

Aplikasi Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok adalah platform berbasis web modern yang dirancang untuk mempermudah pendaftaran siswa baru secara online, pengelolaan administrasi oleh panitia (dashboard pendaftar dan siswa aktif), integrasi pembayaran digital, serta forum informasi pengumuman.

Sistem ini terbagi menjadi dua bagian utama:
1. Frontend (Next.js): Aplikasi antarmuka pengguna berbasis React dengan Next.js.
2. Backend (Hono.js + Node + PostgreSQL): Server REST API berbasis Hono.js dengan PostgreSQL sebagai database utama.

---

## Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan sistem Anda telah menginstal:
- Node.js (versi 18 ke atas) atau Bun (direkomendasikan karena kecepatan eksekusi).
- Database PostgreSQL (lokal atau hosting eksternal).

---

## Struktur Repositori

```text
PPDB_SMK_TarunaBhakti/
├── backend/            # REST API Server (Hono.js)
├── frontend/           # Aplikasi User & Dashboard Admin (Next.js)
└── README.md           # Panduan ini
```

---

## Langkah Setup Cepat

### 1. Konfigurasi Backend (API Server)

1. Buka terminal dan masuk ke direktori backend:
   ```bash
   cd backend
   ```

2. Salin file template environment variable .env.example menjadi .env:
   - Windows (PowerShell):
     ```powershell
     cp .env.example .env
     ```
   - Linux/macOS/Git Bash:
     ```bash
     cp .env.example .env
     ```

3. Sesuaikan konfigurasi database Anda pada file .env pada variabel DATABASE_URL:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/nama_database
   JWT_SECRET=MasukkanSecretKeyKalianDisini
   ```

#### Inisialisasi Database (Auto-Migration)
Backend dirancang untuk melakukan migrasi database secara otomatis saat dijalankan pertama kali dengan membaca skema yang ada pada backend/src/db/schema.sql. Seluruh tabel database akan dibuat secara otomatis di PostgreSQL.

#### Database Seeding
Setelah database terkoneksi, masukkan data simulasi awal (seperti data siswa aktif, program keahlian, gelombang pendaftaran, pengumuman forum, dan konfigurasi landing page) dengan menjalankan perintah berikut di dalam folder backend:
- Menggunakan Bun (Direkomendasikan):
  ```bash
  bun seed.js
  ```
- Menggunakan Node.js:
  ```bash
  node seed.js
  ```
Skrip seeder ini akan memverifikasi koneksi database Anda, menghapus data seeder lama (jika ada) untuk mencegah duplikasi, lalu memasukkan data siswa baru dan admin awal ke PostgreSQL.

#### Menjalankan Server Backend
Jalankan server backend dalam mode pengembangan (development):
- Menggunakan Bun:
  ```bash
  bun run dev
  ```
- Menggunakan Node.js:
  ```bash
  npm run dev
  ```
Server backend akan berjalan di http://localhost:5000 dan WebSocket live di ws://localhost:5000/ws.

---

### 2. Konfigurasi Frontend (Next.js)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```

2. Salin file template environment variable .env.example menjadi .env.local:
   - Windows (PowerShell):
     ```powershell
     cp .env.example .env.local
     ```
   - Linux/macOS/Git Bash:
     ```bash
     cp .env.example .env.local
     ```

#### Menjalankan Aplikasi Frontend
Jalankan server Next.js dalam mode pengembangan:
- Menggunakan Bun:
  ```bash
  bun run dev
  ```
- Menggunakan Node.js:
  ```bash
  npm run dev
  ```
Buka browser dan akses http://localhost:3000.

#### Membuat Production Build
Untuk melakukan build produksi pada frontend Next.js, jalankan perintah berikut di folder frontend:
- Menggunakan Bun:
  ```bash
  bun run build
  ```
- Menggunakan Node.js:
  ```bash
  npm run build
  ```

Setelah build berhasil dibuat, Anda dapat menjalankan aplikasi dalam mode produksi dengan perintah:
- Menggunakan Bun:
  ```bash
  bun run start
  ```
- Menggunakan Node.js:
  ```bash
  npm run start
  ```

---

## Kredensial Login Administrator Default

Setelah Anda menjalankan seeder database, Anda dapat login ke Dashboard Admin PPDB menggunakan akun berikut:

| Peran (Role) | Username | Password |
|---|---|---|
| Super Admin | KingAlgi | RPLSTRONG |
| Admin Panitia | admin_tb | AdminTarunaBhakti2026 |