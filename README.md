<div align="center">

  # 🗳️ EVOTE XI RPL 1
  ### Sistem Pemilihan Ketua & Wakil Ketua Kelas Berbasis Web Modern

  [![Live Demo](https://img.shields.io/badge/Demo-Live%20Website-4f46e5?style=for-the-badge&logo=vercel&logoColor=white)](https://evote-pemilas.vercel.app)
  [![Platform](https://img.shields.io/badge/Platform-Web%20(Mobile%20%26%20Desktop)-success?style=for-the-badge)](#)
  [![Tech](https://img.shields.io/badge/Stack-Native%20HTML%20%7C%20CSS%20%7C%20JS%20%7C%20Firebase-orange?style=for-the-badge)](#)

  <br />

  **🌐 Akses Website Langsung:**  
  ### 👉 [https://evote-pemilas.vercel.app](https://evote-pemilas.vercel.app) 👈

  <p align="center">
    Aplikasi e-voting transparan, responsif, cepat, dan anti-kecurangan yang dirancang khusus untuk menyukseskan pemilihan Ketua & Wakil Ketua Kelas XI Rekayasa Perangkat Lunak 1.
  </p>

</div>

---

## 🌟 Tentang Proyek

**EVOTE XI RPL 1** hadir sebagai solusi modern untuk menggantikan sistem pemungutan suara konvensional berbasis kertas. Dibangun secara murni (*native*) dengan optimasi performa tinggi, sistem ini menjamin asas pemilu **LUBER (Langsung, Umum, Bebas, dan Rahasia)** untuk 26 siswa kelas XI RPL 1.

Sistem dilengkapi proteksi data realtime menggunakan **Firebase Firestore**, memastikan integritas suara dengan mekanisme **1 Siswa = 1 Hak Suara** tanpa adanya kemungkinan suara ganda (*anti-duplicate voting*).

---

## 👥 Pasangan Calon (Kandidat)

| Nomor Urut | Pasangan Calon | Visi & Karakter |
| :---: | :--- | :--- |
| **01** | **Yudistira & Maskhidir** | *"Sinergi Bersama, Coding Kompak, Solidaritas Tanpa Kesenjangan"* |
| **02** | **Mirza & Salman** | *"Disiplin, Berprestasi, Nyaman, dan Siap Berinovasi di Era Digital"* |

---

## ✨ Fitur-Fitur Unggulan

### 1. 🛡️ Sistem Login Anti-Duplikasi Suara (Atomic Firestore)
- Menggunakan skema autentikasi praktis: **Nomor Absen (`01` s.d. `26`)** + **PIN Berpola (`1101` s.d. `1126`)**.
- Menggunakan Firestore *Atomic Transactions* (`FieldValue.increment`): Sekali hak suara digunakan, token/status siswa otomatis terkunci permanen (`hasVoted: true`).
- Bebas dari bug duplikasi, aman meskipun 26 siswa melakukan submit voting secara serentak.

### 2. 📱 Antarmuka Glassmorphism & Mobile-First
- Tampilan modern dengan perpaduan warna *Indigo/Slate*, efek *floating glowing orbs*, dan micro-interactions halus saat tombol ditekan.
- Responsif penuh dan nyaman diakses langsung melalui smartphone (HP), tablet, maupun PC/laptop.

### 3. 📖 Halaman Detail Visi, Misi & Program Kerja
- Dilengkapi tab interaktif untuk meninjau secara mendalam profil, visi, misi, dan target program kerja unggulan dari masing-masing pasangan calon sebelum menentukan pilihan.

### 4. 👑 Realtime Live Quick Count & Banner Pemenang
- Perolehan suara ter-update secara otomatis secara realtime tanpa perlu me-refresh halaman.
- Dilengkapi diagram progres perolehan suara serta penobatan otomatis pemenang pemilihan.

### 5. ⚙️ Dashboard Panel Kontrol Panitia (Admin)
- Terproteksi autentikasi PIN khusus pengurus kelas.
- **Kontrol Pemilihan:** Fitur 1-klik untuk membuka atau mengunci/menutup sesi pemungutan suara.
- **Tabel Presensi Realtime:** Memantau siapa saja dari 26 siswa yang sudah vs belum menggunakan hak suaranya tanpa melanggar kerahasiaan pilihan paslon.
- **Manajemen Database:** Fitur inisialisasi instan dan reset suara.

---

## 🛠️ Tech Stack & Arsitektur

- **Frontend:** HTML5 Semantik, CSS3 Modern (Custom Variables, Flexbox/Grid, Glassmorphism), Vanilla JavaScript (ES6+).
- **Database & Backend Services:** [Google Firebase Firestore](https://firebase.google.com/) (Realtime NoSQL Database).
- **Deployment & Hosting:** [Vercel](https://vercel.com/) (CI/CD otomatis terhubung dengan repositori GitHub).

---

## 📂 Struktur Repositori

```bash
evote-ketua-kelas/
├── index.html           # Halaman utama pemilihan & bilik suara
├── visi-misi.html       # Halaman eksplorasi visi & misi paslon
├── hasil.html           # Halaman live quick count & penobatan pemenang
├── admin.html           # Dashboard manajemen panitia kelas
├── style.css            # Sistem desain, animasi, & layout responsif
├── app.js               # Logika voting siswa & transaksi Firestore
├── admin.js             # Logika kontrol admin & pemantau presensi 26 siswa
├── firebase-config.js   # Konfigurasi API Firebase Firestore
└── assets/              # Aset visual & grafis pendukung
```

---

## 🚀 Panduan Menjalankan Proyek Secara Lokal

1. **Clone Repositori:**
   ```bash
   git clone https://github.com/GalungSS/EvotePemilas.git
   cd EvotePemilas
   ```

2. **Jalankan Web Server Lokal:**
   - Gunakan extension **Live Server** di VS Code, atau
   - Jalankan menggunakan Python:
     ```bash
     python -m http.server 5500
     ```

3. **Akses di Browser:**
   Buka `http://localhost:5500/` pada peramban Anda.

---

## 🔒 Aturan Autentikasi Pemilih

- **Format Nomor Absen:** `01`, `02`, `03`, ... `26` (Wajib 2 digit angka).
- **Pola PIN Siswa:** Awalan `11` + Nomor Absen:
  - Siswa Absen 01 $\rightarrow$ PIN: `1101`
  - Siswa Absen 12 $\rightarrow$ PIN: `1112`
  - Siswa Absen 26 $\rightarrow$ PIN: `1126`

---

<div align="center">

  **Dibuat dengan dedikasi untuk Demokrasi Kelas XI Rekayasa Perangkat Lunak 1**  
  *© 2026 Pemilihan Ketua & Wakil Ketua Kelas XI RPL 1.*

</div>
