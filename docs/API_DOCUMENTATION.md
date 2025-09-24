# Dokumentasi API Quran API ID

Dokumentasi ini menyediakan panduan lengkap untuk menggunakan endpoint yang tersedia di Quran API ID.

## Base URL

Semua endpoint dalam dokumentasi ini menggunakan base URL berikut: `https://quran-api-id-kappa.vercel.app`

---

## Endpoints

### 1. Informasi & Daftar Endpoint

Menampilkan daftar endpoint yang tersedia beserta informasi proyek.

- **Method:** `GET`
- **Endpoint:** `/`
- **Deskripsi:** Memberikan daftar endpoint yang dapat diakses, informasi maintainer, dan tautan ke repositori sumber.
- **Contoh Response (200 OK):**
  ```json
  {
    "endpoints": [
      {
        "path": "https://quran-api-id-kappa.vercel.app/surahs",
        "description": "get all surah: /surahs"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/surahs/112",
        "description": "get spesifict surah using number surah in quran (1 - 114): /surahs/{numberSurah}"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/surahs/112/ayahs",
        "description": "get all ayah from spesifict surah: /surahs/{numberSurah}/ayahs"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/surahs/112/ayahs/2",
        "description": "get spesifict ayah from spesifict surah: /surahs/{numberSurah}/ayahs/{numberAyah}"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/random",
        "description": "get random ayah: /random"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/juz/1",
        "description": "get all ayahs in a juz: /juz/{juzNumber}"
      },
      {
        "path": "https://quran-api-id-kappa.vercel.app/pages/1",
        "description": "get all ayahs in a page: /pages/{pageNumber}"
      }
    ],
    "maintainer": "R.M. Reza (renomureza@gmail.com)",
    "source": "https://github.com/renomureza/quran-api-id/"
  }
  ```

---

### 2. Surah

Endpoint yang berkaitan dengan data surah Al-Qur'an.

#### a. Dapatkan Semua Surah

- **Method:** `GET`
- **Endpoint:** `/surahs`
- **Deskripsi:** Mengambil daftar ringkas semua 114 surah dalam Al-Qur'an.
- **Contoh Response (200 OK):**
  ```json
  [
    {
      "number": 1,
      "name": "Al-Fatihah",
      "translation": "Pembukaan",
      "revelation": "Makkiyah",
      "numberOfAyahs": 7
    },
    {
      "number": 2,
      "name": "Al-Baqarah",
      "translation": "Sapi Betina",
      "revelation": "Madaniyah",
      "numberOfAyahs": 286
    }
    // ...dan seterusnya hingga 114 surah
  ]
  ```

#### b. Dapatkan Surah Spesifik

- **Method:** `GET`
- **Endpoint:** `/surahs/{surahNumber}`
- **Deskripsi:** Mengambil detail informasi dari satu surah spesifik, termasuk seluruh ayat di dalamnya.
- **Parameter:**
  - `{surahNumber}` (integer, required): Nomor urut surah (1-114).
- **Contoh Response (200 OK) untuk `/surahs/1`:**
  ```json
  {
    "number": 1,
    "numberOfAyahs": 7,
    "name": "Al-Fatihah",
    "translation": "Pembukaan",
    "revelation": "Makkiyah",
    "description": "Surat Al Faatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat...",
    "audio": "https://ia802609.us.archive.org/13/items/quraninindonesia/001AlFaatihah.mp3",
    "bismillah": {
      "arab": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
      "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      "audio": {
        "alafasy": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
        "ahmedajamy": "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/1.mp3",
        "husarymujawwad": "https://cdn.islamic.network/quran/audio/128/ar.husarymujawwad/1.mp3",
        "minshawi": "https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3",
        "muhammadayyoub": "https://cdn.islamic.network/quran/audio/128/ar.muhammadayyoub/1.mp3",
        "muhammadjibreel": "https://cdn.islamic.network/quran/audio/128/ar.muhammadjibreel/1.mp3"
      }
    },
    "ayahs": [
      {
        "number": {
          "inQuran": 1,
          "inSurah": 1
        },
        "arab": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
        "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        "audio": {
          "alafasy": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
          "ahmedajamy": "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/1.mp3",
          "husarymujawwad": "https://cdn.islamic.network/quran/audio/128/ar.husarymujawwad/1.mp3",
          "minshawi": "https://cdn.islamic.network/quran/audio/128/ar.minshawi/1.mp3",
          "muhammadayyoub": "https://cdn.islamic.network/quran/audio/128/ar.muhammadayyoub/1.mp3",
          "muhammadjibreel": "https://cdn.islamic.network/quran/audio/128/ar.muhammadjibreel/1.mp3"
        },
        "image": {
          "primary": "https://cdn.islamic.network/quran/images/1_1.png",
          "secondary": "https://cdn.alquran.cloud/media/image/1/1"
        },
        "tafsir": {
          "kemenag": {
            "short": "Aku memulai bacaan Al-Qur'an dengan menyebut nama Allah...",
            "long": "Surah al-Fatihah dimulai dengan Basmalah..."
          },
          "quraish": "...",
          "jalalayn": "..."
        },
        "meta": {
          "juz": 1,
          "page": 1,
          "manzil": 1,
          "ruku": 1,
          "hizbQuarter": 1,
          "sajda": {
            "recommended": false,
            "obligatory": false
          }
        }
      }
      // ...ayat lainnya dalam surah ini
    ]
  }
  ```

#### c. Dapatkan Semua Ayat dari Surah Spesifik

- **Method:** `GET`
- **Endpoint:** `/surahs/{surahNumber}/ayahs`
- **Deskripsi:** Mengambil daftar semua ayat dari satu surah spesifik.
- **Parameter:**
  - `{surahNumber}` (integer, required): Nomor urut surah (1-114).
- **Contoh Response (200 OK) untuk `/surahs/1/ayahs`:**
  ```json
  [
    {
      "number": {
        "inQuran": 1,
        "inSurah": 1
      },
      "arab": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
      "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
      "audio": {
        "alafasy": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
        "ahmedajamy": "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/1.mp3",
        "..."
      },
      "image": {
        "primary": "https://cdn.islamic.network/quran/images/1_1.png",
        "secondary": "https://cdn.alquran.cloud/media/image/1/1"
      },
      "tafsir": {
        "kemenag": {
          "short": "Aku memulai bacaan Al-Qur'an dengan menyebut nama Allah...",
          "long": "Surah al-Fatihah dimulai dengan Basmalah..."
        },
        "quraish": "...",
        "jalalayn": "..."
      },
      "meta": {
        "juz": 1,
        "page": 1,
        "manzil": 1,
        "ruku": 1,
        "hizbQuarter": 1,
        "sajda": {
          "recommended": false,
          "obligatory": false
        }
      }
    }
    // ...ayat lainnya dalam surah ini
  ]
  ```

#### d. Dapatkan Ayat Spesifik

- **Method:** `GET`
- **Endpoint:** `/surahs/{surahNumber}/ayahs/{ayahNumber}`
- **Deskripsi:** Mengambil data lengkap dari satu ayat spesifik dalam sebuah surah.
- **Parameter:**
  - `{surahNumber}` (integer, required): Nomor urut surah (1-114).
  - `{ayahNumber}` (integer, required): Nomor urut ayat di dalam surah tersebut.
- **Contoh Response (200 OK) untuk `/surahs/1/ayahs/1`:**
  ```json
  {
    "number": {
      "inQuran": 1,
      "inSurah": 1
    },
    "arab": "بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ",
    "translation": "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
    "audio": {
      "alafasy": "https://cdn.islamic.network/quran/audio/128/ar.alafasy/1.mp3",
      "ahmedajamy": "https://cdn.islamic.network/quran/audio/128/ar.ahmedajamy/1.mp3",
      "..."
    },
    "image": {
      "primary": "https://cdn.islamic.network/quran/images/1_1.png",
      "secondary": "https://cdn.alquran.cloud/media/image/1/1"
    },
    "tafsir": {
      "kemenag": {
        "short": "Aku memulai bacaan Al-Qur'an dengan menyebut nama Allah...",
        "long": "Surah al-Fatihah dimulai dengan Basmalah..."
      },
      "quraish": "...",
      "jalalayn": "..."
    },
    "meta": {
      "juz": 1,
      "page": 1,
      "manzil": 1,
      "ruku": 1,
      "hizbQuarter": 1,
      "sajda": {
        "recommended": false,
        "obligatory": false
      }
    }
  }
  ```

---

### 3. Ayat Acak

Endpoint untuk menemukan sebuah ayat secara acak dari seluruh Al-Qur'an.

- **Method:** `GET`
- **Endpoint:** `/random`
- **Deskripsi:** Mengembalikan data lengkap dari satu ayat yang dipilih secara acak.
- **Contoh Response (200 OK):**
  ```json
  // Strukturnya sama dengan response "Dapatkan Ayat Spesifik"
  {
    "number": {
      "inQuran": 4546,
      "inSurah": 3
    },
    "surah": {
        "number": 47,
        "name": "Muhammad",
        "translation": "Nabi Muhammad",
        "revelation": "Madaniyah",
        "numberOfAyahs": 38
    },
    "text": "ذَٰلِكَ بِأَنَّهُمُ اتَّبَعُوا مَا أَسْخَطَ اللَّهَ وَكَرِهُوا رِضْوَانَهُ فَأَحْبَطَ أَعْمَالَهُمْ",
    "translation": "Yang demikian itu karena sesungguhnya mereka mengikuti apa yang menimbulkan kemurkaan Allah dan membenci (apa yang menimbulkan) keridaan-Nya; sebab itu Allah menghapus segala amal mereka.",
    "tafsir": {
        "kemenag": {
            "short": "...",
            "long": "..."
        }
    }
  }
  ```

---

### 4. Juz & Halaman

Endpoint untuk mendapatkan data berdasarkan nomor Juz atau Halaman.

#### a. Dapatkan Berdasarkan Juz

- **Method:** `GET`
- **Endpoint:** `/juz/{juzNumber}`
- **Deskripsi:** Mengambil semua ayat dalam juz tertentu, dikelompokkan berdasarkan surah.
- **Parameter:**
  - `{juzNumber}` (integer, required): Nomor juz (1-30).
- **Contoh Response (200 OK) untuk `/juz/1`:**
  ```json
  [
    {
      "number": 1,
      "name": "Al-Fatihah",
      "translation": "Pembukaan",
      "revelation": "Makkiyah",
      "numberOfAyahs": 7,
      "ayahs": [
        {
          "number": { "inQuran": 1, "inSurah": 1 },
          "meta": { "juz": 1, "page": 1, ... },
          "..."
        }
        // ...ayat lainnya di juz ini dari surah ini
      ]
    },
    {
      "number": 2,
      "name": "Al-Baqarah",
      "translation": "Sapi Betina",
      "revelation": "Madaniyah",
      "numberOfAyahs": 286,
      "ayahs": [
        {
          "number": { "inQuran": 2, "inSurah": 1 },
          "meta": { "juz": 1, "page": 2, ... },
          "..."
        }
        // ...ayat lainnya di juz ini dari surah ini
      ]
    }
    // ...surah lainnya dalam juz ini
  ]
  ```

#### b. Dapatkan Berdasarkan Halaman

- **Method:** `GET`
- **Endpoint:** `/pages/{pageNumber}`
- **Deskripsi:** Mengambil semua ayat dalam halaman tertentu, dikelompokkan berdasarkan surah.
- **Parameter:**
  - `{pageNumber}` (integer, required): Nomor halaman (1-604).
- **Contoh Response (200 OK) untuk `/pages/1`:**
  ```json
  [
    {
      "number": 1,
      "name": "Al-Fatihah",
      "translation": "Pembukaan",
      "revelation": "Makkiyah",
      "numberOfAyahs": 7,
      "ayahs": [
        {
          "number": { "inQuran": 1, "inSurah": 1 },
          "meta": { "juz": 1, "page": 1, ... },
          "..."
        }
        // ...ayat lainnya di halaman ini dari surah ini
      ]
    }
  ]
  ```

---

### Struktur Error

Jika terjadi kesalahan (misalnya, data tidak ditemukan), respons akan mengikuti format berikut:

```json
{
  "code": <KODE_STATUS_HTTP>,
  "message": "<PESAN_ERROR>"
}
```
- **Contoh Response (404 Not Found) untuk `/surahs/999`:**
  ```json
  {
    "code": 404,
    "message": "Surah not found"
  }
  ```
