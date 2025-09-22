# Rencana Opsi Tampilan Tombol Aksi Ayat

## 1. Latar Belakang

Berdasarkan umpan balik pengguna, implementasi menu konteks yang dipicu oleh "tekan lama" (_long press_) pada `VerseCard` tidak berfungsi sesuai harapan dan malah menghilangkan kemampuan untuk berinteraksi dengan ayat.

Rencana ini bertujuan untuk:

1.  Mengembalikan fungsionalitas dengan memulihkan tombol-tombol aksi (Play, Bookmark, Share, dll) yang terlihat secara langsung di setiap `VerseCard`.
2.  Memberikan fleksibilitas kepada pengguna dengan menambahkan opsi di menu Pengaturan untuk menampilkan atau menyembunyikan tombol-tombol aksi tersebut.

## 2. Rencana Implementasi Teknis

### a. Penambahan State Pengaturan

- **File yang Dimodifikasi:** `src/hooks/useReadingPreferences.ts`
- **Tindakan:**
  - Tambahkan properti baru ke dalam _interface_ `ReadingPreferences`: `showVerseActionButtons: boolean;`.
  - Perbarui objek `DEFAULT_PREFERENCES` dengan nilai _default_: `showVerseActionButtons: true`.

### b. UI di Halaman Pengaturan

- **File yang Dimodifikasi:** `src/components/settings/SettingsSheet.tsx`
- **Tindakan:**
  - Di dalam grup pengaturan "Tampilan" atau "Bacaan", tambahkan satu item baru.
  - Item ini akan berisi label "Tampilkan Tombol Aksi Ayat" dan sebuah komponen `Switch`.
  - Hubungkan nilai `Switch` ini ke `preferences.showVerseActionButtons` dan _handler_ `updatePreferences` dari _hook_ `useReadingPreferences`.

### c. Logika Rendering Kondisional di `VerseCard`

- **File yang Dimodifikasi:** `src/components/quran/VerseCard.tsx`
- **Tindakan:**

  - Di dalam komponen `VerseCard`, panggil _hook_ `useReadingPreferences` untuk mendapatkan nilai `preferences.showVerseActionButtons`.
  - Gunakan rendering kondisional (operator ternary atau `if/else`) untuk menampilkan salah satu dari dua struktur JSX yang berbeda untuk bagian atas kartu:

  - **JIKA `showVerseActionButtons` adalah `true`:**

    - Render struktur "klasik": sebuah `div` dengan `flex` yang berisi nomor ayat di kiri dan barisan tombol-tombol aksi (`Play`, `Bookmark`, `Share`, dll.) di kanan. Teks Arab akan berada di `div` terpisah di bawahnya.

  - **JIKA `showVerseActionButtons` adalah `false`:**
    - Render struktur "bersih" yang sudah diimplementasikan sebelumnya: sebuah `div` dengan `flex flex-row-reverse` yang hanya berisi nomor ayat dan teks Arab yang berdampingan. Tidak ada tombol aksi yang dirender.

## 3. Langkah-langkah Pengerjaan

1.  Buat _branch_ Git baru dari `main` dengan nama `feature/toggle-verse-actions`.
2.  Implementasikan perubahan pada `useReadingPreferences.ts` untuk menambahkan state `showVerseActionButtons`.
3.  Modifikasi `SettingsSheet.tsx` untuk menambahkan `Switch` kontrol yang sesuai.
4.  Lakukan refaktor besar pada `VerseCard.tsx` untuk mengembalikan kode JSX untuk tombol-tombol aksi dan membungkus kedua varian layout (dengan dan tanpa tombol) dalam logika kondisional.
5.  Hapus semua sisa kode yang terkait dengan implementasi `DropdownMenu` yang gagal (termasuk `onContextMenu` dan state `isMenuOpen`).
6.  Lakukan pengujian fungsional:
    - Pastikan tombol aksi muncul secara _default_.
    - Masuk ke Pengaturan, matikan `Switch`, dan pastikan tombol aksi hilang dan layout berubah menjadi bersih.
    - Nyalakan kembali `Switch` dan pastikan tombol aksi muncul kembali.
7.  Jalankan `npm run build` untuk memastikan tidak ada _error_ kompilasi.
8.  Setelah semua terverifikasi, ajukan untuk digabungkan kembali ke `main`.
