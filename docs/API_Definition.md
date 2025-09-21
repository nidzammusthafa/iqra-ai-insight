# Definisi API: Quran & Hadits API (quran-api2)

**Versi Dokumen:** 1.0
**Tanggal:** 21 September 2025
**Base URL:** `https://quran-api2.vercel.app`

---

## Pendahuluan

Dokumen ini mendefinisikan endpoint API yang tersedia pada proyek `quran-api2`. API ini menyediakan data Al-Qur'an (surah, ayat, terjemahan) dan data Hadits (perawi, list hadits, hadits tunggal).

Parameter `:translationId` pada umumnya mendukung nilai `id`, `en`, dan `ar`.

---

## 1. Endpoint Al-Qur'an

### 1.1. Mendapatkan Daftar Semua Surah
- **Endpoint:** `GET /api/list-surat`
- **Deskripsi:** Mengambil daftar lengkap 114 surah beserta informasi dasarnya.
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/list-surat
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "data": [
      {
        "name": "Al-Fatiha",
        "name_translations": {
          "ar": "الفاتحة",
          "en": "The Opening",
          "id": "Pembukaan"
        },
        "number_of_ayah": 7,
        "number_of_surah": 1,
        "place": "Mecca",
        "type": "Makkiyah"
      },
      // ...surah lainnya
    ]
  }
  ```

### 1.2. Mendapatkan Detail Satu Surah
- **Endpoint:** `GET /api/:translationId/surat/:surat`
- **Deskripsi:** Mengambil detail lengkap satu surah, termasuk daftar ayat dan terjemahannya.
- **Parameter Path:**
  - `:translationId`: Bahasa terjemahan (cth: `id`).
  - `:surat`: Nomor urut surah (cth: `1`).
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/id/surat/1
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "data": {
      "name": "Al-Fatiha",
      "number_of_surah": 1,
      "verses": [
        {
          "number": 1,
          "text": "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
          "translation_id": "Dengan menyebut nama Allah Yang Maha Pemurah lagi Maha Penyayang."
        }
        // ...ayat lainnya
      ]
    }
  }
  ```

### 1.3. Pencarian Surah atau Ayat (Global)
- **Endpoint:** `GET /api/:translationId/surat`
- **Deskripsi:** Endpoint ini memiliki dua fungsi berdasarkan query parameter:
  1.  Mencari surah berdasarkan nama (jika menggunakan `?surat=`).
  2.  Mencari ayat di seluruh Al-Qur'an berdasarkan kata kunci terjemahan (jika menggunakan `?terjemah=`).
- **Parameter Path:**
  - `:translationId`: Bahasa terjemahan (cth: `id`).
- **Parameter Query:**
  - `surat` (opsional): Kata kunci nama surah (cth: `baqarah`).
  - `terjemah` (opsional): Kata kunci terjemahan ayat (cth: `puasa`).
  - `page` (opsional): Nomor halaman untuk paginasi.
  - `size` (opsional): Jumlah data per halaman.
- **Contoh Permintaan (Cari Surah):**
  ```
  https://quran-api2.vercel.app/api/id/surat?surat=al-fatihah
  ```
- **Contoh Permintaan (Cari Ayat):**
  ```
  https://quran-api2.vercel.app/api/id/surat?terjemah=neraka&size=5
  ```

### 1.4. Pencarian Ayat dalam Satu Surah
- **Endpoint:** `GET /api/:translationId/surat/ayat/:surat`
- **Deskripsi:** Mencari ayat berdasarkan kata kunci dalam satu surah spesifik.
- **Parameter Path:**
  - `:translationId`: Bahasa terjemahan (cth: `id`).
  - `:surat`: Nomor urut surah (cth: `2`).
- **Parameter Query:**
  - `query`: Kata kunci pencarian ayat.
  - `page` (opsional): Nomor halaman.
  - `size` (opsional): Jumlah data per halaman.
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/id/surat/ayat/2?query=Allah
  ```

---

## 2. Endpoint Hadits

### 2.1. Mendapatkan Informasi Perawi
- **Endpoint:** `GET /api/:translationId/hadits/info`
- **Deskripsi:** Mengambil daftar perawi hadits yang tersedia beserta jumlah total haditsnya.
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/id/hadits/info
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "data": [
      { "name": "Abu Dawud", "slug": "abu-dawud", "total": 4419 },
      { "name": "Ahmad", "slug": "ahmad", "total": 4305 },
      { "name": "Bukhari", "slug": "bukhari", "total": 6638 }
      // ...perawi lainnya
    ]
  }
  ```

### 2.2. Mendapatkan Hadits Berdasarkan Perawi
- **Endpoint:** `GET /api/:translationId/hadits/:rawi`
- **Deskripsi:** Mengambil daftar hadits dari seorang perawi dengan paginasi.
- **Parameter Path:**
  - `:translationId`: Bahasa (selalu `id` untuk hadits).
  - `:rawi`: Slug perawi (cth: `bukhari`).
- **Parameter Query:**
  - `page` (opsional): Nomor halaman.
  - `size` (opsional): Jumlah data per halaman (default 10).
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/id/hadits/bukhari?size=5&page=1
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "data": [
      {
        "number": 1,
        "arab": "...",
        "id": "..."
      }
      // ...hadits lainnya
    ]
  }
  ```

### 2.3. Mendapatkan Detail Satu Hadits
- **Endpoint:** `GET /api/:translationId/hadits/:rawi/:hadits`
- **Deskripsi:** Mengambil satu hadits spesifik berdasarkan perawi dan nomornya.
- **Parameter Path:**
  - `:translationId`: Bahasa (selalu `id` untuk hadits).
  - `:rawi`: Slug perawi (cth: `bukhari`).
  - `:hadits`: Nomor hadits.
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api/id/hadits/bukhari/50
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "data": {
      "number": 50,
      "arab": "...",
      "id": "..."
    }
  }
  ```

---

## 3. Endpoint Umum

### 3.1. Root Endpoint
- **Endpoint:** `GET /api`
- **Deskripsi:** Endpoint dasar yang memberikan pesan selamat datang.
- **Contoh Permintaan:**
  ```
  https://quran-api2.vercel.app/api
  ```
- **Contoh Respons (`200 OK`):
  ```json
  {
    "intro": "بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم"
  }
  ```
