# Rencana Peningkatan Mode Halaman (Mushaf View) dan UI Global

## 1. Tujuan

Meningkatkan pengalaman membaca dalam mode Halaman (Mushaf) agar lebih otentik, informatif, dan fungsional. Selain itu, rencana ini juga mencakup penyempurnaan estetika visual pada semua mode baca untuk meningkatkan kejelasan dan keindahan antarmuka.

## 2. Rencana Implementasi Teknis

### a. Peningkatan Header & Footer Halaman (Mode Halaman)

- **Tujuan:** Menampilkan informasi halaman dan surah dengan gaya yang khas dan informatif.
- **Implementasi:**
  1.  **Nomor Halaman Kaligrafi:**
      - **UI:** Di bagian footer atau header halaman, tampilkan nomor halaman saat ini.
      - **Styling:** Gunakan font kaligrafi Arab khusus untuk nomor halaman dan tulis nomornya menggunakan angka Arab (١, ٢, ٣, ...).
  2.  **Informasi Surah Dinamis:**
      - **UI:** Di bagian header halaman, tampilkan nama dan nomor surah.
      - **Logika:**
        - Data dari API `/pages/{pageNumber}` sudah mengelompokkan ayat per surah.
        - Ambil nama surah dari `surah.name.short` (Arab) dan `surah.name.transliteration.id` (Latin).
        - Ambil nomor surah dari `surah.number`.
        - **Aturan Multi-Surah:** Jika halaman berisi ayat dari lebih dari satu surah (misalnya di akhir surah dan awal surah berikutnya), header akan menampilkan informasi untuk **surah kedua** yang muncul di halaman tersebut, sesuai permintaan.
      - **Tampilan Ganda:** Tampilkan nama surah dalam tulisan Arab dan Latin secara bersamaan untuk kejelasan.

### b. Navigasi "Lompat ke Halaman"

- **Tujuan:** Memungkinkan pengguna untuk berpindah ke halaman spesifik dengan cepat.
- **Implementasi:**
  1.  **UI:** Tambahkan tombol ikon baru di header `QuranPageView.tsx`.
  2.  **Komponen:** Buat komponen `Dialog` baru, `JumpToPageDialog.tsx`, yang mirip dengan `JumpToVerseDialog.tsx`.
  3.  **Fungsionalitas:**
      - Dialog akan berisi satu `Input` untuk memasukkan nomor halaman (dengan validasi antara 1-604).
      - Saat tombol "Lompat" diklik, perbarui state `currentPageNumber` di `QuranPageView.tsx` dan picu pengambilan data untuk halaman baru.

### c. Fitur Terjemahan Satu Halaman

- **Tujuan:** Memberikan opsi untuk melihat terjemahan dari semua ayat dalam satu halaman secara bersamaan.
- **Implementasi:**
  1.  **UI:** Tambahkan tombol "Tampilkan Terjemahan Halaman" di suatu tempat di dalam `QuranPageView.tsx` (misalnya, di dekat header atau sebagai aksi mengambang).
  2.  **State Management:** Gunakan state lokal di dalam `QuranPageView.tsx`, misalnya `const [isTranslationVisible, setIsTranslationVisible] = useState(false);`.
  3.  **Logika Rendering:**
      - Saat tombol diklik, `setIsTranslationVisible(true)`.
      - Buat dua tampilan berbeda yang dirender secara kondisional:
        - **Jika `isTranslationVisible` adalah `false` (default):** Render teks Arab seperti biasa dalam format halaman mushaf.
        - **Jika `isTranslationVisible` adalah `true`:** Render sebuah daftar vertikal yang berisi teks terjemahan (`verse.translation.id`) untuk setiap ayat di halaman tersebut. Tampilan ini tidak perlu mengikuti layout mushaf.
  4.  **Sifat Non-Persisten:** State `isTranslationVisible` ini harus bersifat lokal dan tidak persisten. Setiap kali pengguna menavigasi ke halaman baru (maju atau mundur), tampilan harus selalu kembali ke teks Arab secara default.

### d. [Global] Garis Pemisah Ayat

- **Tujuan:** Menambahkan pemisah visual di bawah setiap baris atau ayat untuk meningkatkan keterbacaan di semua mode.
- **Implementasi:**
  - **Mode Surah & Juz:** Di dalam `src/components/quran/VerseCard.tsx`, tambahkan komponen `<Separator />` atau `div` dengan `border-b` di bagian paling bawah dari `Card`.
  - **Mode Halaman:** Di dalam `QuranPageView.tsx`, saat me-render setiap ayat, pastikan ada elemen pemisah visual di antara baris-barisnya. Ini bisa berupa `border` atau `box-shadow` yang halus.

## 3. Langkah-langkah Pengerjaan

1.  **[Global UI] Implementasi Garis Pemisah:** Modifikasi `VerseCard.tsx` untuk menambahkan `<Separator />` atau `border-b` di bagian bawah. Verifikasi tampilannya di mode Surah dan Juz.
2.  **[Mode Halaman - Data] Tampilkan Nama & Nomor Surah:** Implementasikan logika di header `QuranPageView.tsx` untuk menampilkan nama surah (Arab & Latin) dan nomornya. Terapkan aturan untuk menampilkan surah kedua jika ada lebih dari satu.
3.  **[Mode Halaman - UI] Styling Nomor Halaman:** Buat atau modifikasi komponen untuk menampilkan nomor halaman dengan font kaligrafi dan angka Arab.
4.  **[Mode Halaman - Fitur] Implementasi "Lompat ke Halaman":** Buat `JumpToPageDialog.tsx` dan integrasikan dengan `QuranPageView.tsx`.
5.  **[Mode Halaman - Fitur] Implementasi Terjemahan Satu Halaman:** Tambahkan state lokal, tombol, dan logika rendering kondisional untuk beralih antara teks Arab dan tampilan terjemahan.
6.  **[Testing] Uji Coba Menyeluruh:** Verifikasi semua fungsionalitas baru: navigasi halaman, dialog "Lompat ke", tombol terjemahan, tampilan informasi surah yang benar (terutama pada halaman dengan dua surah), dan tampilan garis pemisah di semua mode.
