# Rencana Fitur Pengaturan Font Lanjutan

## 1. Tujuan

Memberikan pengguna kontrol penuh dan granular terhadap tampilan teks Arab untuk meningkatkan kenyamanan dan personalisasi saat membaca. Fitur ini akan menggantikan sistem ukuran font "small/large/xl" yang ada dengan sistem yang lebih fleksibel.

## 2. Rencana Implementasi Teknis

### a. Penambahan State Pengaturan (Zustand)

- **Tujuan:** Menyimpan preferensi font pengguna secara persisten.
- **File yang Dimodifikasi:** `src/store/preferencesSlice.ts`
- **Tindakan:**
  1.  Perbarui _interface_ `PreferencesState` untuk menyertakan properti baru:
      - `arabicFontFamily`: `string` (misalnya, `'Amiri'`)
      - `arabicFontSize`: `number` (misalnya, `24`)
  2.  Perbarui nilai _default_ di dalam `createPreferencesSlice`:
      - `arabicFontFamily: 'Amiri'` (atau font default lainnya)
      - `arabicFontSize: 24` (atau ukuran default yang nyaman)
  3.  Pastikan kedua properti ini disertakan dalam _middleware_ `persist` agar pilihan pengguna tersimpan di `localStorage`.

### b. Integrasi Font Eksternal

- **Tujuan:** Menambahkan font-font baru yang akan menjadi pilihan pengguna.
- **File yang Dimodifikasi:** `src/index.css`
- **Tindakan:**
  1.  Tambahkan `@import` dari Google Fonts di bagian atas file untuk font-font yang dibutuhkan. Font `Amiri` sudah ada.
      ```css
      @import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Lateef&family=Noto+Naskh+Arabic:wght@400;700&family=Scheherazade+New:wght@400;700&display=swap');
      ```
  2.  Buat kelas CSS utilitas untuk setiap font agar mudah diterapkan.
      ```css
      .font-amiri { font-family: 'Amiri', serif; }
      .font-noto-naskh { font-family: 'Noto Naskh Arabic', serif; }
      .font-lateef { font-family: 'Lateef', serif; }
      .font-scheherazade { font-family: 'Scheherazade New', serif; }
      ```

### c. UI di Halaman Pengaturan

- **Tujuan:** Membuat antarmuka bagi pengguna untuk mengubah pengaturan font.
- **File yang Dimodifikasi:** `src/components/settings/SettingsSheet.tsx`
- **Tindakan:**
  1.  Buat `Card` atau seksi baru dengan judul "Pengaturan Font Arab".
  2.  **Pilihan Font:**
      - Tambahkan komponen `Select` (Dropdown).
      - Label: "Jenis Font".
      - Opsi: "Amiri", "Noto Naskh Arabic", "Lateef", "Scheherazade New".
      - Hubungkan nilainya ke `preferences.arabicFontFamily` dan _action_ `updatePreferences` dari _store_ Zustand.
  3.  **Ukuran Font:**
      - Tambahkan `Input` dengan `type="number"`.
      - Label: "Ukuran Font (px)".
      - Sediakan juga tombol `+` dan `-` di samping input untuk menambah/mengurangi ukuran dengan mudah.
      - Hubungkan nilainya ke `preferences.arabicFontSize` dan _action_ `updatePreferences`.

### d. Penerapan Gaya Dinamis pada Teks Arab

- **Tujuan:** Mengaplikasikan preferensi font pengguna secara _real-time_ ke teks Arab di seluruh aplikasi.
- **File yang Dimodifikasi:** `src/components/quran/VerseCard.tsx`
- **Tindakan:**
  1.  **Hapus Logika Lama:** Hapus fungsi `getArabicFontClass()` yang tidak lagi relevan.
  2.  **Ambil State Baru:** Di dalam komponen `VerseCard`, dapatkan `arabicFontFamily` dan `arabicFontSize` dari _store_ Zustand.
  3.  **Terapkan Gaya:**
      - Pada `div` yang merender teks Arab (`.arabic-text`), terapkan gaya secara dinamis.
      - **Font Family:** Gunakan `cn()` untuk menerapkan kelas CSS yang sesuai (misalnya, `font-amiri`) berdasarkan nilai `arabicFontFamily`.
      - **Font Size:** Gunakan properti `style` untuk menerapkan ukuran font: `style={{ fontSize: `${preferences.arabicFontSize}px` }}`.

## 3. Langkah-langkah Pengerjaan

1.  **[State]** Modifikasi `preferencesSlice.ts` untuk menambahkan state `arabicFontFamily` dan `arabicFontSize`.
2.  **[Styling]** Perbarui `src/index.css` dengan `@import` untuk semua font baru dan buat kelas utilitas untuk masing-masing font.
3.  **[UI Pengaturan]** Modifikasi `SettingsSheet.tsx` untuk menambahkan komponen `Select` (pilihan font) dan `Input` (ukuran font).
4.  **[Refactor]** Hapus fungsi `getArabicFontClass` dan penggunaannya dari `VerseCard.tsx`.
5.  **[Integrasi]** Di `VerseCard.tsx`, ambil preferensi font baru dari _store_ dan terapkan ke elemen teks Arab menggunakan `cn()` untuk _font family_ dan _inline style_ untuk _font size_.
6.  **[Testing]** Lakukan pengujian menyeluruh:
    - Ubah jenis font dan pastikan teks Arab berubah.
    - Ubah ukuran font dan pastikan ukurannya sesuai.
    - Pastikan pengaturan tetap tersimpan setelah me-refresh halaman.
