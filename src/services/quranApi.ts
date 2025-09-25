/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  SurahListItem,
  SingleSurahResponse,
  TranslationId,
  ApiResponse,
} from "@/types/quran";

// Base URL sesuai dengan dokumentasi API yang baru
const BASE_URL = "https://quran-api-id-kappa.vercel.app";
const LEGACY_SEARCH_API_URL = "https://quran-api2.vercel.app/api";

class QuranApiService {
  /**
   * Mengambil daftar ringkas semua 114 surah.
   * @returns {Promise<SurahListItem[]>} Daftar surah.
   */
  async getSuratList(): Promise<SurahListItem[]> {
    const response = await fetch(`${BASE_URL}/surahs`);
    if (!response.ok) {
      throw new Error("Failed to fetch surah list");
    }
    const data: SurahListItem[] = await response.json();
    return data;
  }

  /**
   * Mengambil detail informasi dari satu surah spesifik, termasuk seluruh ayat di dalamnya.
   * @param {number} surahNumber - Nomor urut surah (1-114).
   * @returns {Promise<SingleSurahResponse>} Detail surah.
   */
  async getSuratDetail(surahNumber: number): Promise<SingleSurahResponse> {
    const response = await fetch(`${BASE_URL}/surahs/${surahNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${surahNumber}`);
    }
    const data: SingleSurahResponse = await response.json();
    return data;
  }

  /**
   * Mengambil semua ayat dalam juz tertentu.
   * @param {number} juzNumber - Nomor juz (1-30).
   * @returns {Promise<any>} Data juz.
   */
  async getJuz(juzNumber: number): Promise<any> {
    // Ganti 'any' dengan tipe data yang lebih spesifik jika sudah dibuat
    const response = await fetch(`${BASE_URL}/juz/${juzNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch juz ${juzNumber}`);
    }
    return response.json();
  }

  /**
   * Mengambil semua ayat dalam halaman tertentu.
   * @param {number} pageNumber - Nomor halaman (1-604).
   * @returns {Promise<any>} Data halaman.
   */
  async getPage(pageNumber: number): Promise<any> {
    // Ganti 'any' dengan tipe data yang lebih spesifik jika sudah dibuat
    const response = await fetch(`${BASE_URL}/pages/${pageNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page ${pageNumber}`);
    }
    return response.json();
  }

  /**
   * Mengambil daftar surah dengan nama Arab dari API lama.
   * @returns {Promise<any[]>} Daftar surah.
   */
  async getSuratListWithArabicNames(): Promise<any[]> {
    const response = await fetch(`https://quran-api2.vercel.app/api/list-surat`);
    if (!response.ok) {
      throw new Error("Failed to fetch surah list with Arabic names");
    }
    const data = await response.json();
    return data.data; // The actual list is in the 'data' property
  }

  // Search verses globally (Legacy API)
  async searchVerses(
    query: string,
    translationId: TranslationId = TranslationId.ID,
    page: number = 1,
    size: number = 50
  ): Promise<any[]> {
    const params = new URLSearchParams({
      terjemah: query,
      page: page.toString(),
      size: size.toString(),
    });

    const response = await fetch(
      `${LEGACY_SEARCH_API_URL}/${translationId}/surat?${params}`
    );
    if (!response.ok) {
      throw new Error("Failed to search verses");
    }
    const data: ApiResponse<any[]> = await response.json();
    return data.data;
  }

  // Search surahs by name (Legacy API)
  async searchSurats(
    query: string,
    translationId: TranslationId = TranslationId.ID
  ): Promise<any[]> {
    const params = new URLSearchParams({
      surat: query,
    });

    const response = await fetch(
      `${LEGACY_SEARCH_API_URL}/${translationId}/surat?${params}`
    );
    if (!response.ok) {
      throw new Error("Failed to search surahs");
    }
    const data: ApiResponse<any[]> = await response.json();
    return data.data;
  }
}

export const quranApi = new QuranApiService();
