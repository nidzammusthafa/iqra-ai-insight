# Product Requirements Document (PRD)

**Produk:** Quran Frontend
**Versi Dokumen:** 2.0
**Tanggal:** 21 September 2025

---

## Log Perubahan

**v2.0 (21 Sep 2025):**

- **Mobile-First:** Navigasi bawah (bottom tab bar) & kontrol dioptimalkan untuk perangkat mobile.
- **Fitur AI Baru:** "Wawasan Ayat" dengan konteks (Asbabun Nuzul, Hadits terkait, Tafsir singkat, dll.).
- **Pengalaman Membaca:** Fitur buka-tutup terjemahan.
- **Aksesibilitas:** Semua fitur (termasuk AI) ramah aksesibilitas.
- **Risiko Baru:** Akurasi AI, biaya operasional, ketergantungan API eksternal.
- **Arsitektur:** Tambahan backend & model AI (LLM).
- **Definisi Data:** Menambahkan type definition untuk menjaga konsistensi antar modul.

---

## 1. Visi & Strategi Produk

### 1.1. Latar Belakang

Quran Frontend berevolusi dari sekadar pembaca digital menjadi **pendamping studi Al-Qur’an berbasis AI**. Target utamanya adalah pengguna mobile yang menginginkan pengalaman cepat, intuitif, dan kontekstual tanpa harus membuka banyak sumber.

### 1.2. Tujuan Produk

- **Mobile-First UX:** Navigasi natural, antarmuka bersih.
- **Pemahaman Mendalam:** Wawasan ayat berbasis AI.
- **Fokus Membaca:** Kontrol untuk buka-tutup terjemahan.
- **Aksesibilitas:** Semua fitur ramah aksesibilitas.

### 1.3. Proposisi Nilai Unik (UVP)

_"Quran Frontend adalah aplikasi studi Al-Qur’an mobile-first yang memberikan wawasan ayat mendalam melalui AI, mengubah cara Anda membaca dan memahami kitab suci."_

---

## 2. Fitur & Fungsionalitas

### 2.1. Desain Mobile-First

- Navigasi bawah: **Qur’an**, **Hadits**, **Cari**.
- Kontrol interaksi mudah dijangkau (share, audio, wawasan AI).
- Fitur **toggle terjemahan** ayat.

### 2.2. Modul Al-Qur’an

- Daftar surah (114).
- Tampilan per ayat.
- **Wawasan Ayat (AI Panel):**

  - Asbabun Nuzul
  - Hadits Terkait
  - Tafsir Ringkas & Konteks Sejarah
  - Hubungan antar ayat

### 2.3. Modul Hadits

- Daftar perawi & navigasi standar.
- Pencarian bahasa natural dengan AI.

### 2.4. Fitur Umum

- Tema terang/gelap
- Responsif
- Sharing
- Loading indicator
- Error handling

---

## 3. Kebutuhan Non-Fungsional

- **Performa:** Respon AI ≤ 3 detik.
- **Aksesibilitas:** Heading/list semantik, toggle bisa dengan keyboard.
- **Kompatibilitas:** Browser modern.

---

## 4. Arsitektur & Teknologi

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS 4, Zustand, Shadcn UI.
- **Backend:** Node.js/Python untuk middleware & caching AI.
- **Model AI:** LLM khusus data Islam (tafsir, hadits, sejarah).

---

## 5. Definisi API Endpoint

### 5.1. Quran & Hadits API (Statis)

- **URL:** [quran-api2.vercel.app](https://quran-api2.vercel.app)

### 5.2. AI API (Baru)

#### `POST /api/ai/verse-insight`

Request:

```json
{ "surah_number": 2, "ayah_number": 255 }
```

Response:

```json
{
  "asbabun_nuzul": "...",
  "related_hadits": [{ "hadits_number": "HR. Bukhari 1", "text": "..." }],
  "tafsir_summary": "...",
  "historical_context": "..."
}
```

#### `POST /api/ai/search-hadits`

Request:

```json
{ "query": "hadits tentang shalat" }
```

Response:

```json
[{ "hadits_number": "HR. Muslim 12", "text": "..." }]
```

---

## 6. Ketergantungan & Risiko

- **Akurasi AI:** Salah konteks → mitigasi dengan fine-tuning, disclaimer, review ahli.
- **Biaya AI:** Panggilan LLM mahal → caching agresif.
- **API Statis:** Risiko downtime → fallback mekanisme.

---

## 7. Ruang Lingkup di Luar MVP

- Audio Qur’an
- Bookmark
- Tampilan per Juz/Halaman
- Chatbot AI interaktif

---

## 8. Definisi Tipe Data (TypeScript)

```ts
// Nama surah dalam berbagai bahasa
export type NameTranslation = {
  ar: string;
  en: string;
  id: string;
};

// Data audio tilawah
export type Recitation = {
  name: string;
  audio_url: string;
};

// Representasi ayat
export type Verse = {
  number: number;
  text: string;
  translation_en?: string;
  translation_id?: string;
};

// Response umum untuk daftar surat
export type SuratResponse = {
  name: string;
  name_translations: NameTranslation;
  number_of_ayah: number;
  number_of_surah: number;
  place?: string;
  recitation?: string;
  type?: string;
  url?: string;
};

// Struktur tafsir
export type TafsirText = {
  [key: string]: string;
};

export type TafsirSource = {
  name: string;
  source: string;
  text: TafsirText;
};

export type TafsirID = {
  id: {
    kemenag: TafsirSource;
  };
};

// Response detail 1 surat
export interface OneSuratResponse extends SuratResponse {
  recitations: Recitation[];
  type: string;
  verses: Verse[];
  tafsir: TafsirID;
}

// Response ayat tunggal
export type GetAyatResponse = {
  number: number;
  text: string;
  translation_en: string;
  translation_id: string;
};

// Pilihan bahasa terjemahan
export enum TranslationId {
  AR = "ar",
  ID = "id",
  EN = "en",
}

// Query untuk pencarian ayat
export type SearchAyatQuery = {
  query: string;
  page: number;
  size: number;
  translationId: TranslationId;
};
```

---

Dengan ini PRD + type definition udah **nyambung**:

- **Modul Qur’an & Hadits** → pakai `SuratResponse`, `OneSuratResponse`, `Verse`, `GetAyatResponse`.
- **Fitur Pencarian AI** → pakai `SearchAyatQuery`.
- **Integrasi AI API** → hasilnya bisa langsung dikombinasikan dengan struktur di atas.
