# Rencana Fitur Autoplay Audio per Ayat

## 1. Tujuan

Memungkinkan pengguna untuk mendengarkan bacaan Al-Quran secara otomatis, di mana audio akan berlanjut dari satu ayat ke ayat berikutnya dalam surah yang sama, dengan kontrol dan kustomisasi yang lebih baik.

## 2. Lingkup Fitur (MVP)

- **Pengaturan Autoplay di Halaman Settings:**
  - Menambahkan toggle `Switch` di halaman `SettingsPage` untuk mengaktifkan/menonaktifkan mode autoplay secara global.
  - Menambahkan komponen `Slider` untuk mengatur jeda waktu (misalnya, 0-5 detik) antara pemutaran satu ayat ke ayat berikutnya.
- **Komponen Audio Player Sticky:**
  - Membuat komponen `StickyAudioPlayer` yang akan muncul di halaman `SurahDetail` (menempel di atas navigasi bawah) ketika sebuah ayat sedang diputar.
  - Komponen ini akan menampilkan informasi surah & ayat yang sedang diputar, serta tombol kontrol (Play/Pause, Next, Previous).
- **Pemutaran Berurutan dengan Jeda:** Ketika autoplay aktif, audio untuk ayat berikutnya akan dimulai secara otomatis setelah jeda waktu yang ditentukan pengguna.
- **Highlight Ayat Aktif:** Memberikan indikator visual pada `VerseCard` yang audionya sedang diputar.
- **Auto-scroll:** Halaman akan otomatis scroll untuk menjaga agar ayat yang sedang diputar tetap terlihat.
- **Berhenti di Akhir Surah:** Autoplay akan berhenti setelah ayat terakhir dari surah selesai diputar.

## 3. Rencana Implementasi Teknis

### a. State Management (Global)

- **Modifikasi `useReadingPreferences.ts`:**
  - Tambahkan state baru ke dalam `ReadingPreferences` dan `DEFAULT_PREFERENCES`:
    - `isAutoplayEnabled` (boolean, default: `false`)
    - `autoplayDelay` (number, default: `2` detik)
  - Pastikan state ini disimpan dan diambil dari `localStorage` bersama dengan preferensi lainnya.

### b. Komponen UI

1.  **Modifikasi `SettingsPage.tsx`:**
    - Tambahkan `Card` baru atau seksi "Preferensi Audio".
    - Di dalamnya, tambahkan komponen `Switch` yang terhubung ke `preferences.isAutoplayEnabled` dari `useReadingPreferences`.
    - Tambahkan komponen `Slider` yang terhubung ke `preferences.autoplayDelay`. Tampilkan nilai detik yang dipilih.

2.  **Komponen Baru `StickyAudioPlayer.tsx`:**
    - Komponen ini menerima props seperti `currentVerse`, `surahName`, `isPlaying`, dan fungsi-fungsi untuk kontrol (handlePlayPause, handleNext, handlePrev).
    - Render sebuah `div` dengan `position: fixed`, `bottom: 4.5rem` (atau tinggi navigasi bawah), `left: 0`, `right: 0`.
    - Gunakan `z-index` yang sesuai agar muncul di atas konten lain.
    - Tampilkan judul surah/ayat dan tombol-tombol kontrol.
    - Komponen ini akan dirender secara kondisional di `SurahDetail.tsx` atau `MobileLayout.tsx` hanya jika ada ayat yang aktif diputar.

3.  **Modifikasi `VerseCard.tsx`:**
    - Tetap sama: tambahkan prop `isPlaying: boolean` untuk styling kondisional dan `ref` untuk auto-scroll.

4.  **Modifikasi `SurahDetail.tsx`:**
    - Gunakan `useReadingPreferences` untuk mendapatkan `isAutoplayEnabled` dan `autoplayDelay`.
    - Kelola state lokal: `currentPlayingVerse` (number | null).
    - Render komponen `<StickyAudioPlayer>` secara kondisional.
    - Render satu elemen `<audio>` tersembunyi dengan `ref` (`audioRef`).

### c. Logika Autoplay

1.  **Event Handler `onEnded` pada `<audio>`:**
    - Ketika audio selesai, cek jika `isAutoplayEnabled` adalah `true`.
    - Jika ya, gunakan `setTimeout` dengan durasi `autoplayDelay * 1000` (dari `useReadingPreferences`).
    - Setelah timeout, panggil fungsi untuk memutar ayat berikutnya (`playNextVerse`).

2.  **Fungsi `playNextVerse`:**
    - Hitung `nextVerseNumber = currentPlayingVerse + 1`.
    - Pastikan tidak melebihi jumlah ayat.
    - Update state `setCurrentPlayingVerse(nextVerseNumber)`.

3.  **`useEffect` untuk Memutar Audio (di `SurahDetail.tsx`):**
    - `useEffect` yang bergantung pada `currentPlayingVerse`.
    - Ketika `currentPlayingVerse` berubah:
      - Dapatkan URL audio untuk ayat tersebut.
      - Set `audioRef.current.src` dan panggil `.play()`.
      - Lakukan auto-scroll ke `VerseCard` yang sesuai.

### d. Logika Auto-scroll

- Di dalam `useEffect` yang memutar audio, dapatkan DOM node dari `VerseCard` yang aktif dan panggil `node.scrollIntoView({ behavior: 'smooth', block: 'center' })`.

## 4. Langkah-langkah Pengerjaan

1.  **[State]** Modifikasi `useReadingPreferences.ts` untuk menambahkan `isAutoplayEnabled` dan `autoplayDelay`.
2.  **[UI]** Tambahkan `Switch` dan `Slider` untuk pengaturan autoplay di `SettingsPage.tsx`.
3.  **[UI]** Buat kerangka komponen `StickyAudioPlayer.tsx` (tanpa logika penuh).
4.  **[UI]** Modifikasi `VerseCard.tsx` untuk menerima prop `isPlaying` dan `ref`.
5.  **[Integrasi]** Di `SurahDetail.tsx`, ambil state dari `useReadingPreferences` dan kelola state `currentPlayingVerse`.
6.  **[Logika]** Implementasikan fungsi untuk memulai pemutaran saat tombol play di `VerseCard` di-klik (ini akan mengatur `currentPlayingVerse`).
7.  **[Logika]** Implementasikan `useEffect` di `SurahDetail.tsx` untuk memutar audio dan melakukan auto-scroll.
8.  **[Logika]** Implementasikan event handler `onEnded` pada elemen `<audio>` dengan `setTimeout` sesuai `autoplayDelay`.
9.  **[Integrasi]** Hubungkan `StickyAudioPlayer` dengan state dan fungsi-fungsi kontrol dari `SurahDetail.tsx`.
10. **[Styling]** Pastikan highlight pada `VerseCard` dan posisi `StickyAudioPlayer` sudah benar dan responsif.
11. **[Testing]** Uji coba fungsionalitas secara menyeluruh:
    - Pengaturan di halaman Settings (toggle dan slider) berfungsi dan tersimpan.
    - Player muncul dan hilang dengan benar.
    - Play/pause/next/prev pada sticky player berfungsi.
    - Autoplay berjalan dengan jeda yang sesuai.
    - Autoplay berhenti di akhir surah.
    - Auto-scroll berjalan mulus.
12. **[Penyelesaian]** Commit perubahan dan merge ke branch utama.