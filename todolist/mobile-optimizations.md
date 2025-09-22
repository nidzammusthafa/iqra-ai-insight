# Rencana Optimasi Khusus Mobile

## 1. Tujuan

Memastikan aplikasi tidak hanya terlihat bagus di perangkat mobile, tetapi juga terasa responsif, hemat sumber daya (baterai dan data), dan memanfaatkan pola interaksi yang familiar bagi pengguna mobile. Tujuannya adalah mencapai pengalaman pengguna yang setara dengan aplikasi *native*.

## 2. Rencana Implementasi Teknis

### a. Peningkatan Gestur Sentuh (Touch Gesture Improvements)

- **Tujuan:** Membuat interaksi sentuh lebih kaya dan intuitif.
- **Implementasi:**
  1.  **Gestur Geser untuk Navigasi:** (Tumpang tindih dengan `navigation-interaction.md`) Gunakan `framer-motion` atau `react-use-gesture` untuk memungkinkan geser antar surah.
  2.  **Tekan Lama (Long Press) pada Ayat:**
      - **Fungsionalitas:** Saat pengguna menekan lama sebuah `VerseCard`, buka sebuah *context menu* dengan opsi cepat: "Bookmark", "Bagikan", "Salin Ayat", "Lihat Tafsir".
      - **Library:** `framer-motion` dapat mendeteksi `onLongPress`.
      - **Komponen:** Gunakan komponen `ContextMenu` atau `DropdownMenu` yang sudah ada di `src/components/ui/`.

### b. Umpan Balik Haptik (Haptic Feedback)

- **Tujuan:** Memberikan umpan balik fisik halus saat interaksi penting untuk menegaskan bahwa sebuah aksi telah berhasil dilakukan.
- **Implementasi:**
  1.  **Kapan Digunakan:**
      - Saat tombol penting ditekan (misalnya, Play/Pause audio, Bookmark).
      - Saat sebuah aksi berhasil diselesaikan (misalnya, ayat berhasil di-bookmark).
      - Saat gestur *pull-to-refresh* diaktifkan.
  2.  **Logika:**
      - Buat sebuah fungsi *utility* `triggerHapticFeedback()`.
      - Di dalamnya, periksa apakah `navigator.vibrate` didukung oleh browser.
      - `if (navigator.vibrate) { navigator.vibrate(50); }` (getaran 50ms adalah standar yang baik untuk umpan balik halus).
      - Panggil fungsi ini pada *event handler* yang sesuai.

### c. Optimasi Baterai untuk Audio Latar Belakang

- **Tujuan:** Memastikan pemutaran audio di latar belakang (jika diimplementasikan) seefisien mungkin untuk meminimalkan konsumsi baterai.
- **Implementasi (Memerlukan Service Worker):**
  1.  **Audio API & Service Worker:** Gunakan **Audio API** untuk kontrol yang lebih baik. Pemutaran audio harus dikelola dari dalam *service worker* agar tetap berjalan saat tab aplikasi tidak aktif.
  2.  **Wake Lock API:**
      - **Masalah:** Beberapa perangkat mobile dapat men-suspensi proses saat layar mati, yang bisa menghentikan audio.
      - **Solusi:** Gunakan **Screen Wake Lock API** (`navigator.wakeLock.request('screen')`) secara hati-hati. Aktifkan hanya saat audio sedang diputar dan pengguna mengaktifkan opsi "Jaga Layar Tetap Aktif". Pastikan untuk melepaskan *lock* saat audio dijeda atau dihentikan untuk menghemat baterai.
  3.  **Pre-loading Cerdas:** Daripada mengunduh seluruh audio surah di awal, unduh hanya beberapa ayat berikutnya. Saat ayat N sedang diputar, mulai unduh audio untuk ayat N+1 dan N+2.

### d. Optimasi Penggunaan Memori

- **Tujuan:** Mencegah aplikasi menjadi lambat atau *crash* pada perangkat dengan memori terbatas setelah penggunaan yang lama.
- **Implementasi:**
  1.  **Virtualization:** (Tumpang tindih dengan `performance-optimization.md`) Ini adalah optimasi memori yang paling penting. Gunakan `react-window` atau `tanstack-virtual` untuk daftar panjang (ayat, surah, hadits) agar hanya merender item yang terlihat di DOM.
  2.  **Pembersihan Event Listener:**
      - Pastikan semua *event listener* (misalnya, `scroll`, `resize`) yang dibuat di dalam komponen `useEffect` dibersihkan di dalam fungsi *cleanup* `useEffect` (`return () => ...`). Kebocoran *event listener* adalah penyebab umum kebocoran memori.
  3.  **Debouncing & Throttling:**
      - Untuk *event* yang sering terpicu seperti `scroll` atau `resize`, jangan jalankan fungsi secara langsung. Bungkus fungsi tersebut dengan *debounce* atau *throttle* (misalnya, menggunakan *library* `lodash` atau *custom hook*) untuk membatasi seberapa sering fungsi tersebut dieksekusi.

### e. Penyesuaian Titik Henti Responsif (Responsive Breakpoints Fine-tuning)

- **Tujuan:** Memastikan layout terlihat sempurna di berbagai ukuran layar mobile, dari yang kecil hingga phablet.
- **Implementasi (CSS/Tailwind):**
  1.  **Audit Visual:** Buka aplikasi di berbagai simulator perangkat di Chrome DevTools.
  2.  **Identifikasi Masalah:** Cari masalah umum seperti teks yang meluap, tombol yang terlalu kecil untuk diketuk, atau elemen yang tumpang tindih.
  3.  **Solusi:**
      - **Ukuran Target Sentuh:** Pastikan semua elemen yang bisa diklik (tombol, link) memiliki ukuran minimal 44x44 piksel.
      - **Breakpoint Kustom:** Jika perlu, tambahkan *breakpoint* kustom di `tailwind.config.ts` untuk menangani ukuran layar yang spesifik (misalnya, layar yang sangat sempit seperti iPhone SE generasi pertama).
      - **Gunakan `flex-wrap`:** Untuk barisan elemen yang mungkin tidak muat di layar kecil, gunakan `flex-wrap` agar elemen turun ke baris berikutnya.

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Lakukan **Audit Visual** dan **Penyesuaian Breakpoints** karena ini adalah perbaikan mendasar untuk UX.
2.  **[Prioritas Tinggi]** Implementasikan **Umpan Balik Haptik** untuk interaksi kunci. Ini adalah peningkatan kecil dengan dampak besar pada "rasa" aplikasi.
3.  **[Prioritas Sedang]** Implementasikan gestur **Tekan Lama (Long Press)** pada `VerseCard` untuk menyediakan menu konteks.
4.  **[Prioritas Sedang]** Tinjau kembali semua `useEffect` untuk memastikan **Pembersihan Event Listener** sudah dilakukan dengan benar.
5.  **[Prioritas Rendah/Kompleks]** Terapkan **Optimasi Baterai** jika dan setelah fitur audio latar belakang diimplementasikan.
