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

#### Inisialisasi Skema Database (Prisma ORM)
Sistem backend telah dimigrasikan menggunakan **Prisma ORM**. Untuk membuat tabel-tabel database di PostgreSQL sesuai skema, jalankan perintah berikut di folder backend:
```bash
npx prisma db push
```

#### Database Seeding
Untuk memasukkan data simulasi awal (100+ data calon siswa/siswa aktif, pengumuman forum, dan konfigurasi default landing page) ke database, jalankan perintah berikut di folder backend:
```bash
npm run seed
```
Skrip seeder ini akan mengambil kredensial admin secara dinamis dari file `.env` Anda, memverifikasi koneksi database, lalu mengosongkan tabel lama dan mengisinya dengan data simulasi baru.

#### Menjalankan Prisma Studio (Visual Editor)
Anda dapat melihat, mencari, menambah, atau mengedit data di database secara visual dengan menjalankan:
```bash
npx prisma studio
```
Layanan ini akan otomatis terbuka di browser Anda (default: `http://localhost:5555`).

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
Server backend akan berjalan di `http://localhost:5000` dan WebSocket live di `ws://localhost:5000/ws`.

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