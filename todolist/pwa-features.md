# Rencana Fitur PWA (Progressive Web App) Tingkat Lanjut

## 1. Tujuan

Meningkatkan pengalaman pengguna dengan memanfaatkan fitur-fitur PWA secara maksimal, membuat aplikasi terasa lebih terintegrasi dengan sistem operasi, lebih andal, dan lebih proaktif dalam berinteraksi dengan pengguna, bahkan saat aplikasi tidak aktif.

## 2. Prasyarat

- **Dasar PWA Sudah Terpasang:** Aplikasi sudah dikonfigurasi dengan `vite-plugin-pwa`, memiliki *service worker* dasar dan *web app manifest*.

## 3. Rencana Implementasi Teknis

### a. Prompt Instalasi Kustom (Custom Install Prompt)

- **Masalah:** *Prompt* instalasi bawaan browser terkadang kurang terlihat atau tidak muncul pada waktu yang tepat.
- **Tujuan:** Mengontrol kapan dan bagaimana menawarkan instalasi aplikasi kepada pengguna untuk meningkatkan rasio konversi instalasi.
- **Implementasi:**
  1.  **Tangkap Event Bawaan:** Buat *event listener* untuk `beforeinstallprompt`.
      ```javascript
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); // Cegah prompt bawaan muncul
        // Simpan event ini untuk digunakan nanti
        // Misalnya, simpan di state global: setDeferredPrompt(e);
      });
      ```
  2.  **UI:** Buat tombol atau *banner* "Install Aplikasi" yang menarik di dalam UI aplikasi (misalnya, di header atau halaman pengaturan).
  3.  **Logika:** Saat pengguna mengklik tombol kustom Anda, panggil metode `prompt()` dari *event* yang sudah disimpan. Setelah itu, Anda bisa melacak hasilnya (apakah pengguna menginstal atau menolak).

### b. Notifikasi Pengingat Membaca (Push Notifications for Daily Reminders)

- **Tujuan:** Mendorong *engagement* ulang dengan mengirimkan notifikasi pengingat untuk membaca Al-Qur'an setiap hari.
- **Implementasi (Kompleks, Membutuhkan Backend):**
  1.  **Izin Pengguna:** Minta izin kepada pengguna untuk mengirim notifikasi menggunakan `Notification.requestPermission()`.
  2.  **Service Worker & Push Manager:**
      - Di *service worker*, gunakan `PushManager` untuk mendapatkan *endpoint* langganan unik untuk pengguna tersebut (`swRegistration.pushManager.subscribe`).
  3.  **Backend:**
      - Simpan *endpoint* langganan ini di database, terkait dengan `user_id`.
      - Buat *cron job* yang berjalan setiap hari.
      - *Job* ini akan memeriksa pengguna mana yang ingin mendapatkan notifikasi harian, lalu mengirim *push event* ke *endpoint* langganan mereka menggunakan *library* seperti `web-push`.
  4.  **Frontend (Service Worker):**
      - Tambahkan *event listener* untuk `push` di *service worker*.
      - Saat *push event* diterima, tampilkan notifikasi menggunakan `self.registration.showNotification()`.
      - **Contoh Notifikasi:** Judul: "Waktunya Membaca!", Isi: "Sudahkah Anda membaca Al-Qur'an hari ini? Mari lanjutkan.", Ikon: Ikon aplikasi.

### c. Fungsionalitas Offline yang Ditingkatkan (Advanced Offline Functionality)

- **Tujuan:** Memungkinkan pengguna mengakses lebih banyak konten secara offline, tidak hanya aset aplikasi atau surah yang pernah dibuka.
- **Implementasi:**
  1.  **Download Surah untuk Baca Offline:**
      - **UI:** Di setiap `SurahCard` atau di halaman `SurahDetail`, tambahkan tombol "Download".
      - **Logika:** Saat tombol diklik, *fetch* data JSON untuk surah tersebut dan audio per ayatnya, lalu simpan ke dalam **Cache API** secara eksplisit dengan nama *cache* yang spesifik (misalnya, `quran-offline-storage`).
      - **Service Worker:** Modifikasi logika `fetch` di *service worker*. Sebelum mencoba mengambil dari jaringan, periksa apakah permintaan cocok dengan konten yang ada di `quran-offline-storage`.
  2.  **Indikator Status Offline:**
      - **UI:** Tampilkan indikator (misalnya, *badge* atau ikon) pada surah yang sudah berhasil diunduh.

### d. Sinkronisasi Latar Belakang (Background Sync) untuk Bookmark

- **Tujuan:** Memungkinkan pengguna membuat *bookmark* bahkan saat offline. *Bookmark* tersebut akan otomatis disinkronkan ke server saat koneksi internet kembali pulih.
- **Implementasi:**
  1.  **Frontend:**
      - Saat pengguna membuat *bookmark* dalam kondisi offline, simpan data *bookmark* tersebut di **IndexedDB** dengan penanda `sync_pending: true`.
      - Daftarkan sebuah *event* `sync` ke *service worker*: `navigator.serviceWorker.ready.then(sw => sw.sync.register('sync-new-bookmarks'))`.
  2.  **Service Worker:**
      - Tambahkan *event listener* untuk `sync`.
      - Saat *event* `sync` dengan tag `sync-new-bookmarks` terpicu (saat koneksi kembali), ambil semua *bookmark* yang tertunda dari IndexedDB.
      - Kirim data tersebut ke API backend `POST /api/bookmarks`.
      - Setelah berhasil, hapus data dari IndexedDB atau perbarui statusnya menjadi `sync_pending: false`.

### e. Pintasan Aplikasi (App Shortcuts)

- **Tujuan:** Memberikan akses cepat ke fitur-fitur umum langsung dari ikon aplikasi di *home screen* (dengan menekan lama ikonnya).
- **Implementasi (di Web App Manifest):**
  - Tambahkan properti `shortcuts` di dalam `manifest` pada `vite.config.ts`.
  - **Contoh:**
    ```javascript
    manifest: {
      // ...properti lain
      shortcuts: [
        {
          name: 'Lanjutkan Membaca',
          short_name: 'Lanjut Baca',
          description: 'Buka ayat terakhir yang dibaca',
          url: '/last-read', // Rute ini harus mengarahkan ke ayat terakhir
          icons: [{ src: '/icons/shortcut-continue.png', sizes: '192x192' }]
        },
        {
          name: 'Pencarian',
          short_name: 'Cari',
          description: 'Cari ayat atau terjemahan',
          url: '/search',
          icons: [{ src: '/icons/shortcut-search.png', sizes: '192x192' }]
        }
      ]
    }
    ```

## 4. Langkah-langkah Pengerjaan

1.  **[Prioritas Tinggi]** Implementasikan **Prompt Instalasi Kustom** untuk meningkatkan adopsi.
2.  **[Prioritas Sedang]** Tambahkan **Pintasan Aplikasi (App Shortcuts)** karena relatif mudah diimplementasikan melalui manifest dan memberikan nilai tambah yang bagus.
3.  **[Prioritas Sedang]** Implementasikan **Fungsionalitas Offline yang Ditingkatkan** (Download Surah), karena ini adalah fitur inti yang sangat diharapkan dari aplikasi Qur'an.
4.  **[Prioritas Rendah/Kompleks]** Implementasikan **Sinkronisasi Latar Belakang** untuk *bookmark*.
5.  **[Prioritas Rendah/Kompleks]** Implementasikan **Notifikasi Pengingat Membaca** karena memerlukan infrastruktur backend yang signifikan.
