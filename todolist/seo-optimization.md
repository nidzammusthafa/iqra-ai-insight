# Rencana Optimasi SEO Komprehensif

## 1. Tujuan

Meningkatkan peringkat aplikasi di hasil pencarian Google untuk kata kunci yang relevan (misalnya, "baca surat yasin", "tafsir al fatihah", "quran online"). Tujuannya adalah untuk mendatangkan trafik organik yang berkualitas dan menjadikan aplikasi ini sebagai sumber utama bagi pengguna yang mencari konten Al-Qur'an di web.

## 2. Analisis & Audit Awal

- **Tools:** Google Search Console, Lighthouse (Audit SEO).
- **Analisis:**
  - **Masalah Fundamental:** Aplikasi ini adalah **Single Page Application (SPA)** yang di-render di sisi klien (Client-Side Rendering/CSR). *Crawler* mesin pencari seperti Googlebot mungkin kesulitan melihat konten final karena hanya menerima HTML minimal dan harus mengeksekusi JavaScript untuk merender konten. Ini adalah penghalang terbesar untuk SEO.
  - **Audit Teknis:** Periksa `robots.txt` untuk memastikan tidak ada halaman penting yang diblokir. Gunakan Google Search Console untuk melihat status indeksasi saat ini.

## 3. Rencana Implementasi Teknis

### a. [KRUSIAL] Migrasi ke SSR (Server-Side Rendering) atau SSG (Static Site Generation)

- **Masalah:** CSR tidak ramah SEO.
- **Solusi Jangka Panjang (Sangat Direkomendasikan):** Migrasi dari proyek Vite murni ke *framework* React yang mendukung SSR/SSG secara *out-of-the-box* seperti **Next.js**.
  - **Keuntungan Next.js:**
    - **SEO Unggul:** Setiap halaman akan di-render sebagai HTML penuh di server, sehingga *crawler* dapat dengan mudah membaca dan mengindeks kontennya.
    - **Performa Muat Awal Cepat:** Pengguna akan melihat konten lebih cepat karena HTML sudah jadi dikirim dari server.
    - **File-based Routing:** Struktur URL yang bersih secara otomatis.
    - **Fitur Tambahan:** Optimasi gambar, API routes, dll.
- **Solusi Jangka Pendek (Kurang Ideal):** Menggunakan layanan *pre-rendering* seperti `prerender.io`. Layanan ini akan mencegat *crawler*, merender halaman Anda di server mereka, dan menyajikan HTML yang sudah jadi ke *crawler*. Ini adalah solusi "tambalan" dan tidak seefektif SSR/SSG asli.

### b. Technical SEO (Setelah Migrasi ke SSR/SSG)

1.  **Sitemap Dinamis (`sitemap.xml`):**
    - **Solusi:** Buat sebuah *endpoint* atau proses *build* yang secara otomatis menghasilkan `sitemap.xml`. Sitemap ini harus berisi:
      - Halaman statis (Home, Hadits, Settings).
      - Semua halaman surah (misalnya, `/surah/1`, `/surah/2`, ..., `/surah/114`).
      - (Opsional, untuk SEO tingkat lanjut) Halaman per ayat jika diinginkan (misalnya, `/surah/1/ayat/1`).
    - Daftarkan sitemap ini di Google Search Console.

2.  **Structured Data (Schema.org) dengan JSON-LD:**
    - **Solusi:** Tambahkan skrip JSON-LD di setiap halaman untuk membantu Google memahami konteks konten Anda. Ini dapat meningkatkan peluang untuk mendapatkan *rich snippets* di hasil pencarian.
    - **Contoh untuk Halaman Surah:**
      ```html
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": "Al-Qur'an",
        "hasPart": {
          "@type": "Chapter",
          "name": "Surah Al-Fatihah",
          "alternateName": "سورة الفاتحة",
          "chapterNumber": "1",
          "hasPart": {
            "@type": "WebPage",
            "url": "https://www.yourdomain.com/surah/1"
          }
        }
      }
      </script>
      ```

3.  **File `robots.txt`:**
    - **Solusi:** Pastikan `robots.txt` mengizinkan *crawling* semua halaman penting dan menunjuk ke lokasi `sitemap.xml`.
      ```
      User-agent: *
      Allow: /
      Disallow: /api/

      Sitemap: https://www.yourdomain.com/sitemap.xml
      ```

### c. On-Page SEO

1.  **Manajemen `<head>` Dinamis:**
    - **Solusi:** Gunakan komponen seperti `next/head` (di Next.js) atau `react-helmet-async` untuk mengatur tag di dalam `<head>` secara dinamis untuk setiap halaman.

2.  **Optimasi Title Tag (`<title>`):**
    - **Struktur:** `[Nama Surah] ([Nomor Surah]) - [Aksi] | [Nama Situs]`
    - **Contoh:** `QS. Al-Baqarah (2) - Baca & Dengarkan Online | Quran Web App`

3.  **Optimasi Meta Description:**
    - **Struktur:** Deskripsi unik dan menarik yang mengandung kata kunci.
    - **Contoh:** `Baca dan dengarkan Surah Al-Baqarah lengkap dengan terjemahan bahasa Indonesia. Aplikasi web Al-Qur'an modern, cepat, dan tanpa iklan.`

4.  **Struktur Heading (H1, H2, H3):**
    - **H1:** Hanya ada satu `<h1>` per halaman, yaitu judul utama (misalnya, nama surah).
    - **H2, H3:** Gunakan untuk sub-judul seperti "Tafsir", "Bacaan Ayat", dll.

### d. Strategi Konten & Kata Kunci

- **Riset Kata Kunci:** Identifikasi kata kunci yang sering dicari pengguna, seperti:
  - "ayat kursi latin dan artinya"
  - "surat yasin untuk orang meninggal"
  - "doa-doa dalam alquran"
- **Buat Halaman Landing Khusus:** Buat halaman yang menargetkan kata kunci populer tersebut. Contohnya, halaman yang secara khusus menampilkan "Ayat Kursi" dengan berbagai tafsir dan audionya, atau halaman yang mengumpulkan semua ayat tentang "sabar".

### e. Marketing & Pertumbuhan (Poin 25 dari Roadmap)

1.  **Integrasi Media Sosial (Social Media Integration):**
    - **Fitur Berbagi (Share):** Buat fungsi untuk membagikan ayat ke media sosial (Twitter, Facebook, WhatsApp, Telegram) dalam format gambar yang menarik (bukan hanya teks/URL).
      - **Implementasi:** Gunakan *library* seperti `html-to-image` untuk mengubah komponen `VerseCard` (dengan gaya kustom) menjadi gambar di sisi klien, lalu picu dialog berbagi browser.
    - **Open Graph & Twitter Cards:** Pastikan setiap halaman memiliki meta tag `og:title`, `og:description`, `og:image`, dan `twitter:card` yang sesuai. Ini akan membuat pratinjau URL terlihat menarik saat dibagikan.

2.  **Pemasaran Konten (Content Marketing):**
    - **Blog/Artikel:** Buat bagian blog di dalam aplikasi atau di situs web terpisah. Tulis artikel yang relevan dengan kata kunci yang sudah diriset (misalnya, "Keutamaan Membaca Surat Al-Waqiah Setiap Hari"). Artikel ini harus menautkan kembali ke ayat-ayat yang relevan di dalam aplikasi.
    - **Video/Infografis:** Buat konten visual berdasarkan data dari aplikasi (misalnya, infografis tentang surah yang paling sering dibaca) untuk dibagikan di media sosial.

3.  **Optimasi App Store (App Store Optimization - ASO untuk PWA):**
    - **Meskipun PWA tidak ada di App Store tradisional, prinsip ASO tetap berlaku:**
    - **Nama & Ikon:** Pastikan `name` dan `short_name` di *web app manifest* jelas dan ikonnya menarik.
    - **Deskripsi:** `description` di manifest harus kaya akan kata kunci dan menjelaskan fitur utama aplikasi.
    - **Screenshot:** Buat halaman arahan (landing page) untuk aplikasi PWA Anda dan tampilkan *screenshot* berkualitas tinggi dari aplikasi tersebut, sama seperti di halaman App Store.

4.  **Program Referal (Referral Program):**
    - **Tujuan:** Mendorong pertumbuhan dari mulut ke mulut.
    - **Implementasi (Jangka Panjang):**
      - Berikan setiap pengguna kode atau *link* referal yang unik.
      - Jika pengguna baru mendaftar menggunakan *link* tersebut, berikan "hadiah" kepada kedua pengguna (misalnya, akses premium selama 7 hari, atau *badge* khusus).
      - Ini memerlukan logika backend yang signifikan untuk melacak referal.

## 4. Langkah-langkah Pengerjaan (Prioritas)

1.  **[SANGAT PENTING]** Lakukan riset dan perencanaan untuk migrasi dari Vite ke **Next.js**. Ini adalah fondasi untuk semua upaya SEO lainnya.
2.  **[PENTING]** Setelah migrasi, implementasikan manajemen `<head>` dinamis untuk `title` dan `meta description` di setiap halaman surah.
3.  **[PENTING]** Buat sitemap dinamis yang mencakup semua surah dan daftarkan ke Google Search Console.
4.  **[MENENGAH]** Implementasikan *Structured Data* (JSON-LD) untuk halaman surah untuk meningkatkan visibilitas.
5.  **[MENENGAH]** Audit dan pastikan struktur heading (H1, H2) sudah benar di seluruh aplikasi.
6.  **[JANGKA PANJANG]** Lakukan riset kata kunci dan mulai buat halaman-halaman konten tematik (misalnya, halaman khusus Ayat Kursi).
