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

// Hadits types
export type HaditsPerawi = {
  name: string;
  slug: string;
  total: number;
};

export type Hadits = {
  number: number;
  arab: string;
  id: string;
};

// AI Insights types
export type VerseInsight = {
  asbabun_nuzul?: string;
  related_hadits?: {
    hadits_number: string;
    text: string;
    source: string;
  }[];
  tafsir_summary?: string;
  historical_context?: string;
  related_verses?: {
    surah_number: number;
    ayah_number: number;
    text: string;
    connection: string;
  }[];
};

// API Response wrappers
export type ApiResponse<T> = {
  data: T;
};

export type ApiListResponse<T> = {
  data: T[];
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
};