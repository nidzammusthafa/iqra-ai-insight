# Rencana Perbaikan Bug Navigasi Hasil Pencarian

## 1. Latar Belakang

Pengguna melaporkan bahwa setelah melakukan pencarian ayat dan mengklik salah satu hasil, mereka diarahkan ke URL yang tidak valid, yaitu `/surah/undefined#verse-123`. Ini menyebabkan halaman error atau halaman yang tidak diharapkan.

## 2. Analisis Bug

### a. Penyebab

Bug ini berasal dari *event handler* `onClick` pada komponen `SearchPage.tsx`. Saat memanggil fungsi `handleVerseClick(surahNumber, verseNumber)`, argumen `surahNumber` yang diteruskan bernilai `undefined`.

Kode saat ini memanggilnya dengan `handleVerseClick(result.number, verse.number)`. Ini mengasumsikan bahwa objek `result` (yang merupakan satu item dari hasil pencarian) memiliki properti `number` di tingkat atas yang berisi nomor surah. 

Berdasarkan masalah yang terjadi, asumsi ini salah. Struktur data yang dikembalikan oleh API pencarian ayat kemungkinan berbeda. Nomor surah kemungkinan besar adalah properti dari objek lain, seperti `result.surah.number` atau `verse.surah.number`.

### b. Rencana Implementasi Perbaikan

Solusinya adalah menemukan properti yang benar untuk nomor surah dalam objek hasil pencarian dan menggunakannya.

- **File yang Dimodifikasi:** `src/pages/SearchPage.tsx`
- **Tindakan yang Diperlukan:**
  1.  Lakukan investigasi pada struktur data objek `result` yang dikembalikan oleh `quranApi.searchVerses`.
  2.  Setelah properti yang benar untuk nomor surah ditemukan (misalnya, `result.surahNumber` atau `result.surah.number`), perbarui panggilan fungsi di dalam `onClick`.
  3.  Ubah panggilan dari `handleVerseClick(result.number, verse.number)` menjadi `handleVerseClick(result.PROPERTY_YANG_BENAR, verse.number)`.

## 3. Langkah-langkah Pengerjaan

1.  Buat *branch* Git baru dari `main` dengan nama `fix/search-result-navigation`.
2.  Buka file `src/pages/SearchPage.tsx`.
3.  Periksa kembali logika `quranApi.searchVerses` atau lakukan `console.log` pada objek `result` untuk memastikan struktur datanya.
4.  Perbaiki argumen yang salah pada pemanggilan fungsi `handleVerseClick`.
5.  Jalankan `npm run build` untuk memverifikasi perbaikan.
6.  Setelah terverifikasi, gabungkan *branch* perbaikan kembali ke `main`.
