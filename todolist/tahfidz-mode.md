# Rencana Fitur Mode Tahfidz (Menghafal)

## 1. Tujuan

Menyediakan lingkungan belajar yang terfokus dan bebas gangguan untuk membantu pengguna dalam proses menghafal ayat-ayat Al-Qur'an. Fitur ini akan memberikan alat bantu seperti pengulangan audio dan mode tes.

## 2. Rencana Implementasi Teknis

### a. Halaman atau Mode Tahfidz

- **Akses:** Tambahkan tombol "Mode Tahfidz" di halaman `SurahDetail`.
- **UI:** Saat diaktifkan, UI akan berubah menjadi mode layar penuh yang minimalis, menyembunyikan semua elemen yang tidak perlu (header, footer, menu lain) dan hanya menampilkan area tahfidz.

### b. Komponen Area Tahfidz (`TahfidzWorkspace.tsx`)

- **Tujuan:** Komponen utama yang mengelola sesi menghafal.
- **Fitur Inti:**

  1.  **Pemilihan Rentang Ayat (Verse Range Selection):**
      - **UI:** Sediakan dua `Input` atau `Select` untuk pengguna memilih rentang ayat yang ingin dihafal (misalnya, dari ayat 5 sampai 10).

  2.  **Kontrol Pengulangan Audio (Audio Repetition Controls):**
      - **UI:** Sediakan beberapa kontrol:
        - `Input Number`: "Ulangi setiap ayat sebanyak [3] kali."
        - `Input Number`: "Ulangi seluruh rentang sebanyak [5] kali."
        - `Slider`: "Jeda antar ayat [2] detik."
      - **Logika:** Gunakan state management audio yang sudah ada, tetapi tambahkan logika pengulangan di atasnya. Setelah audio satu ayat selesai, periksa *counter* pengulangan sebelum melanjutkan ke ayat berikutnya atau mengulang ayat yang sama.

  3.  **Tampilan Ayat yang Difokuskan:**
      - Hanya tampilkan teks Arab dan terjemahan untuk ayat-ayat dalam rentang yang dipilih.
      - Ayat yang sedang diputar audionya akan diberi highlight yang jelas.

  4.  **Mode Ujian/Tes (Test Mode):**
      - **UI:** Sediakan sebuah `Switch` untuk mengaktifkan "Mode Ujian".
      - **Logika:**
        - **Sembunyikan Teks:** Saat mode ujian aktif, sembunyikan teks Arab dari ayat yang akan diputar. Tampilkan placeholder seperti `[...]`.
        - **Putar Audio:** Putar audio untuk ayat yang disembunyikan.
        - **Tampilkan Jawaban:** Setelah audio selesai, pengguna bisa menekan tombol "Tampilkan Teks" untuk memverifikasi hafalan mereka. Teks Arab kemudian akan muncul.

### c. Integrasi dengan State Management

- **Audio:** Fitur ini akan sangat bergantung pada `AudioProvider` global, tetapi akan menambahkan lapisan logika kontrolnya sendiri. Saat mode tahfidz aktif, ia akan "mengambil alih" antrian pemutaran audio.
- **Pengaturan:** Simpan konfigurasi terakhir pengguna (seperti jumlah pengulangan) di `localStorage` agar tidak perlu diatur ulang setiap kali.

## 3. Langkah-langkah Pengerjaan

1.  **[UI]** Tambahkan tombol "Mode Tahfidz" di `SurahDetail` untuk masuk ke mode ini.
2.  **[Komponen]** Buat kerangka komponen `TahfidzWorkspace.tsx`.
3.  **[Fitur]** Implementasikan fungsionalitas untuk memilih rentang ayat.
4.  **[Fitur]** Bangun logika dan UI untuk **Kontrol Pengulangan Audio**. Ini adalah inti dari fitur ini.
5.  **[UI]** Implementasikan tampilan yang hanya menampilkan ayat-ayat yang dipilih.
6.  **[Fitur Lanjutan]** Tambahkan **Mode Ujian** dengan fungsionalitas sembunyikan/tampilkan teks.
7.  **[Integrasi]** Pastikan komponen ini berinteraksi dengan benar dengan `AudioProvider` global.
8.  **[Testing]** Uji coba semua skenario pengulangan, jeda, dan mode ujian secara menyeluruh.
