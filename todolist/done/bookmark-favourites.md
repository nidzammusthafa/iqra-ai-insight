# Rencana Fitur Bookmark & Favorit Tingkat Lanjut

## 1. Tujuan

Mengubah fitur *bookmark* dari sekadar "penyimpanan" menjadi alat studi dan personalisasi yang kuat. Pengguna harus dapat mengelola, mengkategorikan, dan berinteraksi dengan ayat-ayat yang mereka simpan secara lebih mendalam, serta menyinkronkannya antar perangkat.

## 2. Prasyarat

Fitur ini sangat bergantung pada **integrasi backend dan sistem autentikasi pengguna** (misalnya, menggunakan Supabase). Sebagian besar logika akan berada di sisi backend untuk memastikan persistensi dan sinkronisasi data.

## 3. Rencana Implementasi Teknis

### a. Desain Skema Database (Supabase/PostgreSQL)

- **`profiles`**: Tabel bawaan dari Supabase Auth untuk data pengguna.
- **`bookmarks`**:
  - `id` (uuid, primary key)
  - `user_id` (foreign key ke `profiles.id`)
  - `surah_number` (integer)
  - `verse_number` (integer)
  - `notes` (text, nullable): Catatan pribadi dari pengguna.
  - `created_at` (timestamp)
- **`folders`**:
  - `id` (uuid, primary key)
  - `user_id` (foreign key ke `profiles.id`)
  - `name` (text)
  - `color` (text, hex code, nullable): Warna untuk identifikasi visual.
  - `created_at` (timestamp)
- **`bookmark_folders`** (Tabel Pivot untuk hubungan Many-to-Many):
  - `bookmark_id` (foreign key ke `bookmarks.id`)
  - `folder_id` (foreign key ke `folders.id`)

### b. Implementasi Fitur

1.  **Bookmark Ayat dengan Catatan Pribadi:**
    - **UI:** Di setiap `VerseCard`, ubah tombol *bookmark* yang ada. Saat diklik, buka `Dialog` atau `Sheet`.
    - **Fungsionalitas Dialog:**
      - Tampilkan teks ayat yang akan di-bookmark.
      - Sediakan `Textarea` untuk pengguna menambahkan catatan (`notes`).
      - Sediakan opsi untuk langsung memasukkan *bookmark* ke dalam folder (lihat poin 2).
      - Tombol "Simpan".
    - **API:** Buat *endpoint* `POST /api/bookmarks` yang menerima `{ surah_number, verse_number, notes }` dan menyimpannya ke database.

2.  **Folder Bookmark dan Kategorisasi:**
    - **UI:** Buat halaman baru "Bookmark Saya" yang bisa diakses dari menu utama atau halaman pengaturan.
    - **Fungsionalitas Halaman Bookmark:**
      - Tampilkan semua *bookmark* dalam daftar.
      - Sediakan fungsionalitas untuk membuat folder baru (`POST /api/folders`).
      - Izinkan pengguna untuk memindahkan *bookmark* ke dalam folder (drag-and-drop atau melalui menu).
      - Tampilkan folder-folder yang ada, dan saat folder diklik, filter daftar *bookmark*.
      - Izinkan pengguna mengedit/menghapus folder.
    - **API:** Dibutuhkan *endpoint* CRUD lengkap untuk `folders` dan `bookmark_folders`.

3.  **Ekspor Bookmark:**
    - **UI:** Di halaman "Bookmark Saya", tambahkan tombol "Ekspor".
    - **Fungsionalitas:**
      - Berikan pilihan format ekspor: **CSV**, **JSON**, atau **Markdown**.
      - Saat pengguna memilih format, *fetch* semua data *bookmark* dari backend.
      - **Logika Frontend:** Buat fungsi untuk mengkonversi data JSON dari API menjadi format yang dipilih dan picu unduhan file di browser.
      - **Contoh (Markdown):**
        ```markdown
        # Koleksi Bookmark Al-Qur'an

        ## QS. Al-Baqarah (2): 255
        > [Teks Ayat]
        
        **Catatan:** Ini adalah Ayat Kursi, ayat paling agung.
        
        ---
        ```

4.  **Sinkronisasi Antar Perangkat:**
    - **Tujuan:** Memastikan *bookmark* dan folder pengguna konsisten di semua perangkat tempat mereka *login*.
    - **Implementasi:** Ini secara otomatis tercapai dengan menyimpan semua data di backend (Supabase). Selama pengguna *login* dengan akun yang sama, aplikasi hanya perlu mengambil data dari API. Gunakan *library* seperti `SWR` atau `React Query` untuk *revalidasi* data secara otomatis saat aplikasi menjadi fokus kembali.

5.  **Berbagi Koleksi Bookmark (Share Bookmark Collections):**
    - **Tujuan:** Memungkinkan pengguna berbagi folder *bookmark* tertentu dengan orang lain.
    - **Implementasi (Tingkat Lanjut):**
      - **Database:** Tambahkan kolom `is_public` (boolean) dan `share_id` (uuid, unique) pada tabel `folders`.
      - **UI:** Di setiap folder, tambahkan tombol "Bagikan".
      - **Logika:** Saat tombol "Bagikan" diklik, sebuah *endpoint* `POST /api/folders/{id}/share` akan mengeset `is_public = true` dan menghasilkan `share_id` yang unik.
      - **Halaman Publik:** Buat halaman publik dengan rute `/shared/{share_id}`. Halaman ini akan menampilkan semua *bookmark* dalam folder tersebut (hanya baca).
      - Pengguna dapat membagikan URL ini kepada orang lain.

## 4. Langkah-langkah Pengerjaan

1.  **[Prasyarat]** Siapkan backend Supabase dan sistem autentikasi pengguna.
2.  **[Prioritas Tinggi]** Implementasikan skema database di Supabase.
3.  **[Prioritas Tinggi]** Bangun fitur dasar untuk menambah/melihat/menghapus *bookmark* dengan catatan pribadi.
4.  **[Prioritas Sedang]** Bangun UI dan logika CRUD untuk **Folder Bookmark**.
5.  **[Prioritas Sedang]** Implementasikan fitur **Ekspor Bookmark** (mulai dengan format JSON atau Markdown yang lebih mudah).
6.  **[Prioritas Rendah]** Implementasikan fitur **Berbagi Koleksi Bookmark** karena kompleksitasnya lebih tinggi.
7.  **[Berkelanjutan]** Pastikan sinkronisasi data berjalan lancar dengan melakukan pengujian di beberapa perangkat atau tab browser secara bersamaan.
