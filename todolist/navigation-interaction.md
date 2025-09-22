# Rencana Peningkatan Navigasi dan Interaksi

## 1. Tujuan

Membuat navigasi di dalam aplikasi terasa lebih cair, intuitif, dan efisien, meniru pengalaman aplikasi *native* berkualitas tinggi. Tujuannya adalah untuk mengurangi friksi pengguna saat menjelajahi konten Al-Qur'an dan mempercepat akses ke fitur-fitur kunci.

## 2. Rencana Implementasi Teknis (Fitur Baru)

### a. Lompat ke Ayat (Jump to Verse)

- **Tujuan:** Menyediakan cara cepat bagi pengguna untuk langsung menuju ayat tertentu dalam sebuah surah.
- **Implementasi:**
  1.  **UI:** Tambahkan sebuah tombol ikon (misalnya, `#` atau panah) di header `SurahDetail`.
  2.  **Komponen:** Saat tombol diklik, buka komponen `Dialog` atau `Sheet`.
  3.  **Fungsionalitas Dialog:**
      - Dialog berisi sebuah `Input` field bertipe `number` dan tombol "Lompat".
      - Berikan validasi agar pengguna hanya bisa memasukkan nomor ayat yang valid untuk surah tersebut.
      - Saat tombol "Lompat" diklik, tutup dialog dan panggil fungsi untuk melakukan *scroll*.
  4.  **Logika Scroll:**
      - Setiap `VerseCard` sudah memiliki `id` unik (`id="verse-{nomor_ayat}"`).
      - Gunakan `document.getElementById('verse-{nomor_ayat}').scrollIntoView({ behavior: 'smooth', block: 'center' })`.

### b. Navigasi Breadcrumb

- **Tujuan:** Memberikan konteks lokasi pengguna saat ini dalam hierarki aplikasi.
- **Implementasi:**
  1.  **Komponen:** Manfaatkan komponen `Breadcrumb` yang sudah ada di `src/components/ui/breadcrumb.tsx`.
  2.  **Lokasi:** Tempatkan di bagian atas halaman `SurahDetail` dan `HadithDetail`.
  3.  **Struktur:**
      - **Halaman Surah:** `Home > Qur'an > Al-Fatihah`
      - **Halaman Detail Hadits:** `Home > Hadits > Bukhari > 1`
      - Setiap bagian dari *breadcrumb* (kecuali yang terakhir) harus berupa `Link` yang bisa diklik.

### c. Tombol Kembali ke Atas (Back to Top)

- **Tujuan:** Memudahkan pengguna kembali ke awal halaman pada surah-surah yang panjang.
- **Implementasi:**
  1.  **Komponen:** Buat komponen `FloatingActionButton` atau sejenisnya yang terpisah dari FAB Pengaturan.
  2.  **Logika:**
      - Gunakan sebuah *custom hook* `useScroll` untuk memantau posisi *scroll* (`window.scrollY`).
      - Tampilkan tombol secara kondisional (misalnya, jika `scrollY > window.innerHeight`).
      - Beri animasi `fade-in` dan `fade-out` agar tidak muncul/hilang secara tiba-tiba.
      - Saat diklik, jalankan `window.scrollTo({ top: 0, behavior: 'smooth' })`.

### d. Tarik untuk Memuat Ulang (Pull to Refresh)

- **Tujuan:** Memberikan cara yang familiar di mobile untuk memuat ulang data halaman.
- **Implementasi:**
  1.  **Library:** Gunakan *library* seperti `react-pull-to-refresh`.
  2.  **Logika:**
      - Bungkus area konten yang bisa di-refresh (misalnya, daftar surah atau detail surah) dengan komponen dari *library* tersebut.
      - Pada *event* `onRefresh`, panggil fungsi untuk memuat ulang data dari API (misalnya, fungsi `refetch` dari `react-query` jika digunakan).

## 3. Langkah-langkah Pengerjaan (Prioritas Baru)

1.  **[Prioritas Tinggi]** Implementasikan fitur **Lompat ke Ayat** karena memberikan fungsionalitas inti yang sangat berguna.
2.  **[Prioritas Sedang]** Tambahkan tombol **Kembali ke Atas** untuk meningkatkan UX pada surah panjang.
3.  **[Prioritas Sedang]** Tambahkan **Navigasi Breadcrumb** untuk kejelasan konteks.
4.  **[Prioritas Rendah]** Implementasikan **Tarik untuk Memuat Ulang** jika dianggap perlu setelah pengujian pengguna.