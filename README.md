# 🗳️ Website E-Voting Pemilihan Ketua & Wakil Ketua Kelas

Aplikasi web voting pemilihan Ketua dan Wakil Ketua Kelas bersifat native (HTML5, CSS3, JavaScript Vanilla) menggunakan **Firebase Firestore Database** untuk penyimpanan data realtime dan anti-duplikasi suara, serta siap dihosting di **Vercel** via **GitHub**.

---

## 📁 Struktur Folder Proyek
```
evote-ketua-kelas/
├── index.html             # Halaman utama pemilihan (Role Siswa/User)
├── admin.html             # Dashboard kontrol & Quick Count realtime (Role Admin)
├── style.css              # Tampilan modern, bersih, dan responsif
├── app.js                 # Logika voting siswa & validasi Firebase
├── admin.js               # Logika dashboard admin, quick count, & inisialisasi data
├── firebase-config.js     # File konfigurasi Firebase API key
└── assets/                # Folder untuk foto kandidat (opsional)
```

---

## 🚀 Panduan Setup Langkah demi Langkah

### 1. Buat Proyek Firebase (Gratis)
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login dengan akun Google.
2. Klik **"Add project"** / **"Buat Proyek"** $\rightarrow$ Beri nama (contoh: `evote-kelas`).
3. Pada menu sebelah kiri, buka **Build** $\rightarrow$ **Firestore Database** $\rightarrow$ Klik **Create Database**.
   - Pilih lokasi: `asia-southeast2` (Jakarta) atau terdekat.
   - Pilih mode: **Start in test mode** (agar langsung bisa dibaca & ditulis saat uji coba).
4. Klik icon gerigi ⚙️ (**Project settings**) $\rightarrow$ Pada bagian bawah ("Your apps"), klik icon Web `</>`.
5. Beri nama aplikasi web, lalu copy objek `firebaseConfig`.
6. Buka file `firebase-config.js` di proyek ini dan ganti isinya dengan config milik Anda:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "evote-kelas.firebaseapp.com",
     projectId: "evote-kelas",
     storageBucket: "evote-kelas.appspot.com",
     messagingSenderId: "...",
     appId: "..."
   };
   ```

---

### 2. Inisialisasi 26 Siswa & 2 Paslon (Hanya 1x Klik)
1. Buka file `admin.html` di browser Anda.
2. Masukkan PIN Admin: `admin123`.
3. Klik tombol **"⚡ Inisialisasi Database (26 Siswa & 2 Paslon)"**.
4. Sistem otomatis membuat data 2 Paslon dan 26 slot nomor absen siswa (`01` s.d. `26`) dengan PIN masing-masing (`1101` s.d. `1126`).

---

### 3. Simpan ke GitHub
1. Buka terminal di folder proyek ini:
   ```bash
   git init
   git add .
   git commit -m "Initial commit website evote ketua kelas"
   ```
2. Buat repositori baru di [GitHub](https://github.com/new) (misal: `evote-ketua-kelas`).
3. Sambungkan repositori lokal dan push ke GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/evote-ketua-kelas.git
   git push -u origin main
   ```

---

### 4. Hosting Publik di Vercel (Gratis & Cepat)
1. Masuk ke [Vercel](https://vercel.com/) dan login dengan akun GitHub Anda.
2. Klik **"Add New..."** $\rightarrow$ **"Project"**.
3. Pilih repositori `evote-ketua-kelas` yang baru saja Anda push.
4. Klik tombol **"Deploy"** (tidak perlu konfigurasi build karena ini project native HTML/JS).
5. Dalam beberapa detik, website Anda sudah aktif dengan URL publik (contoh: `https://evote-ketua-kelas.vercel.app`) dan bisa langsung diakses oleh 26 siswa kelas melalui HP maupun Laptop!

---

## 🔑 Aturan Login Siswa
- **Nomor Absen:** `01`, `02`, ..., `26` (Wajib 2 digit).
- **Format PIN Siswa:** Pola `11` + Nomor Absen:
  - Absen 01 $\rightarrow$ `1101`
  - Absen 15 $\rightarrow$ `1115`
  - Absen 26 $\rightarrow$ `1126`
- **Aturan Suara:** Sekali nomor absen tersebut berhasil vote, statusnya langsung dikunci (`hasVoted: true`) di Firebase dan tidak akan bisa memilih lagi.
