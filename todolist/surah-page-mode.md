# Rencana Fitur Mode Halaman (Mushaf View)

## 1. Tujuan

Menyediakan pengalaman membaca Al-Qur'an yang otentik dan imersif dengan meniru tata letak halaman dari mushaf cetak. Fitur ini memungkinkan pengguna untuk membaca Al-Qur'an per halaman, tidak lagi per ayat dalam daftar vertikal, serta menyediakan navigasi berbasis halaman dan juz.

## 2. Prasyarat Kritis: Data API

- **Kebutuhan:** Implementasi fitur ini sangat bergantung pada ketersediaan data per halaman.
- **Sumber Data:** API `quran-api-id` yang didokumentasikan di `API_DOCUMENTATION.md` menyediakan endpoint `/pages/{pageNumber}`. Endpoint ini akan menjadi tulang punggung fitur ini.

## 3. Rencana Implementasi Teknis

### a. Pengalihan Mode Tampilan (View Switching)

- **UI:** Di header halaman `SurahDetail`, tambahkan komponen `ToggleGroup` atau `Tabs` dengan dua pilihan: "Daftar" (mode saat ini) dan "Halaman".
- **State:** Kelola state mode tampilan ini di level halaman `SurahDetail`.

### b. Komponen Baru: `QuranPageView.tsx`

- **Tujuan:** Komponen utama yang bertanggung jawab untuk merender satu halaman penuh mushaf.
- **State Internal:** `currentPageNumber`.
- **Logika:**
  1.  Berdasarkan `currentPageNumber`, komponen akan memanggil endpoint `/pages/{currentPageNumber}` untuk mendapatkan semua ayat di halaman tersebut.
  2.  Merender ayat-ayat tersebut sesuai desain.

### c. Desain & Styling Tampilan Halaman

1.  **Layout Ayat:**
    - Gunakan `div` sebagai kontainer halaman dengan `display: flex`, `flex-direction: row-reverse`, dan `flex-wrap: wrap` untuk alur dari kanan ke kiri.
    - Setiap ayat akan menjadi `span` atau `div` inline.
    - **Nomor Ayat:** Di antara setiap ayat, render nomor ayat yang dihiasi dengan ornamen kaligrafi (bisa berupa SVG atau gambar yang ditempatkan menggunakan CSS).
2.  **Tampilan Terjemahan Satu Halaman:**
    - **Opsi Desain:** Di bawah kontainer halaman, sediakan tombol "Tampilkan Terjemahan Halaman Ini".
    - **Interaksi:** Saat tombol diklik, buka komponen `Collapsible` atau `Accordion` yang berisi daftar terjemahan untuk semua ayat di halaman tersebut, diurutkan berdasarkan nomor ayat.
3.  **Penanda Juz & Surah:**
    - **API Data:** Data dari endpoint `/pages/{pageNumber}` sudah mengelompokkan ayat per surah dan menyertakan metadata `juz`.
    - **Logika:** Sebelum merender ayat, periksa apakah ayat tersebut adalah yang pertama di halaman atau jika nomor `juz` atau `surah`-nya berbeda dari ayat sebelumnya. Jika ya, render sebuah header atau penanda visual yang jelas (misalnya, nama surah atau penanda "Awal Juz X").

### d. Fungsionalitas & Navigasi

1.  **Aksi per Halaman:**
    - Sediakan menu atau tombol untuk aksi berikut:
      - **Putar Audio Halaman:** Memutar semua ayat di halaman secara berurutan.
      - **Bookmark Halaman:** Menyimpan nomor halaman sebagai bookmark.
      - **Salin Teks Halaman:** Menyalin semua teks Arab di halaman tersebut.
2.  **Navigasi Halaman:**
    - Sediakan tombol panah Kiri/Kanan untuk berpindah halaman (`currentPageNumber +/- 1`).
    - Implementasikan gestur geser (swipe left/right) untuk berpindah halaman.
    - Pergantian halaman tidak dibatasi oleh surat, sesuai dengan tata letak mushaf.
3.  **Navigasi Audio-driven:**
    - Jika pemutar audio global sedang aktif dan berpindah ke ayat yang ada di halaman lain, komponen `QuranPageView` harus mendengarkan perubahan state audio global dan secara otomatis mengubah `currentPageNumber` agar sesuai.
4.  **Lompat ke Halaman/Juz:**
    - Buat `Dialog` baru (`JumpToPageDialog.tsx`).
    - Dialog ini berisi `Input` untuk nomor halaman dan `Select` untuk memilih Juz (1-30).
    - Saat dipilih, cari halaman awal dari Juz tersebut (memerlukan data pemetaan juz ke halaman) atau langsung navigasi ke nomor halaman yang dimasukkan.

## 4. Langkah-langkah Pengerjaan

1.  **[UI]** Tambahkan `ToggleGroup` di `SurahDetail` untuk beralih antara mode "Daftar" dan "Halaman".
2.  **[Komponen]** Buat kerangka komponen `QuranPageView.tsx`.
3.  **[Rendering]** Implementasikan logika untuk mengambil data dari `/pages/{pageNumber}` dan merender ayat-ayat dalam satu baris yang bisa wrap, lengkap dengan styling nomor ayat.
4.  **[Navigasi]** Tambahkan fungsionalitas navigasi dasar (tombol panah dan swipe).
5.  **[Dialog]** Buat `Dialog` untuk fitur "Lompat ke Halaman/Juz".
6.  **[Styling]** Implementasikan desain untuk penanda Juz dan styling terjemahan (menggunakan `Collapsible`).
7.  **[Fitur]** Tambahkan tombol aksi per halaman (Play, Bookmark, Copy).
8.  **[Integrasi Audio]** Hubungkan `QuranPageView` dengan state audio global untuk navigasi yang digerakkan oleh audio.
9.  **[Testing]** Uji coba semua fungsionalitas, terutama transisi antar halaman dan akurasi data.
