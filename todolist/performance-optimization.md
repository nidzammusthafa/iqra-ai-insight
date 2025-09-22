# Rencana Optimasi Performa Aplikasi

## 1. Tujuan

Meningkatkan kecepatan muat aplikasi, memperhalus interaksi pengguna, dan mencapai skor Lighthouse (Performance) di atas 90. Tujuannya adalah memberikan pengalaman pengguna yang instan dan bebas hambatan, bahkan pada koneksi internet yang lebih lambat.

## 2. Analisis & Pengukuran Awal

Sebelum memulai optimasi, lakukan pengukuran untuk mendapatkan *baseline*.

- **Tools:**
  - **Google Lighthouse:** Untuk audit performa, aksesibilitas, dan PWA.
  - **Vite Bundle Visualizer (`rollup-plugin-visualizer`):** Untuk menganalisis dan memvisualisasikan ukuran *bundle* JavaScript, mengidentifikasi modul mana yang paling besar.
  - **React DevTools Profiler:** Untuk menganalisis siklus *render* komponen dan menemukan *bottleneck*.
- **Metrik Utama yang Diperhatikan:**
  - **Largest Contentful Paint (LCP):** Waktu muat konten terbesar (teks atau gambar).
  - **First Input Delay (FID) / Interaction to Next Paint (INP):** Waktu dari interaksi pertama pengguna hingga browser merespons.
  - **Cumulative Layout Shift (CLS):** Stabilitas visual halaman.
  - **Total Bundle Size:** Ukuran total aset JavaScript yang diunduh pengguna.

## 3. Rencana Implementasi Teknis

### a. Optimasi Ukuran Bundle (Code Splitting & Lazy Loading)

1.  **Lazy Loading Halaman (Route-based Splitting):**
    - **Masalah:** Saat ini, seluruh kode halaman mungkin dimuat di awal.
    - **Solusi:** Gunakan `React.lazy()` dan `<Suspense>` untuk memisahkan kode setiap halaman. Kode untuk sebuah halaman hanya akan diunduh ketika pengguna mengunjungi rute tersebut.
    - **Contoh di `App.tsx` (atau di mana rute didefinisikan):**
      ```tsx
      const SurahDetail = React.lazy(() => import('@/pages/SurahDetail'));
      const HaditsHome = React.lazy(() => import('@/pages/HaditsHome'));

      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/surah/:id" element={<SurahDetail />} />
          <Route path="/hadits" element={<HaditsHome />} />
        </Routes>
      </Suspense>
      ```

2.  **Lazy Loading Komponen Berat:**
    - **Masalah:** Komponen yang tidak langsung terlihat atau jarang digunakan (seperti dialog kompleks, panel AI) dapat memperbesar ukuran *bundle* awal.
    - **Solusi:** Gunakan `React.lazy()` untuk komponen tersebut dan tampilkan hanya saat dibutuhkan.
    - **Target:** `AIInsightPanel.tsx`, `BookmarkDialog.tsx`.

3.  **Analisis Dependensi:**
    - **Masalah:** Mungkin ada *library* besar yang bisa diganti dengan alternatif yang lebih kecil.
    - **Solusi:** Gunakan `vite-plugin-bundle-visualizer` untuk mengidentifikasi *library* besar. Cari alternatif yang lebih ringan (misalnya, mengganti `moment.js` dengan `date-fns` atau `dayjs`).

### b. Optimasi Aset (Gambar & Font)

1.  **Gambar:**
    - **Solusi:** Gunakan format gambar modern seperti **WebP**. Konversi ikon dan aset lain ke format ini. Gunakan kompresi untuk memperkecil ukuran file tanpa mengurangi kualitas secara signifikan.

2.  **Font:**
    - **Solusi:** Pastikan properti `font-display: swap;` digunakan pada deklarasi `@font-face` untuk menghindari teks yang tidak terlihat saat font sedang dimuat.

### c. Optimasi Rendering di React

1.  **Memoization:**
    - **Masalah:** Komponen dapat melakukan *re-render* yang tidak perlu ketika *props* atau *state* induknya berubah, meskipun *props* untuk komponen itu sendiri tidak berubah.
    - **Solusi:** Bungkus komponen yang sering *re-render* dengan `React.memo`. Ini akan mencegah *re-render* jika *props*-nya sama.
    - **Target:** `SurahCard.tsx`, `VerseCard.tsx`, `HadithCard.tsx`.

2.  **Virtualization untuk Daftar Panjang:**
    - **Masalah:** Merender ratusan `VerseCard` sekaligus di `SurahDetail` sangat mahal dan memperlambat aplikasi.
    - **Solusi:** Implementasikan *virtualization* menggunakan *library* seperti `react-window` atau `tanstack-virtual`. Ini hanya akan merender item yang terlihat di layar, secara drastis meningkatkan performa pada surah-surah panjang.

3.  **Mencegah Cumulative Layout Shift (CLS):**
    - **Masalah:** Konten yang dimuat secara asinkron (seperti gambar, iklan, atau bahkan data ayat) dapat menyebabkan layout "melompat".
    - **Solusi:** Gunakan komponen `Skeleton` (yang sudah ada di `src/components/ui/skeleton.tsx`) sebagai *placeholder* dengan dimensi yang sama dengan konten finalnya. Ini akan "memesan" ruang di layout sebelum konten sebenarnya dimuat.

### d. Strategi Caching (Service Worker)

- **Masalah:** Setiap kali pengguna membuka aplikasi, aset dan data API diunduh kembali.
- **Solusi:** Manfaatkan *service worker* yang sudah di-setup oleh `vite-plugin-pwa` untuk menerapkan strategi *caching* yang cerdas.
  - **`Stale-While-Revalidate` untuk Data API:** Untuk data surah dan hadits (`/api/surahs/:id`). Tampilkan data dari *cache* terlebih dahulu (membuat aplikasi terasa instan), lalu di latar belakang, ambil versi terbaru dari jaringan dan perbarui *cache*.
  - **`Cache First` untuk Aset Statis:** Untuk file JS, CSS, dan font. Jika aset ada di *cache*, gunakan langsung dari sana.

## 4. Langkah-langkah Pengerjaan (Prioritas)

1.  **[Prioritas Tinggi]** Implementasikan *virtualization* pada halaman `SurahDetail` untuk daftar ayat.
2.  **[Prioritas Tinggi]** Terapkan *lazy loading* berbasis rute untuk semua halaman utama.
3.  **[Prioritas Sedang]** Gunakan `Skeleton` dengan dimensi yang tepat di `QuranHome` dan `SurahDetail` untuk mengurangi CLS.
4.  **[Prioritas Sedang]** Analisis *bundle* dengan `vite-plugin-bundle-visualizer` dan cari dependensi besar yang bisa dioptimalkan.
5.  **[Prioritas Sedang]** Bungkus komponen-komponen kartu (`SurahCard`, `VerseCard`) dengan `React.memo`.
6.  **[Prioritas Rendah]** Konversi gambar ke format WebP.
7.  **[Berkelanjutan]** Lakukan profiling secara berkala dengan React DevTools untuk menemukan peluang optimasi baru.
