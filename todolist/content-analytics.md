# Rencana Analitik Konten

## 1. Tujuan

Memahami bagaimana pengguna berinteraksi dengan konten (Al-Qur'an, Hadits, Tafsir, dan hasil pencarian) secara agregat dan anonim. Tujuannya adalah untuk mengidentifikasi konten yang paling relevan dan menarik, menemukan celah dalam data, serta mendapatkan wawasan untuk pengembangan fitur dan konten di masa depan.

## 2. Prasyarat

- **Infrastruktur Backend:** Diperlukan database (misalnya, Supabase) untuk menyimpan data log dan agregat.
- **Kebijakan Privasi:** Pastikan pengumpulan data ini dijelaskan dalam kebijakan privasi aplikasi dan semua data yang dikumpulkan bersifat anonim atau diagregasi untuk melindungi privasi pengguna.

## 3. Rencana Implementasi Teknis

### a. Desain Skema Database (Supabase/PostgreSQL)

- **`verse_interactions`**:
  - `surah_number` (integer)
  - `verse_number` (integer)
  - `interaction_type` (enum: `read`, `audio_play`, `bookmark`, `share`, `ai_insight`)
  - `count` (integer, default: 1)
  - `date` (date)
  - `PRIMARY KEY (surah_number, verse_number, interaction_type, date)`
  - *Catatan: Daripada menyimpan setiap event, kita bisa menggunakan klausa `ON CONFLICT ... DO UPDATE SET count = count + 1` untuk agregasi langsung.*

- **`search_queries`**:
  - `query_text` (text, primary key)
  - `search_count` (integer, default: 1)
  - `last_searched_at` (timestamp)
  - `result_count` (integer): Jumlah hasil yang ditemukan untuk kueri ini.

- **`ai_insight_feedback`**:
  - `id` (uuid, primary key)
  - `surah_number` (integer)
  - `verse_number` (integer)
  - `question` (text): Pertanyaan yang diajukan pengguna.
  - `insight_response` (text): Jawaban yang diberikan AI.
  - `is_helpful` (boolean, nullable): Pengguna memberikan jempol ke atas/bawah.
  - `feedback_text` (text, nullable): Komentar tambahan dari pengguna.
  - `created_at` (timestamp)

### b. Implementasi Fitur

1.  **Pelacakan Ayat Populer (Popular Ayat Tracking):**
    - **Logika:** Setiap kali sebuah interaksi kunci terjadi pada sebuah ayat (dibaca, audionya diputar, di-bookmark, dibagikan), kirim *event* ke backend.
    - **API:** Buat satu *endpoint* `POST /api/analytics/interaction` yang menerima `{ surah, verse, type }`.
    - **Backend:** *Endpoint* ini akan melakukan `INSERT ... ON CONFLICT` ke tabel `verse_interactions` untuk menaikkan `count`.
    - **Dashboard Admin:** Buat halaman internal (tidak untuk pengguna umum) yang menampilkan 10 ayat teratas berdasarkan jumlah interaksi (`read`, `bookmark`, dll.) dalam rentang waktu tertentu (hari ini, minggu ini, bulan ini).

2.  **Analisis Kueri Pencarian (Search Query Analysis):**
    - **Logika:** Setiap kali pengguna melakukan pencarian, kirim kueri dan jumlah hasilnya ke backend.
    - **API:** `POST /api/analytics/search` yang menerima `{ query, result_count }`.
    - **Backend:** Lakukan `INSERT ... ON CONFLICT` ke tabel `search_queries` untuk menaikkan `search_count`.
    - **Dashboard Admin:**
      - Tampilkan daftar kueri pencarian paling populer.
      - **Sangat Penting:** Tampilkan daftar kueri pencarian yang menghasilkan **nol hasil** (`result_count = 0`). Ini adalah tambang emas untuk mengetahui apa yang dicari pengguna tetapi tidak dapat ditemukan oleh aplikasi, yang bisa menjadi masukan untuk perbaikan data atau fitur pencarian.

3.  **Pengukuran Akurasi Wawasan AI (AI Insight Accuracy Measurement):**
    - **UI:** Di bawah setiap jawaban dari fitur AI Insight, tambahkan tombol sederhana "Bermanfaat" (jempol ke atas) dan "Tidak Bermanfaat" (jempol ke bawah).
    - **Logika:**
      - Saat tombol diklik, kirim *feedback* ke backend melalui `POST /api/analytics/ai-feedback`.
      - Jika pengguna memberikan jempol ke bawah, secara opsional tampilkan `Dialog` yang meminta masukan lebih lanjut dalam bentuk teks.
    - **API:** *Endpoint* ini akan menyimpan *feedback* ke tabel `ai_insight_feedback`.
    - **Dashboard Admin:**
      - Tampilkan rasio *feedback* positif vs. negatif.
      - Tampilkan daftar pertanyaan dan jawaban yang sering mendapatkan *feedback* negatif. Ini sangat penting untuk proses *fine-tuning* model AI di masa depan.

4.  **Pengumpulan Umpan Balik Pengguna (User Feedback Collection):**
    - **UI:** Sediakan tombol "Kirim Masukan" yang jelas di halaman Pengaturan atau di menu utama.
    - **Komponen:** Tombol ini membuka `Dialog` atau halaman khusus berisi formulir masukan.
    - **Formulir:**
      - Pilihan kategori masukan (misalnya, "Laporan Bug", "Saran Fitur", "Kesalahan Konten").
      - `Textarea` untuk deskripsi.
      - Secara otomatis sertakan informasi konteks (misalnya, halaman saat ini, versi aplikasi, OS) untuk membantu proses debug.
    - **Backend:** Simpan masukan ini ke tabel `user_feedback` untuk ditinjau oleh tim pengembang.

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Implementasikan **Analisis Kueri Pencarian**, terutama pelacakan kueri dengan hasil nol. Ini memberikan *feedback loop* tercepat untuk perbaikan.
2.  **[Prioritas Tinggi]** Implementasikan **Pengukuran Akurasi Wawasan AI** karena kualitas fitur AI adalah prioritas utama.
3.  **[Prioritas Sedang]** Bangun sistem **Pelacakan Ayat Populer**. Ini berguna untuk fitur *content discovery* di masa depan.
4.  **[Prioritas Sedang]** Sediakan formulir **Pengumpulan Umpan Balik Pengguna** yang mudah diakses.
5.  **[Berkelanjutan]** Buat dan kembangkan *dashboard* admin internal untuk memvisualisasikan semua data analitik ini agar mudah dipahami dan ditindaklanjuti.
