# Rencana Fitur Audio Lanjutan (dengan Zustand)

## 1. Tujuan

Mengembangkan pemutar audio yang canggih, persisten, dan cerdas yang memungkinkan pengguna mendengarkan Al-Qur'an tanpa gangguan, baik saat menavigasi aplikasi maupun setelah menyelesaikan satu surat.

## 2. Rencana Implementasi Teknis

### a. Pemutar Audio Global (Global Audio Player) dengan Zustand

- **Masalah:** Audio berhenti saat pengguna meninggalkan halaman `SurahDetail`.
- **Solusi:**
  1.  **Global State (Zustand):** Buat sebuah *Zustand store* (misalnya, `useAudioStore.ts`) untuk mengelola semua state audio secara global.
      - **State:** `currentSurah`, `currentVerse`, `isPlaying`, `qari`, `isContinuousPlayEnabled`, `isShuffleEnabled`, dll.
      - **Actions:** `setSurah`, `play`, `pause`, `playNext`, `playPrevious`, `toggleContinuousPlay`, `setQari`, dll.
  2.  **Komponen Player Persisten:** Pindahkan komponen `<audio>` dan UI pemutar (`StickyAudioPlayer`) ke layout utama aplikasi (`MobileLayout.tsx`). Komponen ini akan selalu ada tetapi hanya terlihat jika `currentVerse` di dalam `useAudioStore` tidak null.
  3.  **Interaksi Lintas Halaman:** Komponen di seluruh aplikasi dapat menggunakan hook `useAudioStore()` untuk mengakses state (misalnya, `isPlaying`) dan memanggil actions (misalnya, `play(surah, verse)`). UI pemutar akan tetap sinkron dan audio terus berjalan saat pengguna bernavigasi.

### b. Pemutaran Berkelanjutan (Continuous Play)

- **Tujuan:** Audio otomatis lanjut ke surat berikutnya setelah surat saat ini selesai.
- **Implementasi:**
  1.  **State Pengaturan:** Gunakan state `isContinuousPlayEnabled` (boolean) di dalam `useAudioStore`.
  2.  **Logika `onEnded`:** Di dalam *event handler* `onEnded` pada elemen `<audio>`, panggil sebuah *action* dari store, misalnya `handleTrackEnd()`.
  3.  **Aksi Lanjutan:** Di dalam *action* `handleTrackEnd()`, implementasikan logika:
      - Periksa apakah ini adalah ayat terakhir dari surat.
      - Periksa apakah `isContinuousPlayEnabled` aktif.
      - Jika ya, tentukan surat berikutnya (berdasarkan mode shuffle atau tidak) dan panggil *action* lain untuk memuat dan memutar surat tersebut.

### c. Pemutaran Acak (Shuffle Mode)

- **Tujuan:** Memutar surat secara acak setelah surat saat ini selesai.
- **Implementasi:**
  1.  **State Pengaturan:** Gunakan state `isShuffleEnabled` (boolean) di dalam `useAudioStore`.
  2.  **Logika `onEnded` Lanjutan:** *Action* `handleTrackEnd()` akan memeriksa state `isShuffleEnabled`. Jika aktif, ia akan menghasilkan nomor surat acak (1-114) sebagai `nextSurahNumber`, alih-alih hanya menambah nomor surat saat ini.

### d. Integrasi Basmalah

- **Tujuan:** Memutar audio Basmalah sebelum ayat pertama setiap surat (kecuali At-Tawbah).
- **Implementasi:**
  1.  **Logika di dalam Action:** Logika ini harus menjadi bagian dari *action* yang memulai pemutaran sebuah surat (misalnya, `playNewSurah(surahNumber)`).
  2.  **Alur Pemutaran:**
      - Di dalam `playNewSurah`, periksa apakah `surahNumber !== 9`.
      - Jika ya, ambil URL audio Basmalah dari data surat.
      - Set state untuk memutar audio Basmalah terlebih dahulu.
      - Gunakan *event* `onEnded` dari audio Basmalah untuk secara otomatis memanggil *action* yang sama untuk memutar ayat pertama dari surat target.

### e. Navigasi Cerdas (Smart Navigation)

- **Tujuan:** Tombol "Next" dan "Previous" pada pemutar menjadi lebih cerdas di awal/akhir surat.
- **Implementasi:**
  1.  **Logika Tombol:** Tombol "Next" dan "Previous" di `StickyAudioPlayer` akan memanggil *actions* `playNext()` dan `playPrevious()` dari `useAudioStore`.
  2.  **Logika di dalam Actions:**
      - `playNext()`: Jika ayat saat ini adalah yang terakhir, *action* ini akan secara otomatis memicu pemutaran surat berikutnya (sesuai pengaturan `continuous` dan `shuffle`).
      - `playPrevious()`: Jika ayat saat ini adalah yang pertama, *action* ini akan memutar ayat terakhir dari surat sebelumnya.
  3.  **Sinkronisasi Halaman:** Untuk menavigasi halaman saat surat berubah, komponen `StickyAudioPlayer` dapat menggunakan `useEffect` untuk memantau perubahan `currentSurah` di store. Ketika berubah, komponen dapat memanggil `navigate()` dari `react-router-dom` untuk pindah ke halaman `SurahDetail` yang sesuai.

## 3. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Refaktor besar: Buat *store* Zustand (`useAudioStore`) dan pindahkan `StickyAudioPlayer` ke layout utama untuk menciptakan **Pemutar Audio Global**.
2.  **[Prioritas Sedang]** Implementasikan state dan *actions* di `useAudioStore` untuk **Pemutaran Berkelanjutan** dan **Pemutaran Acak**.
3.  **[Prioritas Sedang]** Tambahkan logika untuk memutar **Basmalah** di dalam *action* yang relevan di store.
4.  **[Prioritas Rendah]** Sempurnakan *actions* `playNext()` dan `playPrevious()` untuk **Navigasi Cerdas** antar surat.
5.  **[Prioritas Rendah]** Implementasikan sinkronisasi navigasi halaman saat surat berganti secara otomatis.
6.  **[Testing]** Uji semua skenario: putar-berhenti, lanjut ke surat berikutnya, shuffle, navigasi cerdas, dan pemutaran basmalah.

