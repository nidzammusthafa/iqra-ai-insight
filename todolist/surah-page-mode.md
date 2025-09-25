# Rencana Peningkatan Mode Halaman (Mushaf View) dan UI Global

## 1. Tujuan

Meningkatkan pengalaman membaca dalam mode Halaman (Mushaf) agar lebih otentik, informatif, dan fungsional. Rencana ini mencakup penambahan interaksi per ayat, fungsionalitas audio, dan penyempurnaan estetika visual untuk menciptakan pengalaman yang imersif.

## 2. Rencana Implementasi Teknis

### a. Peningkatan Header & Footer Halaman
- **Tujuan:** Menampilkan informasi halaman dan surah dengan gaya yang khas.
- **Implementasi:**
  1.  **Nomor Halaman Kaligrafi:** Tampilkan nomor halaman di footer/header menggunakan font kaligrafi dan angka Arab (١, ٢, ٣, ...).
  2.  **Informasi Surah Dinamis:** Di header, tampilkan nama surah (Arab & Latin) dan nomornya. Jika ada lebih dari satu surah, tampilkan informasi surah kedua yang muncul di halaman tersebut.

### b. Navigasi "Lompat ke Halaman"
- **Tujuan:** Memungkinkan pengguna berpindah ke halaman spesifik dengan cepat.
- **Implementasi:**
  1.  **UI:** Tambahkan tombol ikon di header `QuranPageView.tsx`.
  2.  **Komponen:** Buat `Dialog` baru, `JumpToPageDialog.tsx`.
  3.  **Fungsionalitas:** Dialog berisi input nomor halaman (1-604) yang akan memperbarui state `currentPageNumber` saat dikonfirmasi.

### c. Interaksi per Ayat (Aksi & Terjemahan)
- **Tujuan:** Memungkinkan pengguna melihat terjemahan dan melakukan aksi pada ayat tertentu tanpa meninggalkan halaman.
- **Implementasi:**
  1.  **Trigger:** Setiap teks ayat dalam mode halaman akan dibungkus dalam elemen yang bisa ditekan (misalnya, `<span>`).
  2.  **Komponen `Sheet`:** Buat komponen baru `VerseActionSheet.tsx`.
  3.  **Logika:**
      - Saat sebuah ayat ditekan, panggil `setSelectedVerse(verse)` dan buka `VerseActionSheet`.
      - **Isi Sheet:** Panel ini akan menampilkan:
          - Informasi Surah dan nomor ayat.
          - Teks Arab ayat tersebut.
          - Teks terjemahan bahasa Indonesia.
          - **Tombol Aksi:** Tombol untuk "Putar Audio Ayat", "Bookmark", "Salin", dan "Bagikan".
  4.  **State Management:** Di `QuranPageView.tsx`, kelola state untuk `selectedVerse` dan `isVerseSheetOpen`.

### d. Fungsionalitas Audio
- **Tujuan:** Memutar audio untuk seluruh halaman secara berurutan dan menyorot ayat yang sedang dibaca.
- **Implementasi:**
  1.  **Tombol Aksi Halaman:** Tambahkan tombol "Putar Audio Halaman" di header atau sebagai tombol aksi mengambang (FAB).
  2.  **Integrasi `useAudioStore`:**
      - Saat tombol ditekan, kumpulkan semua objek ayat dari halaman saat ini ke dalam sebuah antrian (array).
      - Panggil sebuah *action* dari *store* Zustand, misalnya `playQueue(verseQueue)`.
      - *Store* akan menangani pemutaran ayat pertama, dan menggunakan *event* `onEnded` untuk melanjutkan ke ayat berikutnya secara otomatis hingga antrian selesai.
  3.  **Highlight Ayat Aktif:**
      - Setiap elemen ayat yang bisa ditekan harus memiliki `id` atau `data-key` yang unik.
      - Gunakan `useEffect` di `QuranPageView.tsx` yang memantau `currentPlayingVerse` dari `useAudioStore`.
      - Ketika `currentPlayingVerse` berubah, tambahkan *styling* (misalnya, warna latar atau garis bawah) ke elemen ayat yang sesuai.

### e. Fitur Terjemahan Satu Halaman (Tampilan Alternatif)
- **Tujuan:** Memberikan opsi untuk melihat semua terjemahan dalam satu tampilan daftar.
- **Implementasi:**
  1.  **UI:** Tambahkan tombol "Lihat Daftar Terjemahan" di menu halaman.
  2.  **Logika:** Saat diklik, buka `Sheet` atau `Dialog` yang menampilkan daftar terjemahan (bukan mengganti tampilan utama) untuk semua ayat di halaman tersebut. Ini lebih baik daripada mengubah layout utama.

### f. [Global] Garis Pemisah Ayat
- **Tujuan:** Menambahkan pemisah visual untuk meningkatkan keterbacaan.
- **Implementasi:** Tambahkan `<Separator />` atau `border-b` di bagian bawah `VerseCard.tsx` (untuk mode Surah/Juz) dan di antara baris-baris pada mode Halaman.

## 3. Langkah-langkah Pengerjaan

1.  **[Global UI]** Implementasikan **Garis Pemisah** di `VerseCard.tsx`.
2.  **[Mode Halaman - UI]** Implementasikan **Header & Footer Halaman** (Info Surah & Nomor Halaman Kaligrafi).
3.  **[Mode Halaman - Komponen]** Buat kerangka komponen **`VerseActionSheet.tsx`** untuk menampilkan detail dan aksi per ayat.
4.  **[Mode Halaman - Interaksi]** Buat teks ayat di `QuranPageView.tsx` dapat ditekan dan hubungkan dengan `VerseActionSheet`.
5.  **[Mode Halaman - Audio]** Implementasikan tombol **"Putar Audio Halaman"** dan integrasikan dengan `useAudioStore` untuk pemutaran berurutan.
6.  **[Mode Halaman - Audio]** Implementasikan logika untuk **menyorot ayat** yang audionya sedang diputar.
7.  **[Mode Halaman - Fitur]** Implementasikan dialog **"Lompat ke Halaman"**.
8.  **[Mode Halaman - Fitur]** Implementasikan fitur **"Lihat Daftar Terjemahan"** menggunakan `Sheet` atau `Dialog`.
9.  **[Testing]** Lakukan pengujian menyeluruh untuk semua fungsionalitas: interaksi ayat, pemutaran audio & highlight, navigasi, dan semua tombol aksi.