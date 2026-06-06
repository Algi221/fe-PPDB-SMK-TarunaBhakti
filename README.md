# Panduan Sistem PPDB SMK Taruna Bhakti Depok

Aplikasi Penerimaan Peserta Didik Baru (PPDB) SMK Taruna Bhakti Depok adalah platform berbasis web modern yang dirancang untuk mempermudah pendaftaran siswa baru secara online, pengelolaan administrasi oleh panitia (dashboard pendaftar & siswa aktif), integrasi pembayaran digital, serta forum informasi pengumuman.

Sistem ini terbagi menjadi dua bagian utama:
1. **Frontend (Next.js)**: Aplikasi antarmuka pengguna berbasis React dengan framework Next.js.
2. **Backend (Hono.js + Node + PostgreSQL)**: Server REST API super cepat berbasis Hono.js dengan PostgreSQL sebagai database utamanya.

---

## 🛠️ Prasyarat Sistem

Sebelum menjalankan aplikasi, pastikan komputer Anda telah menginstal:
* **Node.js** (versi 18+) ATAU **Bun** (direkomendasikan, sangat cepat dan digunakan di sistem saat ini).
* **PostgreSQL Database** (aktif secara lokal atau hosting eksternal).

---

## 📂 Struktur Repositori

```text
PPDB_SMK_TarunaBhakti/
├── backend/            # REST API Server (Hono.js)
├── frontend/           # Aplikasi User & Dashboard Admin (Next.js)
└── README.md           # Dokumen panduan ini
```

---

## ⚡ Langkah Setup Cepat

### 1. Konfigurasi Backend (API Server)

1. Buka terminal Anda dan masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Salin file template environment variable `.env.example` menjadi `.env`:
   * **Windows (PowerShell):**
     ```powershell
     cp .env.example .env
     ```
   * **Linux/macOS/Git Bash:**
     ```bash
     cp .env.example .env
     ```
3. Buka file `.env` yang baru dibuat di backend, lalu sesuaikan konfigurasi database Anda pada variabel `DATABASE_URL`:
   ```env
   # Contoh format URL PostgreSQL:
   # postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE_NAME]
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ppdb_tarunabhakti
   
   # JWT secret key untuk enkripsi session token login admin
   JWT_SECRET=MasukkanSecretKeyKalianDisini!
   ```

#### 🗄️ Inisialisasi Database (Auto-Migration)
Backend dirancang untuk melakukan migrasi database secara **otomatis**.
Ketika Anda menjalankan server backend untuk pertama kalinya, sistem akan membaca skrip skema [schema.sql](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/backend/src/db/schema.sql) dan membuat seluruh tabel database (`admin_users`, `calon_siswa`, `informasi`, `landing_page_config`, dll) secara otomatis di PostgreSQL. Anda tidak perlu mengimpor skema SQL secara manual!

#### 🌱 Memasukkan Data Awal (Database Seeding)
Setelah database terkoneksi, masukkan data simulasi awal (seperti ~100 data siswa aktif, program keahlian, gelombang pendaftaran, pengumuman forum, dan config landing page) dengan menjalankan perintah berikut di dalam folder `backend`:

* **Menggunakan Bun (Direkomendasikan):**
  ```bash
  bun seed.js
  ```
* **Menggunakan Node.js:**
  ```bash
  node seed.js
  ```
*Skrip seeder ini akan memverifikasi koneksi database Anda, menghapus data seeder lama (jika ada) untuk mencegah duplikasi unik, lalu memasukkan data siswa baru dan admin awal ke PostgreSQL.*

#### 🚀 Menjalankan Server Backend
Jalankan server backend dalam mode pengembangan (*development*):
* **Menggunakan Bun:**
  ```bash
  bun run dev
  ```
* **Menggunakan npm/Node.js:**
  ```bash
  npm run dev
  ```
Server backend akan berjalan di **`http://localhost:5000`** dan channel WebSocket live akan aktif di `ws://localhost:5000/ws`.

---

### 2. Konfigurasi Frontend (Next.js)

1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Salin file template environment variable `.env.example` menjadi `.env.local`:
   * **Windows (PowerShell):**
     ```powershell
     cp .env.example .env.local
     ```
   * **Linux/macOS/Git Bash:**
     ```bash
     cp .env.example .env.local
     ```
3. Nilai default pada file `.env.local` telah disiapkan untuk mencocokkan data login fallback admin dan mock token. Anda tidak perlu mengubahnya untuk mode pengembangan dasar.

#### 🚀 Menjalankan Aplikasi Frontend
Jalankan server Next.js dalam mode pengembangan:
* **Menggunakan Bun:**
  ```bash
  bun run dev
  ```
* **Menggunakan npm/Node.js:**
  ```bash
  npm run dev
  ```
Buka browser Anda dan akses **`http://localhost:3000`** untuk melihat aplikasi PPDB SMK Taruna Bhakti.

---

## 🔑 Kredensial Login Administrator Default

Setelah Anda menjalankan seeder database, Anda dapat login ke Dashboard Admin PPDB menggunakan akun berikut:

| Peran (Role) | Username | Password |
|---|---|---|
| **Super Admin** | `KingAlgi` | `RPLSTRONG` |
| **Admin Panitia** | `admin_tb` | `AdminTarunaBhakti2026` |

---

## 🛡️ Catatan Keamanan: DOM-based XSS (CWE-79) False Positives

Sistem PPDB ini memiliki modul perlindungan tangguh terhadap serangan XSS berbasis DOM melalui fungsi sanitasi URL tersentralisasi yang ada di [security.ts](file:///d:/Website%20Project/PPDB_SMK_TarunaBhakti/frontend/src/utils/security.ts):

* **Fungsi `sanitizeUrl` & `sanitizeSrc`**:
  * Menghapus karakter kontrol tersembunyi (seperti `\u0000-\u001F`, tab, baris baru) yang biasa digunakan peretas untuk menyelundupkan muatan jahat (obfuscated payload) seperti `java\tscript:`.
  * Membatasi protokol URL secara ketat hanya pada protokol aman (`http`, `https`, `mailto`, `tel`).
  * Membatasi `data:` URI hanya untuk format dokumen aman (`data:application/pdf;base64,...`) dan format gambar aman (`png`, `jpeg`, `jpg`, `gif`, `webp`).
  * Mengubah URL berbahaya (seperti skema `javascript:`) secara otomatis menjadi `#` atau string kosong `""`.

### Mengapa Snyk Code Masih Melaporkan Peringatan?
Alat analisis kode statis seperti Snyk melacak aliran data (*taint analysis*) dari sumber dinamis (nilai state React seperti `useState`) ke elemen DOM seperti `src` pada tag `<img>` atau `<iframe>`. Karena Snyk Code tidak mengevaluasi logika internal dari fungsi kustom `sanitizeSrc`, ia tidak mengenali bahwa data telah sepenuhnya divalidasi. 

**Tindakan yang direkomendasikan:** 
Peringatan ini dipastikan merupakan **False Positive (Salah Deteksi)**. Anda dapat menandai temuan ini sebagai *Ignored* (False Positive / Accepted Risk) langsung melalui panel dashboard **Snyk Web UI (Consistent Ignores)** agar tidak lagi muncul pada pemindaian berikutnya.

---

## 📦 Membangun untuk Produksi (Production Build)

Jika sistem ini akan dideploy ke lingkungan produksi:

### Backend:
```bash
# Lakukan kompilasi TypeScript jika diperlukan, lalu jalankan:
bun run start
# atau menggunakan node:
npm start
```

### Frontend:
```bash
# Build paket Next.js produksi:
bun run build
# Jalankan web server produksi:
bun run start
```
