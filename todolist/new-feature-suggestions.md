# Saran Fitur Baru & Peningkatan

Berdasarkan analisis permintaan, file-file proyek yang ada, dan dokumentasi API, berikut adalah beberapa saran fitur baru yang dapat diimplementasikan untuk memperkaya aplikasi.

## 1. Peningkatan Konten & Referensi Silang

### a. Integrasi Berbagai Kitab Tafsir

- **Kebutuhan:** Saat ini aplikasi hanya menampilkan satu jenis tafsir. Pengguna studi yang serius seringkali membandingkan beberapa tafsir.
- **Rencana:**
  1.  **Sumber Data:** Cari dan kumpulkan data tafsir lain (misalnya, Ibn Kathir, Jalalayn) dalam format JSON.
  2.  **UI:** Di bawah setiap `VerseCard`, tambahkan komponen `Tabs` atau `Select` untuk beralih antara "Tafsir Kemenag", "Tafsir Ibn Kathir", dll.
  3.  **Logika:** Saat tab dipilih, ambil dan tampilkan konten tafsir yang sesuai.

### b. Referensi Silang Ayat ke Hadits

- **Kebutuhan:** Menghubungkan ayat Al-Qur'an dengan hadits yang relevan (misalnya, hadits yang menjadi sebab turunnya ayat atau yang menjelaskannya).
- **Rencana:**
  1.  **API:** Manfaatkan API Hadits dari `API_Definition.md` (`/api/id/hadits/:rawi`).
  2.  **Data Mapping:** Diperlukan proses kurasi data untuk memetakan ayat ke hadits yang relevan. Ini bisa dimulai secara manual untuk beberapa ayat populer.
  3.  **UI:** Di bawah `VerseCard`, tambahkan bagian "Hadits Terkait" yang menampilkan daftar link ke hadits yang relevan.

### c. Pilihan Qari (Reciter)

- **Kebutuhan:** Pengguna memiliki preferensi qari yang berbeda-beda.
- **Rencana:**
  1.  **API Data:** Endpoint detail surat dari `API_DOCUMENTATION.md` sudah menyediakan beberapa URL audio dari qari yang berbeda (`alafasy`, `ahmedajamy`, dll.).
  2.  **UI:** Di halaman Pengaturan, tambahkan `Select` atau `RadioGroup` untuk "Pilih Qari".
  3.  **Logika:** Simpan pilihan qari di `useReadingPreferences`. `AudioProvider` akan menggunakan URL audio dari qari yang dipilih saat memutar ayat.

## 2. Personalisasi & Gamifikasi

### a. Riwayat Baca & Statistik Personal

- **Kebutuhan:** Memberikan pengguna wawasan tentang aktivitas membaca mereka untuk motivasi.
- **Rencana:**
  1.  **Backend:** Diperlukan tabel `reading_history` untuk mencatat setiap ayat yang dibaca oleh pengguna.
  2.  **Logika Frontend:** Gunakan `IntersectionObserver` pada `VerseCard`. Jika sebuah ayat terlihat di layar selama beberapa detik, catat sebagai "dibaca".
  3.  **UI:** Buat halaman "Profil" atau "Statistik Saya" yang menampilkan:
      - **Jejak Membaca (Reading Streak):** Jumlah hari berturut-turut membaca.
      - **Surat Paling Sering Dibaca.**
      - **Grafik Aktivitas Mingguan.**

### b. Tujuan Membaca Harian (Daily Goals)

- **Kebutuhan:** Membantu pengguna membangun kebiasaan membaca yang konsisten.
- **Rencana:**
  1.  **UI:** Di halaman Pengaturan, izinkan pengguna mengatur target harian (misalnya, "10 ayat per hari" atau "15 menit per hari").
  2.  **Logika:** Tampilkan progress bar di halaman utama yang menunjukkan kemajuan target hari ini berdasarkan data dari `reading_history`.

## 3. Fitur Utilitas Islami

### a. Jadwal Sholat & Notifikasi Adzan

- **Kebutuhan:** Menjadikan aplikasi sebagai pusat kebutuhan ibadah harian.
- **Rencana:** Ini adalah fitur besar yang sudah direncanakan dalam `prayer-schedule-and-notifications.md` dan `solat-omatic-integration-plan.md`. Rencana tersebut valid dan harus diikuti.

### b. Kompas Arah Kiblat

- **Kebutuhan:** Alat bantu praktis bagi pengguna yang sedang bepergian.
- **Rencana:**
  1.  **Logika:** Gunakan `navigator.geolocation` untuk mendapatkan lokasi pengguna. Hitung arah kiblat menggunakan formula Haversine.
  2.  **Sensor:** Gunakan `DeviceOrientationEvent` untuk mendapatkan orientasi perangkat.
  3.  **UI:** Buat halaman khusus dengan gambar kompas yang jarumnya bergerak sesuai sensor dan memiliki penanda arah kiblat.
