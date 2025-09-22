# Rencana Fitur Jadwal Sholat & Notifikasi Adzan

## 1. Tujuan

Mengembangkan fitur jadwal sholat yang komprehensif dan terintegrasi penuh, yang tidak hanya menampilkan informasi waktu sholat tetapi juga secara proaktif mengingatkan pengguna melalui notifikasi adzan. Tujuannya adalah menjadikan aplikasi ini sebagai pendamping ibadah harian yang andal dan personal.

## 2. Rencana Implementasi Teknis

### a. Halaman Jadwal Sholat

- **Tujuan:** Membuat halaman khusus yang menampilkan jadwal sholat secara detail dan menarik secara visual.
- **Implementasi:**
  1.  **File & Routing:**
      - Buat halaman baru: `src/pages/PrayerTimesPage.tsx`.
      - Tambahkan rute baru `/prayer-times` di `App.tsx` yang mengarah ke halaman tersebut.
  2.  **Peningkatan `usePrayerTimes` Hook:**
      - **Manajemen Lokasi:** Hook harus mengelola state lokasi (kota & negara), menyimpannya ke `localStorage` untuk persistensi, dan menggunakannya untuk panggilan API.
      - **Deteksi Lokasi Otomatis:** Saat pertama kali digunakan dan tidak ada lokasi di `localStorage`, gunakan `navigator.geolocation.getCurrentPosition()` untuk mendapatkan lokasi pengguna.
      - **Dukungan Tanggal Dinamis:** Hook harus menerima argumen `date` dan memasukkannya ke dalam panggilan API (misalnya, `&date=22-09-2025`).
      - **Caching:** Simpan hasil API terakhir di `localStorage` dengan kunci yang menyertakan tanggal dan lokasi (misalnya, `prayer-times-2025-09-22-Jakarta`).
  3.  **Desain UI Halaman:**
      - **Header Informasi Dinamis:** Buat sebuah komponen header yang menonjol di bagian atas halaman, yang berisi:
          - **Jam Digital Live:** Tampilkan waktu saat ini yang diperbarui setiap detik (misalnya, `14:30:55`).
          - **Tanggal Ganda:** Tampilkan tanggal hari ini dalam format Masehi dan Hijriah secara berdampingan (misalnya, "Senin, 22 September 2025 / 29 Safar 1447 H").
          - **Tampilan Lokasi:** Tampilkan lokasi yang sedang aktif (misalnya, "Jakarta, Indonesia") dan sediakan ikon/tombol untuk mengubahnya.
          - **Hitung Mundur Waktu Sholat Berikutnya:** Tampilkan nama waktu sholat berikutnya dan hitung mundur yang diperbarui setiap detik (misalnya, "Menuju Ashar dalam 01:29:15"). Logika ini hanya aktif jika tanggal yang dipilih adalah hari ini.
      - **Kartu Waktu Sholat Utama:** Tampilkan jadwal sholat untuk tanggal dan lokasi yang dipilih (Imsak, Subuh, Dzuhur, Ashar, Maghrib, Isya).
      - **Dekorasi Islami:** Tambahkan elemen visual seperti pola geometris Islam sebagai latar belakang halaman atau di dalam kartu.

### b. Integrasi Kalender Hijriah Interaktif

- **Tujuan:** Memungkinkan pengguna melihat jadwal sholat untuk tanggal lain.
- **Implementasi:**
  1.  **State Management:** Di `PrayerTimesPage.tsx`, kelola state untuk tanggal yang dipilih: `const [selectedDate, setSelectedDate] = useState(new Date());`.
  2.  **Komponen Kalender:** Integrasikan komponen `<Calendar>` dari `src/components/ui/calendar.tsx` di halaman tersebut.
  3.  **Logika Pembaruan:** Setiap kali `selectedDate` berubah, panggil fungsi `refetch` dari `usePrayerTimes` dengan tanggal yang baru untuk memperbarui jadwal sholat.

### c. Dialog Pemilihan Lokasi

- **Tujuan:** Menyediakan antarmuka bagi pengguna untuk mengubah lokasi jadwal sholat secara manual.
- **Implementasi:**
  1.  **Komponen Dialog:** Buat komponen `Dialog` baru yang muncul saat tombol ubah lokasi di header diklik.
  2.  **Input:** Di dalam dialog, sediakan dua `Input` field: satu untuk "Kota" dan satu untuk "Negara".
  3.  **Logika:** Saat pengguna menekan tombol "Simpan", perbarui state lokasi di `usePrayerTimes` dan simpan ke `localStorage`. Ini akan secara otomatis memicu pengambilan data baru.

### d. Fitur Notifikasi Adzan

- **Tujuan:** Mengirimkan notifikasi *push* dan memutar audio adzan saat waktu sholat tiba.
- **Implementasi:**
  1.  **Izin Notifikasi:** Saat pengguna pertama kali mengaktifkan fitur ini di Pengaturan, panggil `Notification.requestPermission()` untuk meminta izin dari browser.
  2.  **Audio Adzan:**
      - Buat direktori baru `public/audio/`.
      - Siapkan file audio adzan:
        - Adzan Umum: `Adzan Mekkah Versi 1 Full.mp3`
        - Adzan Subuh Opsi 1: `Adzan Subuh Madinah.mp3`
        - Adzan Subuh Opsi 2: `Adzan Subuh Merdu.mp3`
  3.  **Logika Notifikasi (`useAdhanNotifications` Hook):**
      - Buat *custom hook* baru, misal `useAdhanNotifications.ts`.
      - Di dalam *hook* ini, gunakan `setInterval` yang berjalan setiap detik untuk memeriksa waktu saat ini.
      - Bandingkan waktu saat ini dengan jadwal sholat untuk **hari ini**.
      - Jika waktu saat ini cocok dengan waktu sholat **DAN** notifikasi untuk waktu tersebut belum dikirim hari ini, **DAN** fitur diaktifkan di pengaturan:
        1.  Pilih file audio yang benar berdasarkan waktu sholat (gunakan adzan Subuh pilihan pengguna untuk sholat Subuh, dan adzan umum untuk lainnya).
        2.  Buat objek `new Audio()` dengan path ke file adzan yang sesuai dan panggil `.play()`.
        3.  Tampilkan notifikasi *push*.
  4.  **Integrasi Global:** Panggil *hook* `useAdhanNotifications` ini di komponen layout utama (`MobileLayout.tsx`) agar logikanya berjalan terus di seluruh aplikasi.

### e. Integrasi Pengaturan

- **Tujuan:** Memberikan pengguna kontrol penuh untuk mengaktifkan/menonaktifkan notifikasi adzan.
- **Implementasi:**
  1.  **Penambahan State Pengaturan:**
      - **File:** `src/hooks/useReadingPreferences.ts`.
      - **Tindakan:** Tambahkan objek baru ke dalam *interface* `ReadingPreferences`:
        ```typescript
        prayerNotifications: {
          isEnabled: boolean; // Master switch
          fajr: boolean;
          dhuhr: boolean;
          asr: boolean;
          maghrib: boolean;
          isha: boolean;
          disableDhuhrOnFridays: boolean; // Opsi untuk sholat Jumat
          fajrAdhan: 'madinah' | 'merdu'; // Pilihan adzan subuh
        };
        ```
      - Perbarui `DEFAULT_PREFERENCES` dengan nilai *default*.
  2.  **UI di `SettingsSheet.tsx`:**
      - Tambahkan `Card` baru dengan judul "Notifikasi Waktu Sholat".
      - **Master Switch:** Tambahkan `Switch` utama "Aktifkan Notifikasi Adzan".
      - **Kontrol Individual:** Buat daftar `Checkbox` atau `Switch` untuk setiap waktu sholat.
      - **Opsi Dzuhur Jumat:** Tambahkan `Checkbox` "Nonaktifkan Adzan Dzuhur di hari Jumat".
      - **Pilihan Adzan Subuh:** Tambahkan `RadioGroup` dengan label "Pilih Adzan Subuh" dan opsi "Madinah" & "Merdu". Ini hanya terlihat jika notifikasi Subuh aktif.

## 3. Langkah-langkah Pengerjaan

1.  **[State]** Modifikasi `useReadingPreferences.ts` untuk menambahkan struktur state `prayerNotifications`.
2.  **[UI Pengaturan]** Implementasikan UI di `SettingsSheet.tsx` untuk semua kontrol notifikasi.
3.  **[Halaman & Rute]** Buat file `src/pages/PrayerTimesPage.tsx` dan daftarkan rutenya di `App.tsx`.
4.  **[Data]** Tingkatkan *hook* `usePrayerTimes` untuk mengelola state lokasi (kota/negara) yang persisten, menerima argumen `date`, dan menangani deteksi lokasi serta caching.
5.  **[UI Halaman]** Bangun UI untuk `PrayerTimesPage.tsx`, termasuk header dinamis dengan tampilan lokasi dan tombol ubah.
6.  **[UI Dialog]** Buat komponen `Dialog` untuk pemilihan lokasi manual (kota dan negara).
7.  **[UI Interaktif]** Integrasikan komponen `<Calendar>` di `PrayerTimesPage.tsx` dan pastikan jadwal sholat diperbarui saat tanggal diubah.
8.  **[Aset]** Tambahkan file audio `adzan.mp3` dan `adzan-subuh.mp3` ke dalam direktori `public/audio/`.
9.  **[Logika Inti]** Buat *hook* `useAdhanNotifications.ts` yang berisi logika `setInterval` untuk memeriksa waktu, memutar audio, dan menampilkan notifikasi.
10. **[Integrasi]** Panggil `useAdhanNotifications` di `MobileLayout.tsx` untuk mengaktifkan fitur notifikasi secara global.
11. **[Pengujian]** Lakukan pengujian menyeluruh untuk semua fitur baru: perubahan lokasi, perubahan tanggal, dan fungsionalitas notifikasi.
