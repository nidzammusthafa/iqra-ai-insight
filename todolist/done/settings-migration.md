# Rencana Migrasi Halaman Pengaturan ke Komponen Sheet

## 1. Tujuan

Meningkatkan aksesibilitas dan kecepatan akses ke menu pengaturan dengan mengubahnya dari halaman terpisah menjadi komponen `Sheet` yang modern. Pengguna dapat mengakses pengaturan dari mana saja (dalam konteks halaman baca) melalui satu tombol aksi mengambang (Floating Action Button - FAB) yang juga mengintegrasikan tombol mode fokus.

## 2. Rencana Implementasi Teknis

### a. Komponen Baru: `FloatingActionMenu.tsx`

- **Tujuan:** Membuat satu tombol utama yang menjadi titik masuk untuk aksi cepat seperti "Mode Fokus" dan "Pengaturan".
- **Lokasi:** `src/components/layout/FloatingActionMenu.tsx`
- **Implementasi:**
  1.  **UI:** Komponen ini akan menjadi tombol bulat dengan ikon utama (misalnya, ikon `Plus` atau `Settings` dari `lucide-react`).
  2.  **Interaksi:** Menggunakan komponen `Popover` atau `DropdownMenu` yang sudah ada.
      - Saat FAB utama diklik, sebuah menu kecil akan muncul di atasnya.
      - Menu ini akan berisi dua tombol ikon:
        - Tombol 1: **Mode Fokus** (ikon `Maximize`/`Minimize`).
        - Tombol 2: **Pengaturan** (ikon `Settings`).
  3.  **State:** Komponen akan mengelola state `open/closed` dari `Popover` atau `DropdownMenu` itu sendiri.
  4.  **Props:** Komponen akan menerima *props* berupa *event handler* dari komponen induknya, seperti `onFocusToggle` dan `onSettingsClick`.

### b. Komponen Baru: `SettingsSheet.tsx`

- **Tujuan:** Menampung semua konten pengaturan yang saat ini ada di `SettingsPage.tsx`.
- **Lokasi:** `src/components/settings/SettingsSheet.tsx`
- **Implementasi:**
  1.  **Struktur:** Komponen ini akan menggunakan komponen `Sheet` dari `src/components/ui/sheet.tsx` sebagai dasarnya.
  2.  **Konten:**
      - Pindahkan seluruh JSX dari `return (...)` di `SettingsPage.tsx` ke dalam `<SheetContent>`.
      - Pindahkan semua *hook* (`useReadingPreferences`, `useBookmarks`, `useToast`) dan *handler* fungsi dari `SettingsPage` ke dalam komponen `SettingsSheet` ini.
      - Bungkus konten di dalam `<SheetContent>` dengan komponen `<ScrollArea>` untuk memastikan semua pengaturan dapat diakses di layar kecil.
  3.  **Styling:** Sesuaikan *padding* dan *margin* agar terlihat bagus di dalam *sheet*. Hapus judul halaman utama karena `SheetHeader` akan digunakan sebagai gantinya.
  4.  **Props:** Komponen akan menerima `open` dan `onOpenChange` untuk dikontrol dari luar.

### c. Modifikasi Komponen Induk (misalnya, `SurahDetail.tsx` atau `MobileLayout.tsx`)

- **Tujuan:** Mengintegrasikan kedua komponen baru dan mengelola state mereka.
- **Rekomendasi:** Implementasi ini paling baik ditempatkan di `MobileLayout.tsx` agar FAB dan *sheet* pengaturan dapat diakses secara global, tidak hanya di `SurahDetail`.
- **Implementasi di `MobileLayout.tsx`:**
  1.  **State Management:**
      - Tambahkan state untuk mengontrol visibilitas *sheet*: `const [isSettingsOpen, setIsSettingsOpen] = useState(false);`
  2.  **Integrasi Komponen:**
      - Hapus tombol "Focus Mode" yang lama dari `SurahDetail.tsx`.
      - Render `<FloatingActionMenu />` di dalam `MobileLayout.tsx` dengan posisi `fixed`.
      - Berikan *handler* ke FAB: `onFocusToggle` akan memanggil `setIsFocusMode(!isFocusMode)` (dari *hook* `useFocusMode`), dan `onSettingsClick` akan memanggil `setIsSettingsOpen(true)`.
      - Render `<SettingsSheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen} />`.

### d. Cleanup (Pembersihan Kode)

- **Tujuan:** Menghapus kode dan file yang tidak lagi digunakan untuk menjaga kebersihan *codebase*.
- **Langkah-langkah:**
  1.  **Hapus File:** Hapus file `src/pages/SettingsPage.tsx`.
  2.  **Hapus Rute:** Hapus definisi rute untuk `/settings` dari komponen router utama (kemungkinan di `App.tsx` atau `main.tsx`).
  3.  **Hapus Navigasi Bawah:** Hapus item "Pengaturan" dari array `navItems` di `MobileLayout.tsx` untuk menghilangkan ikonnya dari navigasi bawah.

## 3. Langkah-langkah Pengerjaan

1.  **[UI]** Buat file dan kerangka dasar untuk `SettingsSheet.tsx`.
2.  **[Refactor]** Pindahkan semua konten dan logika dari `SettingsPage.tsx` ke dalam `SettingsSheet.tsx`. Sesuaikan tampilannya agar pas di dalam *sheet* dan gunakan `<ScrollArea>`.
3.  **[UI]** Buat file dan kerangka dasar untuk `FloatingActionMenu.tsx` menggunakan `Popover` dan `Button`.
4.  **[Integrasi]** Hapus tombol "Focus Mode" lama dari `SurahDetail.tsx`.
5.  **[Integrasi]** Render `<FloatingActionMenu />` dan `<SettingsSheet />` di dalam `MobileLayout.tsx`.
6.  **[State]** Tambahkan state `isSettingsOpen` di `MobileLayout.tsx` dan teruskan ke komponen-komponen baru.
7.  **[Fungsionalitas]** Hubungkan *handler* `onFocusToggle` dan `onSettingsClick` dari `FloatingActionMenu` ke logika yang sesuai di `MobileLayout`.
8.  **[Cleanup]** Hapus file `SettingsPage.tsx`, rute `/settings`, dan item navigasi "Pengaturan".
9.  **[Testing]** Uji coba alur baru secara menyeluruh: klik FAB, klik tombol mode fokus, klik tombol pengaturan, scroll di dalam *sheet*, dan pastikan semua pengaturan masih berfungsi seperti sebelumnya.
