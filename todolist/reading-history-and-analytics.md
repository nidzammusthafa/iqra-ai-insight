# Rencana Fitur Riwayat & Analitik Membaca

## 1. Tujuan

Memberikan pengguna wawasan tentang kebiasaan membaca mereka, memotivasi mereka untuk membaca secara konsisten, dan membantu mereka mencapai tujuan spiritual pribadi. Fitur ini bertujuan untuk gamifikasi positif dan refleksi diri.

## 2. Prasyarat

Fitur ini memerlukan **backend dan sistem autentikasi pengguna** (misalnya, Supabase) untuk menyimpan data riwayat dan analitik secara personal dan persisten.

## 3. Rencana Implementasi Teknis

### a. Desain Skema Database (Supabase/PostgreSQL)

- **`reading_history`**:
  - `id` (uuid, primary key)
  - `user_id` (foreign key ke `profiles.id`)
  - `surah_number` (integer)
  - `verse_number` (integer)
  - `read_at` (timestamp, default: `now()`): Waktu kapan ayat ini dibaca.
- **`reading_goals`**:
  - `id` (uuid, primary key)
  - `user_id` (foreign key ke `profiles.id`)
  - `goal_type` (enum: `daily_verses`, `daily_minutes`): Jenis tujuan (misalnya, 10 ayat per hari, 15 menit per hari).
  - `goal_value` (integer)
  - `is_active` (boolean)
- **`daily_reading_summary`** (Tabel agregat untuk performa):
  - `user_id` (foreign key)
  - `date` (date)
  - `total_verses_read` (integer)
  - `total_minutes_read` (integer)
  - `PRIMARY KEY (user_id, date)`

### b. Implementasi Fitur

1.  **Pencatatan Riwayat Baca (Reading History Tracking):**
    - **Logika:** Setiap kali seorang pengguna membaca sebuah ayat, sebuah *event* harus dipicu. "Membaca" bisa didefinisikan sebagai ayat yang berada di *viewport* selama beberapa detik (misalnya, 3-5 detik).
    - **Implementasi Frontend:**
      - Gunakan `IntersectionObserver` pada setiap `VerseCard`.
      - Ketika sebuah `VerseCard` masuk ke *viewport* dan bertahan selama durasi yang ditentukan, panggil *endpoint* API `POST /api/history` dengan `{ surah_number, verse_number }`.
      - Untuk menghindari terlalu banyak panggilan API, kirim *event* secara *batch* (misalnya, setiap 10 ayat terbaca atau setiap 1 menit).

2.  **Jejak Membaca (Reading Streak):**
    - **UI:** Tampilkan ikon api 🔥 dengan jumlah hari beruntun di halaman profil atau dashboard pengguna.
    - **Logika Backend:**
      - Buat *endpoint* `GET /api/analytics/streak`.
      - *Endpoint* ini akan memeriksa tabel `daily_reading_summary`.
      - Logikanya adalah menghitung jumlah hari berturut-turut (tanpa jeda) hingga hari ini di mana `total_verses_read > 0`.

3.  **Tujuan Membaca Harian (Daily Reading Goals):**
    - **UI:** Di halaman pengaturan atau profil, izinkan pengguna untuk menetapkan tujuan mereka.
      - Contoh: "Saya ingin membaca **[10]** ayat setiap hari" atau "Saya ingin membaca selama **[15]** menit setiap hari".
    - **Logika:**
      - Simpan tujuan ini melalui `POST /api/goals`.
      - Di halaman utama, tampilkan *progress bar* atau lingkaran kemajuan yang menunjukkan progres hari ini (misalnya, "7 dari 10 ayat tercapai").
      - Data progres diambil dari `GET /api/analytics/today-summary` yang membaca tabel `daily_reading_summary`.

4.  **Statistik Surah Paling Sering Dibaca (Most Read Surahs):**
    - **UI:** Tampilkan daftar 3-5 surah yang paling sering dibaca di halaman profil pengguna.
    - **Logika Backend:**
      - Buat *endpoint* `GET /api/analytics/most-read-surahs`.
      - *Endpoint* ini akan melakukan agregasi pada tabel `reading_history`, mengelompokkan berdasarkan `surah_number`, menghitung jumlah ayat yang dibaca per surah, dan mengurutkannya secara menurun.

5.  **Pelacakan Waktu Membaca (Reading Time Tracking):**
    - **Logika Frontend:**
      - Saat tab aplikasi aktif dan pengguna berada di halaman membaca (`SurahDetail`), mulai sebuah *timer*.
      - Jika pengguna beralih tab atau aplikasi menjadi tidak aktif, hentikan *timer*.
      - Kirim total waktu aktif (dalam detik) ke backend secara periodik (misalnya, setiap 5 menit) melalui *endpoint* `POST /api/history/time`.
    - **Logika Backend:** *Endpoint* ini akan menambahkan waktu ke `total_minutes_read` di tabel `daily_reading_summary` untuk hari ini.

6.  **Laporan Mingguan/Bulanan (Weekly/Monthly Reports):**
    - **UI:** Di halaman profil, sediakan tampilan laporan.
    - **Tampilan:** Gunakan *library* grafik seperti `recharts` atau `chart.js` (sudah ada di `components/ui/chart.tsx`) untuk memvisualisasikan data.
      - **Grafik Batang:** Menampilkan total ayat yang dibaca setiap hari dalam seminggu terakhir.
      - **Angka Statistik:** Total waktu membaca bulan ini, rata-rata ayat per hari, dll.
    - **API:** Buat *endpoint* `GET /api/analytics/report?period=weekly` yang mengambil data agregat dari `daily_reading_summary`.

## 4. Langkah-langkah Pengerjaan

1.  **[Prasyarat]** Siapkan backend Supabase dan autentikasi.
2.  **[Prioritas Tinggi]** Implementasikan skema database, terutama `reading_history`.
3.  **[Prioritas Tinggi]** Bangun mekanisme **Pencatatan Riwayat Baca** menggunakan `IntersectionObserver` dan *batch update*.
4.  **[Prioritas Sedang]** Implementasikan fitur **Jejak Membaca (Reading Streak)** karena memberikan gamifikasi yang kuat.
5.  **[Prioritas Sedang]** Bangun fitur **Tujuan Membaca Harian** dengan visualisasi progres.
6.  **[Prioritas Rendah]** Tambahkan **Statistik Surah Paling Sering Dibaca**.
7.  **[Prioritas Rendah]** Implementasikan **Pelacakan Waktu Membaca** karena lebih kompleks.
8.  **[Prioritas Rendah]** Bangun halaman **Laporan Mingguan/Bulanan** setelah data analitik dasar terkumpul.
