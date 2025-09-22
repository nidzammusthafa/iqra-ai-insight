# Rencana Perbaikan Bug dan Peningkatan Fitur VerseCard

## 1. Latar Belakang

Pengguna melaporkan dua isu terkait komponen `VerseCard`:
1.  **Bug:** Menu konteks (yang berisi aksi seperti "Bookmark", "Salin", dll.) muncul secara tidak terduga saat pengguna melakukan *scroll* di daftar ayat, bukan hanya saat melakukan tekan lama (*long press*).
2.  **Permintaan Fitur:** Layout teks Arab dan nomor ayat perlu disesuaikan agar lebih menyerupai mushaf cetak, di mana teks Arab berada di bagian atas di samping nomor ayat.

## 2. Analisis dan Rencana Perbaikan Bug

### a. Analisis Penyebab

Bug ini terjadi karena seluruh area `VerseCard` dibungkus oleh komponen `DropdownMenuTrigger`. Komponen ini dirancang untuk membuka menu saat ada interaksi klik/tap. Saat pengguna melakukan *scroll* dengan cepat di perangkat sentuh, gestur tersebut terkadang salah diinterpretasikan sebagai "tap", sehingga memicu menu secara tidak sengaja.

### b. Rencana Implementasi Perbaikan

Solusinya adalah dengan mengelola status buka/tutup `DropdownMenu` secara manual, bukan lagi mengandalkan `DropdownMenuTrigger`.

1.  **Hapus `DropdownMenuTrigger`:** Lepaskan pembungkus `DropdownMenuTrigger` dari `VerseCard`.
2.  **Gunakan State Lokal:** Tambahkan *state* baru di dalam komponen `VerseCard`: `const [isMenuOpen, setIsMenuOpen] = useState(false);`.
3.  **Kontrol `DropdownMenu`:** Hubungkan *state* tersebut ke komponen `DropdownMenu`: `<DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>`.
4.  **Gunakan `onContextMenu`:** Tambahkan *event handler* `onContextMenu` pada `div` utama `VerseCard`. *Event* ini secara alami ditiru oleh gestur "tekan lama" pada perangkat mobile.
5.  **Implementasi Handler:** Di dalam fungsi *handler* `onContextMenu`, lakukan dua hal:
    - Panggil `e.preventDefault()` untuk mencegah menu konteks bawaan browser muncul.
    - Atur status menjadi `true`: `setIsMenuOpen(true)`.

## 3. Analisis dan Rencana Peningkatan Fitur Layout

### a. Analisis Kebutuhan

Pengguna ingin layout yang lebih alami di mana nomor ayat tidak berada di baris terpisah di atas teks Arab, melainkan sejajar di sampingnya (di sisi kanan, sesuai kaidah RTL).

### b. Rencana Implementasi Fitur

Perubahan ini dapat dicapai dengan merestrukturisasi DOM menggunakan Flexbox.

1.  **Buat Container Flexbox:** Gantikan `div` yang sebelumnya membungkus nomor ayat dan tombol kontrol dengan sebuah `div` baru yang berfungsi sebagai *container* utama untuk bagian atas *card*.
2.  **Terapkan Flexbox RTL:** Beri *container* tersebut properti `flex` dan `flex-row-reverse` untuk mengatur elemen dari kanan ke kiri. Gunakan `items-start` untuk memastikan elemen sejajar di bagian atas dan `gap-x-4` untuk memberi sedikit jarak.
3.  **Pindahkan Elemen:** Pindahkan `div` yang berisi teks Arab dan `div` yang berisi nomor ayat ke dalam *container* Flexbox yang baru ini.
4.  **Sederhanakan Struktur:** Hapus `div` pembungkus yang sudah tidak diperlukan untuk menjaga kebersihan kode.

## 4. Langkah-langkah Pengerjaan

1.  Buat *branch* Git baru dari `main` dengan nama `fix/verse-card-interaction`.
2.  Terapkan **Rencana Perbaikan Bug** terlebih dahulu untuk memastikan fungsionalitas menu konteks sudah benar.
3.  Setelah bug teratasi, lanjutkan dengan menerapkan **Rencana Peningkatan Fitur Layout**.
4.  Lakukan pengujian fungsional untuk memastikan:
    - Menu konteks hanya muncul saat tekan lama (atau klik kanan di desktop).
    - Menu konteks tidak muncul saat *scroll*.
    - Layout teks Arab dan nomor ayat sudah benar dan responsif.
5.  Jalankan perintah `npm run build` untuk memastikan tidak ada *error* kompilasi.
6.  Setelah semua selesai dan terverifikasi, ajukan untuk digabungkan kembali ke `main`.
