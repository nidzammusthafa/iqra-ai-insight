# Rencana Fitur Penemuan Konten (Content Discovery)

## 1. Tujuan

Mendorong pengguna untuk menjelajahi Al-Qur'an di luar kebiasaan membaca mereka, menyajikan konten yang relevan dan menarik secara proaktif, serta memfasilitasi pembelajaran tematik. Tujuannya adalah mengubah aplikasi dari alat baca pasif menjadi platform eksplorasi spiritual yang dinamis.

## 2. Rencana Implementasi Teknis

### a. Fitur "Ayat Hari Ini" (Ayat of the Day)

- **Tujuan:** Memberikan inspirasi harian kepada pengguna dengan satu ayat pilihan.
- **Implementasi Backend (jika menggunakan Supabase/server sendiri):**
  1.  Buat sebuah tabel `daily_verses` dengan kolom `date` dan `verse_id`.
  2.  Buat *cron job* (misalnya, menggunakan Supabase Edge Functions) yang berjalan setiap hari pada tengah malam.
  3.  *Job* ini akan memilih sebuah ayat (bisa secara acak atau dari daftar yang sudah dikurasi) dan menyimpannya sebagai "Ayat Hari Ini" untuk tanggal tersebut.
  4.  Buat API *endpoint* `GET /api/ayat-of-the-day` untuk mengambil data ini.
- **Implementasi Frontend:**
  1.  **Komponen:** Buat komponen `AyatOfTheDayCard`.
  2.  **Lokasi:** Tampilkan di halaman utama (`QuranHome.tsx`) di bagian atas.
  3.  **Logika:**
      - Ambil data dari *endpoint* `/api/ayat-of-the-day`.
      - Tampilkan ayat, terjemahan, dan nama surahnya di dalam kartu.
      - Tambahkan tombol "Bagikan" dan tombol "Lihat Tafsir" yang mengarahkan ke halaman `SurahDetail` dan menyorot ayat tersebut.

### b. Generator Ayat Acak

- **Tujuan:** Memberi pengguna cara cepat untuk menemukan ayat baru secara acak untuk perenungan.
- **Implementasi:**
  1.  **UI:** Tambahkan tombol "Tampilkan Ayat Acak" di halaman utama atau di halaman pencarian.
  2.  **Logika:**
      - **Frontend-only:** Buat fungsi yang memilih nomor surah acak (1-114) dan nomor ayat acak dalam surah tersebut. Ini sederhana tetapi kurang ideal karena data surah harus dimuat dulu.
      - **Backend (lebih baik):** Buat *endpoint* API `GET /api/random-verse`. Logika di server akan mengambil satu ayat acak dari database secara efisien.
  3.  **Tampilan:** Tampilkan ayat yang didapat dalam sebuah `Dialog` atau `Alert`.

### c. Saran Ayat Terkait (Related Verses)

- **Tujuan:** Membantu pengguna memahami konteks dan hubungan antar ayat berdasarkan tema.
- **Implementasi (Membutuhkan Backend AI):**
  1.  **Backend (Vector Database):**
      - Saat proses *data ingestion*, setiap ayat diubah menjadi *vector embedding* menggunakan model bahasa (misalnya, `text-embedding-ada-002` dari OpenAI) dan disimpan di *vector database* (misalnya, pgvector di Supabase).
      - Buat API *endpoint* `GET /api/verses/{id}/related`.
      - *Endpoint* ini akan mengambil *vector* dari ayat dengan `{id}` tersebut, lalu melakukan pencarian kesamaan kosinus (*cosine similarity search*) di *vector database* untuk menemukan 5-10 ayat yang paling mirip secara semantik.
  2.  **Frontend:**
      - Di halaman `SurahDetail`, di bawah setiap `VerseCard` atau di dalam panel detail, tambahkan bagian "Ayat Terkait".
      - Panggil API di atas dan tampilkan daftar ayat terkait sebagai *link* yang bisa diklik.

### d. Pencarian Populer (Popular Searches) & Topik Tren

- **Tujuan:** Menunjukkan kepada pengguna apa yang sedang dicari atau dipelajari oleh pengguna lain.
- **Implementasi (Membutuhkan Backend & Analytics):**
  1.  **Backend:**
      - Buat tabel `search_logs` untuk mencatat setiap kueri pencarian yang berhasil.
      - Buat *cron job* yang berjalan secara periodik (misalnya, setiap jam) untuk mengagregasi kueri pencarian paling populer dalam 24 jam terakhir dan menyimpannya di tabel `trending_topics`.
      - Buat API *endpoint* `GET /api/trending-topics`.
  2.  **Frontend:**
      - Di halaman pencarian (`SearchPage.tsx`), sebelum pengguna mengetik, tampilkan daftar "Pencarian Populer" yang diambil dari API.
      - Tampilkan sebagai *chip* atau *badge* yang bisa diklik untuk langsung melakukan pencarian.

### e. Penjelajahan Berdasarkan Kategori (Category Browsing)

- **Tujuan:** Memungkinkan pengguna untuk menemukan ayat-ayat yang berhubungan dengan tema-tema spesifik dalam Islam.
- **Implementasi:**
  1.  **Data Curation (Manual/AI):**
      - Buat daftar kategori (misalnya, "Doa dalam Al-Qur'an", "Kisah Para Nabi", "Hukum Waris", "Ayat tentang Sabar").
      - Petakan ayat-ayat yang relevan ke setiap kategori. Proses ini bisa dilakukan secara manual atau dibantu oleh model AI (LLM) untuk klasifikasi.
      - Simpan pemetaan ini di database.
  2.  **Backend:** Buat API *endpoint* `GET /api/categories` dan `GET /api/categories/{slug}` untuk mengambil daftar ayat dalam satu kategori.
  3.  **Frontend:**
      - Buat halaman baru `CategoryListPage.tsx` untuk menampilkan semua kategori yang tersedia.
      - Buat halaman `CategoryDetailPage.tsx` yang menampilkan semua ayat yang termasuk dalam kategori yang dipilih.

## 3. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Implementasikan **Generator Ayat Acak** (versi frontend-only atau backend sederhana) karena paling mudah diimplementasikan dan memberikan nilai tambah langsung.
2.  **[Prioritas Tinggi]** Implementasikan **"Ayat Hari Ini"** karena sangat bagus untuk *user engagement* dan retensi.
3.  **[Prioritas Sedang]** Implementasikan **Penjelajahan Berdasarkan Kategori**. Ini membutuhkan kerja kurasi data tetapi memberikan nilai eksplorasi yang besar.
4.  **[Prioritas Rendah/Membutuhkan AI]** Implementasikan **Saran Ayat Terkait** setelah infrastruktur AI dan *vector database* siap.
5.  **[Prioritas Rendah/Membutuhkan Analytics]** Implementasikan **Pencarian Populer** setelah sistem *logging* dan agregasi di backend siap.
