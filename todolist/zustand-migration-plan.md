# Rencana Migrasi State Management ke Zustand

## 1. Tujuan

Memigrasikan sistem manajemen state global dari kombinasi beberapa React Context (`useReadingPreferences`, `useBookmarks`, `AudioProvider`) ke satu *store* Zustand yang terpusat. Tujuannya adalah untuk menyederhanakan arsitektur state, mengurangi *boilerplate*, dan meningkatkan performa rendering dengan mencegah *re-render* yang tidak perlu.

## 2. Analisis State Global Saat Ini

State global aplikasi saat ini tersebar di beberapa *custom hooks* berbasis Context, di antaranya:

- **`useReadingPreferences.ts`**: Mengelola semua pengaturan pengguna yang disimpan di `localStorage` (tema, bahasa, ukuran font, qari, dll.).
- **`useBookmarks.ts`**: Mengelola daftar *bookmark* ayat.
- **`AudioProvider` (direncanakan)**: Mengelola state pemutar audio global (`currentVerse`, `isPlaying`, dll.).
- **`useFocusMode.ts`**: Mengelola status mode fokus (UI minimalis).

## 3. Desain Arsitektur Store Zustand

Kita akan mengadopsi pola "slice", di mana setiap domain state (preferensi, audio, dll.) dikelola dalam file terpisah, lalu digabungkan menjadi satu *store* utama. Ini menjaga kode tetap terorganisir.

**Struktur Direktori:**
```
src/
└── store/
    ├── index.ts               # File utama yang membuat dan mengekspor store
    ├── audioSlice.ts          # State dan aksi untuk pemutar audio
    ├── preferencesSlice.ts    # State dan aksi untuk pengaturan pengguna
    └── bookmarkSlice.ts       # State dan aksi untuk bookmark
```

**Contoh Implementasi `index.ts`:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createPreferencesSlice } from './preferencesSlice';
import { createAudioSlice } from './audioSlice';

// Gabungkan semua slice menjadi satu tipe state utama
export const useAppStore = create((...a) => ({
  ...createPreferencesSlice(...a),
  ...createAudioSlice(...a),
  // ...slice lainnya
}));
```

Kita akan memanfaatkan *middleware* bawaan Zustand:
- **`persist`**: Untuk secara otomatis menyinkronkan state (seperti preferensi dan bookmark) dengan `localStorage`, menggantikan logika manual yang ada saat ini.

## 4. Rencana & Langkah-langkah Migrasi

### Langkah 1: Instalasi dan Setup Awal

1.  **Instal Zustand:**
    ```bash
    npm install zustand
    ```
2.  **Buat Struktur Direktori:** Buat folder `src/store` beserta file-file *slice* yang kosong seperti yang dijelaskan di atas.

### Langkah 2: Migrasi `useReadingPreferences`

1.  **Buat `preferencesSlice.ts`:**
    - Definisikan *interface* `PreferencesSlice` yang berisi semua state dari `ReadingPreferences` dan fungsi `updatePreferences`.
    - Pindahkan semua state *default* dari `DEFAULT_PREFERENCES` ke dalam *slice* ini.
    - Gunakan *middleware* `persist` untuk menyimpan *slice* ini ke `localStorage` dengan nama kunci yang sesuai.
2.  **Refaktor Komponen:**
    - Ganti semua pemanggilan `useReadingPreferences()` di seluruh aplikasi (misalnya di `SettingsSheet.tsx`, `VerseCard.tsx`) dengan `useAppStore()`.
    - Contoh:
      ```typescript
      // Lama
      const { preferences, updatePreferences } = useReadingPreferences();

      // Baru
      const { showTranslation, updatePreferences } = useAppStore();
      ```
3.  **Hapus Kode Lama:** Setelah semua komponen dimigrasi, hapus file `src/hooks/useReadingPreferences.ts` dan `ReadingPreferencesProvider` jika ada.

### Langkah 3: Migrasi `AudioProvider`

1.  **Buat `audioSlice.ts`:**
    - Definisikan *interface* `AudioSlice` dengan state seperti `currentSurah`, `currentVerse`, `isPlaying`, `isMuted`.
    - Tambahkan aksi-aksi seperti `playVerse(surah, verse)`, `pause()`, `resume()`, `next()`, `previous()`.
2.  **Refaktor `MobileLayout.tsx`:**
    - Pindahkan elemen `<audio>` yang tersembunyi ke `MobileLayout.tsx`.
    - Gunakan `useEffect` di dalam `MobileLayout` untuk mendengarkan perubahan state audio dari `useAppStore` dan mengontrol elemen `<audio>` secara langsung (misalnya, `audioRef.current.play()`).
3.  **Refaktor Komponen Audio:**
    - Ubah `StickyAudioPlayer.tsx` dan `VerseCard.tsx` untuk mendapatkan state dan memanggil aksi dari `useAppStore()`.
4.  **Hapus Kode Lama:** Hapus `AudioProvider` dan *hook* terkait.

### Langkah 4: Migrasi `useBookmarks`

1.  **Buat `bookmarkSlice.ts`:**
    - Definisikan *interface* `BookmarkSlice` dengan state `bookmarks` (array) dan aksi `addBookmark`, `removeBookmark`, `isBookmarked`.
    - Gunakan *middleware* `persist` untuk menyimpan *bookmark* ke `localStorage`.
2.  **Refaktor Komponen:** Ganti penggunaan `useBookmarks()` dengan `useAppStore()` di `BookmarkDialog.tsx` dan `VerseCard.tsx`.
3.  **Hapus Kode Lama:** Hapus file `src/hooks/useBookmarks.ts`.

### Langkah 5: Verifikasi dan Cleanup

1.  **Pengujian Menyeluruh:** Lakukan pengujian fungsional untuk semua fitur yang telah dimigrasi: mengubah pengaturan, memutar audio, menambah/menghapus bookmark.
2.  **Verifikasi Build:** Jalankan `npm run build` untuk memastikan tidak ada *error* tipe atau kompilasi.
3.  **Tinjau Ulang:** Pastikan semua *Context Provider* yang lama telah dihapus dari pohon komponen utama (di `main.tsx` atau `App.tsx`).

## 5. Keuntungan Setelah Migrasi

- **Kode Lebih Ringkas:** Penghapusan *Provider* dan *custom hooks* berbasis *context* akan mengurangi banyak kode *boilerplate*.
- **Performa Lebih Baik:** Komponen hanya akan di-*render* ulang jika *slice* state yang mereka gunakan berubah, bukan setiap kali nilai *context* berubah.
- **Manajemen State Terpusat:** Semua state global berada di satu tempat yang dapat diprediksi, membuatnya lebih mudah untuk di-debug dan dikelola.
- **Akses di Luar Komponen:** Logika state dapat diakses dan dimanipulasi dari fungsi utilitas biasa tanpa perlu berada di dalam komponen React.
