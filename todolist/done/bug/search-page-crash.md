# Rencana Perbaikan Bug Crash pada Halaman Pencarian

## 1. Latar Belakang

Pengguna melaporkan adanya *crash* (error) saat membuka atau berinteraksi dengan halaman pencarian (`SearchPage.tsx`). Jejak error menunjukkan `TypeError: Cannot read properties of undefined (reading 'toString')` pada baris 203, yang menghentikan rendering komponen.

## 2. Analisis Bug

### a. Penyebab

Error ini terjadi saat komponen mencoba merender daftar surah untuk filter pencarian lanjutan. Kode yang ada saat ini mencoba mengakses properti `surah.number_of_surah` dari setiap objek dalam array `allSurahs`.

Namun, struktur data yang dikembalikan oleh API `quranApi.getAllSurats()` telah diperbarui. Objek surah sekarang tidak lagi memiliki properti `number_of_surah`, melainkan properti `number` untuk menyimpan nomor surah.

Ketika kode mencoba menjalankan `surah.number_of_surah.toString()`, ia sebenarnya mencoba menjalankan `undefined.toString()`, yang menyebabkan aplikasi *crash*.

### b. Rencana Implementasi Perbaikan

Solusinya adalah dengan menyesuaikan kode di `SearchPage.tsx` agar menggunakan nama properti yang benar sesuai dengan struktur data yang baru.

- **File yang Dimodifikasi:** `src/pages/SearchPage.tsx`
- **Lokasi Kode:** Di dalam blok JSX, pada bagian `.map()` yang merender `<SelectItem>` untuk filter surah.
- **Tindakan yang Diperlukan:**
  1.  Ubah `key={surah.number_of_surah}` menjadi `key={surah.number}`.
  2.  Ubah `value={surah.number_of_surah.toString()}` menjadi `value={surah.number.toString()}`.

## 3. Langkah-langkah Pengerjaan

1.  Buat *branch* Git baru dari `main` dengan nama `fix/search-page-crash`.
2.  Buka file `src/pages/SearchPage.tsx`.
3.  Terapkan perubahan kode seperti yang dijelaskan di atas untuk menggunakan `surah.number`.
4.  Jalankan perintah `npm run build` untuk memverifikasi bahwa perbaikan telah berhasil dan tidak menimbulkan *error* baru.
5.  Setelah terverifikasi, gabungkan *branch* perbaikan kembali ke `main` dan lakukan *push*.
