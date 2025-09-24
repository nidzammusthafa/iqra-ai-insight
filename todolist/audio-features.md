# Rencana Fitur Audio Lanjutan

## 1. Tujuan

Mengembangkan pemutar audio yang canggih, persisten, dan cerdas yang memungkinkan pengguna mendengarkan Al-Qur'an tanpa gangguan, baik saat menavigasi aplikasi maupun setelah menyelesaikan satu surat.

## 2. Rencana Implementasi Teknis

### a. Pemutar Audio Global (Global Audio Player)

- **Masalah:** Audio berhenti saat pengguna meninggalkan halaman `SurahDetail`.
- **Solusi:**
  1.  **Global State:** Buat sebuah *React Context* (misalnya, `AudioProvider`) yang akan mengelola state audio di seluruh aplikasi. State ini mencakup: `currentSurah`, `currentVerse`, `isPlaying`, `qari`, dll.
  2.  **Komponen Player Persisten:** Pindahkan komponen `<audio>` dan UI pemutar (misalnya, `StickyAudioPlayer`) ke layout utama aplikasi (misalnya, `MobileLayout.tsx`). Komponen ini akan selalu ada tetapi hanya terlihat jika `currentVerse` tidak null.
  3.  **Interaksi Lintas Halaman:** Saat pengguna bernavigasi (misalnya, kembali ke `QuranHome` atau pindah ke `HaditsHome`), UI pemutar tetap terlihat dan audio terus berjalan.

### b. Pemutaran Berkelanjutan (Continuous Play)

- **Tujuan:** Audio otomatis lanjut ke surat berikutnya setelah surat saat ini selesai.
- **Implementasi:**
  1.  **State Pengaturan:** Tambahkan opsi `enableContinuousPlay` (boolean) di `useReadingPreferences`.
  2.  **Logika `onEnded`:** Di dalam *event handler* `onEnded` pada elemen `<audio>`, periksa:
      - Apakah ini adalah ayat terakhir dari surat?
      - Apakah `enableContinuousPlay` aktif?
  3.  **Aksi Lanjutan:** Jika kedua kondisi benar, secara otomatis:
      - Tentukan `nextSurahNumber`.
      - Panggil fungsi untuk memuat data surat berikutnya.
      - Mulai putar ayat pertama dari surat berikutnya.

### c. Pemutaran Acak (Shuffle Mode)

- **Tujuan:** Memutar surat secara acak setelah surat saat ini selesai.
- **Implementasi:**
  1.  **State Pengaturan:** Tambahkan opsi `enableShufflePlay` (boolean) di `useReadingPreferences`.
  2.  **Logika `onEnded` Lanjutan:** Jika `enableContinuousPlay` dan `enableShufflePlay` aktif, alih-alih `nextSurahNumber = currentSurah + 1`, hasilkan nomor surat acak antara 1 dan 114. Pastikan tidak mengulang surat yang sama secara langsung.

### d. Integrasi Basmalah

- **Tujuan:** Memutar audio Basmalah sebelum ayat pertama setiap surat (kecuali At-Tawbah).
- **Implementasi:**
  1.  **Pengecekan Surat:** Saat memulai pemutaran surat baru, periksa apakah `surah.number !== 9`.
  2.  **API Data:** Manfaatkan objek `bismillah` yang tersedia di endpoint detail surat dari API, yang berisi URL audio khusus untuk Basmalah.
  3.  **Alur Pemutaran:**
      - Putar audio dari `surah.bismillah.audio.alafasy`.
      - Setelah audio Basmalah selesai (`onEnded`), secara otomatis mulai putar audio untuk ayat pertama (`surah.ayahs[0]`).

### e. Navigasi Cerdas (Smart Navigation)

- **Tujuan:** Tombol "Next" dan "Previous" pada pemutar menjadi lebih cerdas di awal/akhir surat.
- **Implementasi:**
  1.  **Logika Tombol Next:** Jika pengguna berada di ayat terakhir sebuah surat, fungsi `handleNext` seharusnya memicu pemutaran surat berikutnya (baik berurutan maupun acak, tergantung pengaturan).
  2.  **Logika Tombol Previous:** Jika pengguna berada di ayat pertama, fungsi `handlePrevious` seharusnya memutar kembali ayat terakhir dari surat sebelumnya.
  3.  **Sinkronisasi Halaman:** Saat pemutaran berpindah ke surat baru, aplikasi harus secara otomatis menavigasi pengguna ke halaman `SurahDetail` untuk surat tersebut dan melakukan scroll ke atas.

## 3. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Refaktor besar: Buat `AudioProvider` dan pindahkan `StickyAudioPlayer` ke layout utama untuk menciptakan **Pemutar Audio Global**.
2.  **[Prioritas Sedang]** Tambahkan state dan logika untuk **Pemutaran Berkelanjutan** (lanjut ke surat berikutnya).
3.  **[Prioritas Sedang]** Implementasikan logika untuk memutar **Basmalah** sebelum memulai surat baru.
4.  **[Prioritas Rendah]** Tambahkan state dan logika untuk mode **Pemutaran Acak (Shuffle)**.
5.  **[Prioritas Rendah]** Tingkatkan logika tombol "Next/Previous" untuk **Navigasi Cerdas** antar surat.
6.  **[Testing]** Uji semua skenario: putar-berhenti, lanjut ke surat berikutnya, shuffle, navigasi, dan pemutaran basmalah.
