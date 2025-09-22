# Rencana Integrasi Komponen dari Proyek Solat-o-matic

## 1. Tujuan

Mengakselerasi pengembangan dan secara signifikan meningkatkan kualitas fitur jadwal sholat dengan mengadopsi dan mengintegrasikan komponen, logika, dan desain yang lebih matang dari proyek `solat-omatic`. Tujuannya adalah untuk mengganti implementasi dasar yang ada dengan antarmuka yang kaya fitur, menarik secara visual, dan teruji.

## 2. Analisis Komponen & Logika `solat-omatic`

Proyek `solat-omatic` dibangun dengan tumpukan teknologi yang sangat mirip (Vite, React, TypeScript, shadcn/ui) dan berisi beberapa bagian penting yang akan kita migrasikan:

- **Sistem Desain & Styling:** Memiliki skema warna HSL yang terdefinisi dengan baik, gradien, dan bayangan kustom di `tailwind.config.ts` dan `src/index.css` yang memberikan nuansa Islami modern.
- **`usePrayerTimes` Hook:** Hook utama yang sangat komprehensif. Ini sudah menangani:
  - Deteksi lokasi via Geolocation.
  - Pengambilan nama kota (Reverse Geocoding).
  - Pembaruan waktu setiap detik.
  - Kalkulasi waktu sholat berikutnya (`isNext`), saat ini (`isCurrent`), dan yang sudah lewat (`isPast`).
  - Opsi untuk memilih zona waktu secara manual.
- **`usePrayerTimesByDate` Hook:** Hook terpisah yang lebih sederhana untuk mengambil jadwal sholat pada tanggal tertentu, digunakan oleh kalender.
- **Komponen UI:**
  - `PrayerTimes.tsx`: Komponen induk yang mengatur layout utama menggunakan `Tabs` untuk beralih antara tampilan "Hari Ini" dan "Kalender".
  - `CurrentTimeCard.tsx`: Kartu indah yang menampilkan jam digital live dan tanggal.
  - `PrayerCard.tsx`: Kartu individual untuk setiap waktu sholat dengan styling kondisional yang canggih (misalnya, efek `pulse` untuk sholat berikutnya).
  - `HijriCalendar.tsx` & `CalendarPrayerTimes.tsx`: Sistem kalender interaktif yang terintegrasi.
  - `ErrorCard.tsx` & `LoadingSpinner.tsx`: Komponen untuk menampilkan status UI.

## 3. Rencana Implementasi & Migrasi

Proses ini akan melibatkan transfer dan adaptasi aset dari `solat-omatic` ke proyek `quran`.

### a. Migrasi Styling & Tema

1.  **Salin Variabel CSS:** Ambil semua definisi variabel warna HSL (dari `:root` dan `.dark`) dari `solat-omatic/src/index.css` dan gabungkan ke dalam `quran/src/index.css`.
2.  **Perbarui Konfigurasi Tailwind:** Gabungkan properti dari `theme.extend` di `solat-omatic/tailwind.config.ts` (termasuk `colors`, `keyframes`, `animation`, `backgroundImage`, `boxShadow`, `fontFamily`) ke dalam file `quran/tailwind.config.ts`.

### b. Migrasi Tipe Data

1.  **Buat File Tipe Baru:** Salin konten dari `solat-omatic/src/types/prayer.ts` ke file baru di `quran/src/types/prayer.ts`.
2.  **Hapus Tipe Lama:** Hapus file `quran/src/types/prayerTimes.ts` yang lama untuk menghindari duplikasi dan kebingungan.

### c. Migrasi Hooks

1.  **Ganti `usePrayerTimes`:** Timpa file `quran/src/hooks/usePrayerTimes.ts` yang ada dengan konten dari `solat-omatic/src/hooks/usePrayerTimes.ts`.
2.  **Tambah `usePrayerTimesByDate`:** Salin file `solat-omatic/src/hooks/usePrayerTimesByDate.ts` ke dalam direktori `quran/src/hooks/`.

### d. Migrasi Komponen

1.  **Buat Direktori Baru:** Buat sub-direktori baru untuk kerapian: `quran/src/components/prayer-times/`.
2.  **Salin Komponen:** Salin file-file komponen berikut dari `solat-omatic/src/components/` ke direktori `quran/src/components/prayer-times/` yang baru:
    - `PrayerTimes.tsx`
    - `CurrentTimeCard.tsx`
    - `PrayerCard.tsx`
    - `CalendarPrayerTimes.tsx`
    - `HijriCalendar.tsx`
    - `ErrorCard.tsx`
    - `LoadingSpinner.tsx`
3.  **Perbaiki Impor:** Sesuaikan semua path impor di dalam file-file yang baru disalin agar cocok dengan struktur direktori proyek `quran` (misalnya, dari `@/components/ui/card` menjadi `@/components/ui/card`).

### e. Integrasi Final

1.  **Sederhanakan `PrayerTimesPage.tsx`:** Ubah file `quran/src/pages/PrayerTimesPage.tsx` yang ada. Hapus semua logika UI yang lama dan buat agar hanya me-render satu komponen: `<PrayerTimes />` yang baru dimigrasikan.

## 4. Langkah-langkah Pengerjaan

1.  **[Styling]** Lakukan migrasi styling dengan memperbarui `index.css` dan `tailwind.config.ts`.
2.  **[Tipe Data]** Migrasikan definisi tipe dengan menyalin `prayer.ts` dan menghapus `prayerTimes.ts`.
3.  **[Komponen]** Salin semua file komponen UI dari `solat-omatic` ke direktori `src/components/prayer-times/`.
4.  **[Hooks]** Salin kedua hook (`usePrayerTimes.ts` dan `usePrayerTimesByDate.ts`) ke direktori `src/hooks/`, timpa yang sudah ada jika perlu.
5.  **[Refactor]** Periksa semua file yang baru ditambahkan dan perbaiki path impor agar sesuai dengan struktur proyek `quran`.
6.  **[Integrasi]** Ubah `PrayerTimesPage.tsx` untuk me-render komponen utama `<PrayerTimes />`.
7.  **[Verifikasi]** Jalankan aplikasi dan lakukan pengujian menyeluruh untuk memastikan semua fitur yang diimpor (tampilan waktu, kalender, pemilihan zona waktu) berfungsi dengan baik di lingkungan baru.
