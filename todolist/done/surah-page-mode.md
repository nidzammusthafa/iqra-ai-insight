# Rencana Fitur Mode Tampilan Lanjutan (Surah, Halaman, Juz)

## 1. Tujuan

Menyediakan pengalaman membaca Al-Qur'an yang fleksibel, otentik, dan imersif. Fitur ini memungkinkan pengguna untuk membaca Al-Qur'an dengan tiga mode berbeda: **per Surah** (tampilan daftar vertikal standar), **per Halaman** (meniru tata letak mushaf cetak), dan **per Juz** (membaca seluruh juz dalam satu tampilan).

## 2. Prasyarat Kritis: Data API

- **Kebutuhan:** Implementasi fitur ini sangat bergantung pada ketersediaan data yang sesuai untuk setiap mode.
- **Sumber Data:** API `quran-api-id` menyediakan endpoint yang dibutuhkan:
  - `/surahs/{surahNumber}`: Untuk mode Surah (sudah digunakan).
  - `/pages/{pageNumber}`: Untuk mode Halaman.
  - `/juz/{juzNumber}`: Untuk mode Juz.

## 3. Rencana Implementasi Teknis

### a. Pengalihan Mode Tampilan (View Switching)

- **UI:** Di halaman utama Al-Qur'an (`QuranHome`) atau di header `SurahDetail`, tambahkan komponen `ToggleGroup` atau `Tabs` dengan tiga pilihan: **"Surah"**, **"Halaman"**, dan **"Juz"**.
- **State:** Kelola state mode tampilan ini secara global (misalnya di `preferencesSlice`) agar pilihan pengguna tersimpan.

### b. Mode Halaman (`QuranPageView.tsx`)

- **Tujuan:** Komponen utama yang bertanggung jawab untuk merender satu halaman penuh mushaf.
- **State Internal:** `currentPageNumber`.
- **Logika:**
  1.  Berdasarkan `currentPageNumber`, komponen akan memanggil endpoint `/pages/{pageNumber}`.
  2.  Merender ayat-ayat tersebut sesuai desain mushaf.

### c. Desain & Styling Tampilan Halaman

1.  **Layout Ayat:**
    - Gunakan `div` sebagai kontainer halaman dengan `display: flex`, `flex-direction: row-reverse`, dan `flex-wrap: wrap` untuk alur dari kanan ke kiri.
    - Setiap ayat akan menjadi `span` atau `div` inline.
    - **Nomor Ayat:** Render nomor ayat dengan ornamen kaligrafi di antara setiap ayat.
2.  **Tampilan Terjemahan:**
    - Di bawah kontainer halaman, sediakan tombol "Tampilkan Terjemahan Halaman Ini". Saat diklik, buka `Collapsible` yang berisi daftar terjemahan untuk semua ayat di halaman tersebut.
3.  **Penanda Juz & Surah:**
    - Data dari `/pages/{pageNumber}` sudah menyertakan metadata `juz` dan mengelompokkan ayat per surah.
    - Render header atau penanda visual yang jelas jika ayat pertama di halaman merupakan awal dari juz atau surah baru.

### d. Fungsionalitas & Navigasi (Mode Halaman)

1.  **Aksi per Halaman:** Sediakan menu untuk aksi: Putar Audio Halaman, Bookmark Halaman, Salin Teks Halaman.
2.  **Navigasi Halaman:** Sediakan tombol panah Kiri/Kanan dan gestur geser (swipe) untuk berpindah halaman.
3.  **Navigasi Audio-driven:** Saat audio player global berpindah ke ayat di halaman lain, `QuranPageView` harus otomatis mengubah `currentPageNumber`.
4.  **Lompat ke Halaman/Juz:** Buat `Dialog` baru (`JumpToPageDialog.tsx`) dengan input nomor halaman dan pilihan Juz (1-30).

### e. Tampilan Berdasarkan Juz (`QuranJuzView.tsx`)

- **Tujuan:** Menampilkan semua ayat dalam satu juz dalam satu tampilan scroll yang berkelanjutan.
- **Logika:**
  1.  Komponen menerima `juzNumber` sebagai properti.
  2.  Memanggil endpoint `/juz/{juzNumber}` untuk mendapatkan semua data ayat dalam juz tersebut. Data ini sudah terkelompok per surah.
  3.  **Render dengan Penanda Surah:** Saat me-render daftar ayat, lakukan iterasi pada data yang sudah terkelompok:
      - Untuk setiap surah baru di dalam juz, render sebuah **komponen header surah** yang mencolok. Header ini berisi nama surah, nomor, dan mungkin ornamen pemisah.
      - Di bawah header tersebut, render semua `VerseCard` untuk ayat-ayat dari surah tersebut yang termasuk dalam juz itu.

## 4. Saran Fitur Terkait

### a. Untuk Mode Halaman (Mushaf View)

- **Mode Halaman Ganda:** Di perangkat layar lebar (tablet/desktop), tampilkan dua halaman berdampingan seperti mushaf yang terbuka untuk pengalaman membaca yang lebih otentik.
- **Mode Hafalan (Hifz Mode):** Sediakan fitur untuk menyembunyikan beberapa baris atau ayat. Pengguna dapat mengetuk area tersebut untuk menampilkannya kembali, membantu proses validasi hafalan.
- **Highlighting Tajwid:** (Fitur Lanjutan) Berikan warna berbeda pada teks Arab untuk menandakan hukum tajwid (misal: merah untuk ghunnah, hijau untuk idgham). Ini membutuhkan data API yang mendukung atau analisis sisi klien yang kompleks.

### b. Untuk Mode Juz (Juz View)

- **Pelacak Progres Juz:** Tampilkan _progress bar_ yang _sticky_ di bagian atas atau bawah layar untuk menunjukkan sejauh mana pengguna telah membaca/scroll dalam juz tersebut.
- **Tujuan Bacaan Juz:** Izinkan pengguna menyetel target pribadi, seperti "Selesaikan 1 Juz per hari", dan tampilkan progres pencapaiannya.
- **Audio Player Terlingkup Juz:** Saat dalam mode Juz, pemutaran berkelanjutan secara otomatis berhenti di akhir juz dan memberikan opsi untuk lanjut ke juz berikutnya.

## 5. Langkah-langkah Pengerjaan

1.  **[UI]** Tambahkan `ToggleGroup` di `QuranHome` untuk beralih antara mode **"Surah"**, **"Halaman"**, dan **"Juz"**.
2.  **[Navigasi]** Buat sistem navigasi untuk memilih Juz (misalnya, daftar Juz di `QuranHome`).
3.  **[Komponen Juz]** Buat kerangka komponen `QuranJuzView.tsx`.
4.  **[Rendering Juz]** Implementasikan logika untuk mengambil data dari `/juz/{juzNumber}` dan merender ayat-ayat lengkap dengan **header penanda surah**.
5.  **[Komponen Halaman]** Buat kerangka komponen `QuranPageView.tsx`.
6.  **[Rendering Halaman]** Implementasikan logika untuk mengambil data dari `/pages/{pageNumber}` dan merender ayat-ayat dalam format halaman mushaf.
7.  **[Navigasi Halaman]** Tambahkan fungsionalitas navigasi dasar (tombol panah dan swipe) untuk mode Halaman.
8.  **[Dialog]** Buat `Dialog` untuk fitur "Lompat ke Halaman/Juz".
9.  **[Fitur & Integrasi]** Tambahkan tombol aksi per halaman dan hubungkan dengan state audio global.
10. **[Testing]** Uji coba semua fungsionalitas, terutama transisi antar mode, halaman, dan akurasi data.
