# 🏋️‍♂️ Adminator - Admin Panel

Adminator adalah proyek Admin Panel yang dikembangkan menggunakan teknologi modern untuk memudahkan pengelolaan data. Anda dapat menjalankan proyek ini secara lokal atau mengakses versi live-nya di:

🔗 **Live Demo:** [Adminator Test](https://adminator-test.vercel.app/)

## 🚀 Cara Menjalankan Secara Lokal

### 🛠️ 1. Clone Repository
Jalankan perintah berikut untuk mengunduh kode sumber:
```bash
git clone https://github.com/Rheno27/adminator-test
cd adminator-test
```

### 💪 2. Install Dependencies
Pastikan Anda telah menginstal **Node.js** (disarankan versi terbaru). Kemudian jalankan:
```bash
npm install
```

### 🔑 3. Konfigurasi Environment Variables
Buat file `.env` di root folder dan tambahkan konfigurasi berikut:
```bash
VITE_API_URL=https://gorest.co.in
VITE_ACCESS_TOKEN=Bearer YOUR_ACCESS_TOKEN
```

#### 📚 Cara Mendapatkan Access Token di GoRest
1. Buka 🌐 [GoRest](https://gorest.co.in)
2. Klik **Sign Up** atau **Login** jika sudah memiliki akun
3. Pergi ke halaman **Access Token**
4. Klik **Generate Access Token**
5. Salin token yang diberikan dan gunakan sebagai `VITE_ACCESS_TOKEN` dalam file `.env`.

**Contoh `.env` setelah diisi:**
```bash
VITE_API_URL=https://gorest.co.in
VITE_ACCESS_TOKEN=Bearer 12345
```

### ▶️ 4. Menjalankan Proyek
Untuk menjalankan proyek dalam mode pengembangan, gunakan:
```bash
npm run dev
```
Aplikasi akan berjalan di: **`http://localhost:3000/`**

### 🏙️ 5. Build dan Jalankan dalam Mode Production
```bash
npm run build
npm start
```

## 🛠️ Teknologi yang Digunakan
- ⚛️ **React** – Library untuk membangun UI interaktif
- 🚦 **React Router** – Navigasi berbasis client-side
- ⚡ **TanStack React Query** – Manajemen data dan caching
- 🎨 **React Bootstrap** – Komponen UI berbasis Bootstrap
- 🔔 **React Toastify** – Notifikasi dalam aplikasi
- ⚡ **Vite** – Build tool cepat untuk pengembangan frontend

## 📝 Catatan
📌 Jika ada masalah saat menjalankan proyek, pastikan:
- Semua dependensi telah terinstal dengan benar (`npm install`)
- Anda menggunakan **Node.js** versi terbaru
- Token API sudah diatur di `.env`

---

✨ Selamat menggunakan **Adminator**! 🚀

