# Rencana Integrasi Eksternal

## 1. Tujuan

Memperkaya aplikasi Al-Qur'an dengan data dan fungsionalitas Islami lainnya dari sumber eksternal yang terpercaya. Tujuannya adalah menjadikan aplikasi ini sebagai pusat kebutuhan spiritual harian pengguna, tidak hanya terbatas pada membaca Al-Qur'an.

## 2. Rencana Implementasi Teknis

### a. Integrasi Waktu Sholat (Prayer Times)

- **Tujuan:** Menampilkan jadwal sholat harian berdasarkan lokasi pengguna.
- **Penyedia API:**
  - **API Publik:** `api.aladhan.com` (populer dan gratis), Fathimah API.
  - **Pilihan Terbaik:** Cari API yang menyediakan data dari sumber terpercaya seperti Kementerian Agama di negara target.
- **Implementasi:**
  1.  **Deteksi Lokasi:**
      - Minta izin pengguna untuk mengakses lokasi menggunakan `navigator.geolocation.getCurrentPosition()`.
      - Jika pengguna menolak, sediakan input manual untuk mencari kota/lokasi.
  2.  **Logika Frontend:**
      - Buat *custom hook* `usePrayerTimes(latitude, longitude)`.
      - *Hook* ini akan memanggil API waktu sholat dan mengelola *state* (jadwal sholat, waktu sholat berikutnya, dll.).
      - Lakukan *caching* hasil API di `localStorage` dengan kunci berbasis tanggal dan lokasi untuk menghindari panggilan API yang berlebihan.
  3.  **UI:**
      - Buat komponen `PrayerTimesCard` untuk ditampilkan di halaman utama.
      - Tampilkan jadwal sholat untuk hari ini (Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya).
      - Sorot waktu sholat berikutnya dan tampilkan hitung mundur ("2 jam 15 menit menuju Ashar").

### b. Kompas Arah Kiblat (Qibla Direction Compass)

- **Tujuan:** Membantu pengguna menemukan arah Kiblat dari lokasi mereka saat ini.
- **Implementasi (Memerlukan Sensor Perangkat):**
  1.  **Perhitungan Arah:**
      - Dapatkan lokasi pengguna (latitude, longitude).
      - Arah Kiblat (dari Ka'bah di Mekkah: 21.4225° N, 39.8262° E) dapat dihitung menggunakan formula matematika Haversine.
      - Buat fungsi `calculateQiblaBearing(userLat, userLon)` yang mengembalikan sudut arah Kiblat dari Utara.
  2.  **Akses Sensor Orientasi:**
      - Minta izin untuk mengakses sensor perangkat. Ini adalah bagian yang paling rumit karena API-nya berbeda antar browser dan OS (`DeviceOrientationEvent`, `deviceorientationabsolute`).
      - `DeviceOrientationEvent.webkitCompassHeading` (untuk iOS) atau `event.alpha` (untuk Android) memberikan arah yang ditunjuk perangkat dari Utara.
  3.  **UI:**
      - Buat halaman atau `Dialog` khusus untuk fitur Kiblat.
      - Tampilkan gambar kompas.
      - Buat jarum atau indikator pada kompas yang akan berputar berdasarkan data dari sensor orientasi.
      - Tampilkan penanda arah Kiblat pada sudut yang sudah dihitung.
      - Pengguna harus memutar perangkat mereka hingga jarum kompas sejajar dengan penanda Kiblat.

### c. Integrasi Kalender Islam (Islamic Calendar)

- **Tujuan:** Menampilkan tanggal Hijriah saat ini dan informasi tentang hari-hari penting dalam Islam.
- **Penyedia API/Library:**
  - Gunakan *library* seperti `hijri-date` atau `moment-hijri` untuk konversi tanggal.
  - API waktu sholat (seperti Al-Adhan) seringkali juga menyertakan tanggal Hijriah dalam responsnya.
- **Implementasi:**
  1.  **UI:**
      - Tampilkan tanggal Hijriah di samping tanggal Masehi di halaman utama.
      - Buat halaman atau komponen kalender penuh yang menampilkan bulan Hijriah saat ini.
  2.  **Hari Penting:**
      - Buat daftar hari-hari besar Islam (Idul Fitri, Idul Adha, Awal Ramadhan, dll.) dalam sebuah file JSON.
      - Tandai tanggal-tanggal tersebut di dalam komponen kalender.

### d. Referensi Silang Hadits (Hadits Cross-Referencing)

- **Tujuan:** Menghubungkan sebuah ayat Al-Qur'an dengan hadits-hadits yang relevan (yang menjadi *asbabun nuzul* atau penjelas ayat tersebut).
- **Implementasi (Membutuhkan Kurasi Data):**
  1.  **Database:** Diperlukan pemetaan antara ayat dan hadits. Ini bisa berupa tabel `verse_hadith_references` (`surah_number`, `verse_number`, `hadith_collection`, `hadith_number`).
  2.  **Proses Kurasi:** Proses ini bisa manual (oleh ahli) atau semi-otomatis (menggunakan model AI untuk menemukan potensi hubungan, lalu diverifikasi oleh manusia).
  3.  **API:** Buat *endpoint* `GET /api/verses/{id}/related-hadiths`.
  4.  **UI:** Di bawah setiap `VerseCard` di `SurahDetail`, tambahkan bagian "Hadits Terkait". Tampilkan daftar hadits yang relevan sebagai *link* yang bisa diklik untuk membuka detail hadits tersebut.

### e. Integrasi Kitab Tafsir (Tafsir Books Integration)

- **Tujuan:** Memberikan pengguna akses ke berbagai sumber tafsir untuk pemahaman ayat yang lebih mendalam, di luar tafsir default.
- **Implementasi:**
  1.  **Sumber Data:** Dapatkan data kitab tafsir populer (seperti Tafsir Ibn Kathir, Jalalayn, Al-Muyassar) dalam format JSON. Banyak proyek *open-source* di GitHub yang menyediakan data ini.
  2.  **Backend:** Simpan data tafsir ini di database Anda atau sediakan sebagai file JSON statis yang bisa diakses melalui API.
  3.  **UI:**
      - Di `SurahDetail`, di bawah setiap ayat, tambahkan `Tabs` atau `Select` (dropdown) untuk beralih antar sumber tafsir.
      - Tab pertama adalah tafsir default (misalnya, Kemenag), tab berikutnya adalah "Ibn Kathir", "Jalalayn", dst.
      - Saat pengguna memilih sumber tafsir lain, *fetch* data tafsir yang sesuai dari API dan tampilkan di bawah ayat.

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Integrasikan **Waktu Sholat** dan **Kalender Islam** karena memberikan nilai tambah harian yang signifikan dan relatif mudah diimplementasikan dengan API/library yang ada.
2.  **[Prioritas Sedang]** Implementasikan **Integrasi Kitab Tafsir**. Ini sangat meningkatkan nilai aplikasi sebagai alat studi.
3.  **[Prioritas Rendah/Kompleks]** Implementasikan **Kompas Arah Kiblat** karena ketergantungan pada API sensor perangkat yang bisa jadi tidak konsisten.
4.  **[Jangka Panjang]** Bangun sistem **Referensi Silang Hadits** karena memerlukan upaya kurasi data yang besar namun memberikan nilai ilmiah yang sangat tinggi.
