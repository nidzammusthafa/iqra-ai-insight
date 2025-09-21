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

// Representasi ayat (NEW STRUCTURE)
export type Verse = {
  number: { inQuran: number; inSurah: number };
  arab: string;
  translation: string;
  audio: { [key: string]: string };
  text?: string; // for fallback
  translation_id?: string; // for fallback
};

export type SurahListItem = {
  number: number;
  numberOfAyahs: number;
  name: string;
  translation: string;
  revelation: string;
  description: string;
  audio: string;
};

// Response umum untuk daftar surat (OLD API)
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

// Response detail 1 surat (NEW API)
export type SingleSurahResponse = {
  number: number;
  numberOfAyahs: number;
  name: string;
  translation: string;
  revelation: string;
  description: string;
  audio: string;
  bismillah: {
    arab: string;
    translation: string;
    audio: { [key: string]: string };
  };
  ayahs: Verse[];
  // for fallback from old OneSuratResponse
  verses?: Verse[]; 
  name_translations?: NameTranslation;
  number_of_ayah?: number;
  number_of_surah?: number;
};

// Old response detail, kept for reference or other parts of app
export interface OneSuratResponse extends SuratResponse {
  recitations: Recitation[];
  type: string;
  verses: Verse[];
  tafsir: TafsirID;
}

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

// Enhanced AI Insights types with Gemini integration
export type VerseInsight = {
  asbabun_nuzul?: string;
  related_hadits?: {
    hadits_number: string;
    text: string;
    source: string;
    relevance?: string;
  }[];
  tafsir_summary?: string;
  historical_context?: string;
  related_verses?: {
    surah_number: number;
    ayah_number: number;
    text?: string;
    connection: string;
  }[];
  practical_wisdom?: string;
  key_themes?: string[];
};

export const QARIS = [
  "alafasy",
  "ahmedajamy",
  "husarymujawwad",
  "minshawi",
  "muhammadayyoub",
  "muhammadjibreel",
] as const;

export type Qari = typeof QARIS[number];

// Reading preferences
export type ReadingPreferences = {
  arabicFontSize: 'small' | 'medium' | 'large' | 'xl';
  translationFontSize: 'small' | 'medium' | 'large';
  showTranslation: boolean;
  defaultTranslation: TranslationId;
  lineSpacing: 'compact' | 'normal' | 'relaxed';
  theme: 'light' | 'dark' | 'auto';
  selectedQari: Qari;
};

// Bookmark types
export type Bookmark = {
  id: string;
  surahNumber: number;
  verseNumber: number;
  surahName: string;
  verseText: string;
  verseTranslation: string;
  note?: string;
  createdAt: string;
  tags?: string[];
};

export type BookmarkFolder = {
  id: string;
  name: string;
  color: string;
  bookmarkIds: string[];
  createdAt: string;
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