# Rencana Kesiapan Monetisasi

## 1. Tujuan

Menyiapkan infrastruktur teknis untuk berbagai model monetisasi yang etis dan tidak mengganggu pengalaman inti pengguna. Tujuannya adalah untuk memastikan keberlanjutan finansial proyek (menutupi biaya server, API, dan pengembangan) sambil tetap menjaga misi utama aplikasi sebagai alat bantu ibadah.

## 2. Prinsip Monetisasi

- **Pengalaman Inti Gratis:** Fitur membaca Al-Qur'an, terjemahan, dan pencarian dasar harus selalu gratis dan bebas iklan.
- **Transparansi:** Jelaskan dengan jelas kepada pengguna mengapa donasi atau fitur premium diperlukan.
- **Tidak Mengganggu:** Hindari iklan *banner* atau *pop-up* yang mengganggu kekhusyuan membaca.

## 3. Rencana Implementasi Teknis

### a. Sistem Donasi

- **Tujuan:** Memberikan kesempatan kepada pengguna untuk mendukung pengembangan aplikasi secara sukarela.
- **Penyedia Layanan:**
  - **Lokal (Indonesia):** **Saweria**, **Trakteer.id**. Keuntungannya adalah metode pembayaran yang familiar bagi pengguna Indonesia (QRIS, GoPay, OVO).
  - **Internasional:** **Ko-fi**, **Buy Me a Coffee**, **Patreon**.
- **Implementasi:**
  1.  **UI:**
      - Buat halaman khusus "Dukung Kami" atau "Donasi".
      - Tambahkan tombol atau *banner* yang tidak terlalu mencolok di halaman Pengaturan.
  2.  **Logika:**
      - **Metode Paling Sederhana:** Cukup tampilkan *link* eksternal ke halaman Saweria atau Ko-fi Anda. Ini adalah cara termudah tanpa perlu integrasi API yang rumit.
      - **Metode Terintegrasi:** Jika penyedia (seperti Midtrans atau Stripe) digunakan, Anda bisa membangun alur pembayaran langsung di dalam aplikasi. Ini lebih kompleks, memerlukan backend untuk memproses pembayaran dan menangani *webhook*.
  3.  **Apresiasi:** Setelah pengguna berdonasi (jika bisa dilacak), berikan ucapan terima kasih atau *badge* "Donatur" di profil mereka.

### b. Fitur Premium (Model Freemium)

- **Tujuan:** Menawarkan fitur-fitur canggih atau kustomisasi ekstra bagi pengguna yang berlangganan (misalnya, "Quran Pro").
- **Prasyarat:** Memerlukan sistem autentikasi dan database untuk melacak status langganan pengguna.
- **Contoh Fitur Premium:**
  - **Wawasan AI Tanpa Batas:** Pengguna gratis mendapatkan 5 pertanyaan AI per hari, pengguna premium tanpa batas.
  - **Sinkronisasi Antar Perangkat:** Fitur sinkronisasi *bookmark* dan riwayat hanya tersedia untuk pengguna premium.
  - **Kustomisasi Tampilan Lanjutan:** Pilihan tema, jenis font, dan warna yang lebih banyak.
  - **Audio Berkualitas Tinggi (FLAC):** Akses ke audio dengan kualitas suara terbaik.
  - **Akses Offline Penuh:** Kemampuan untuk mengunduh seluruh Al-Qur'an untuk akses offline.
- **Implementasi:**
  1.  **Backend (Supabase):**
      - Tambahkan kolom `subscription_status` (enum: `free`, `premium`) dan `subscription_end_date` (timestamp) pada tabel `profiles`.
      - Integrasikan dengan gerbang pembayaran seperti **Stripe** atau **Midtrans**. Mereka menyediakan alur untuk pembayaran langganan (subscription).
      - Buat *webhook endpoint* untuk menerima notifikasi dari gerbang pembayaran (misalnya, `payment_success`, `subscription_cancelled`) dan perbarui status langganan pengguna di database.
  2.  **Frontend:**
      - Buat halaman "Upgrade ke Premium" yang menjelaskan semua keuntungan.
      - Di seluruh aplikasi, buat pengecekan terhadap status langganan pengguna sebelum memberikan akses ke fitur premium.
      - `if (user.subscription_status === 'premium') { // Tampilkan fitur } else { // Tampilkan pesan untuk upgrade }`

### c. Slot Sponsor (Sponsorship Slots)

- **Tujuan:** Bekerja sama dengan organisasi atau perusahaan Islami yang relevan untuk menampilkan pesan mereka secara halus.
- **Implementasi:**
  1.  **Lokasi:**
      - **Layar Pemuatan (Splash Screen):** Tampilkan logo "Dipersembahkan oleh [Nama Sponsor]" saat aplikasi pertama kali dibuka.
      - **Footer Halaman Utama:** Sebuah baris teks "Didukung oleh [Nama Sponsor]".
      - **Halaman "Tentang Aplikasi":** Bagian khusus untuk para sponsor.
  2.  **Logika:**
      - Konten sponsor sebaiknya dikelola dari sisi backend (misalnya, dari CMS atau tabel database) agar mudah diganti tanpa perlu *re-deploy* aplikasi.
      - Hindari sponsor yang tidak relevan atau yang produknya bertentangan dengan nilai-nilai Islam.

### d. Integrasi Afiliasi (Affiliate Integration)

- **Tujuan:** Mendapatkan komisi dengan merekomendasikan produk atau layanan yang relevan.
- **Implementasi:**
  1.  **Jenis Afiliasi:**
      - **Buku-buku Islami:** Buat halaman "Rekomendasi Bacaan" yang berisi *link* afiliasi ke toko buku online (misalah, Amazon, Gramedia).
      - **Aplikasi Lain:** Merekomendasikan aplikasi Islami lain (misalnya, aplikasi belajar bahasa Arab).
  2.  **UI:** Pastikan untuk memberikan label yang jelas bahwa itu adalah *link* afiliasi untuk menjaga transparansi.

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Implementasikan **Sistem Donasi** menggunakan metode *link* eksternal ke Saweria/Ko-fi. Ini adalah cara tercepat dan termudah untuk mulai menerima dukungan.
2.  **[Prioritas Sedang]** Rencanakan dan definisikan dengan jelas apa saja yang akan menjadi **Fitur Premium**. Lakukan survei kecil kepada pengguna untuk mengetahui fitur apa yang paling mereka inginkan.
3.  **[Prioritas Rendah/Jangka Panjang]** Bangun infrastruktur backend untuk **Fitur Premium** dengan integrasi gerbang pembayaran.
4.  **[Opsional]** Cari potensi kerja sama untuk **Slot Sponsor** jika ada kesempatan.
5.  **[Opsional]** Pertimbangkan **Integrasi Afiliasi** jika ada produk yang sangat relevan dan bermanfaat bagi pengguna.
