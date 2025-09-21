import { 
  ApiResponse, 
  ApiListResponse, 
  SuratResponse, 
  OneSuratResponse,
  HaditsPerawi,
  Hadits,
  TranslationId 
} from '@/types/quran';

const BASE_URL = 'https://quran-api2.vercel.app/api';

class QuranApiService {
  // Get list of all surahs
  async getSuratList(): Promise<SuratResponse[]> {
    const response = await fetch(`${BASE_URL}/list-surat`);
    if (!response.ok) {
      throw new Error('Failed to fetch surat list');
    }
    const data: ApiResponse<SuratResponse[]> = await response.json();
    return data.data;
  }

  // Get detailed surah with verses
  async getSuratDetail(
    suratNumber: number, 
    translationId: TranslationId = TranslationId.ID
  ): Promise<OneSuratResponse> {
    const response = await fetch(`${BASE_URL}/${translationId}/surat/${suratNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${suratNumber}`);
    }
    const data: ApiResponse<OneSuratResponse> = await response.json();
    return data.data;
  }

  // Search verses globally
  async searchVerses(
    query: string, 
    translationId: TranslationId = TranslationId.ID,
    page: number = 1,
    size: number = 10
  ): Promise<any[]> {
    const params = new URLSearchParams({
      terjemah: query,
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await fetch(`${BASE_URL}/${translationId}/surat?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search verses');
    }
    const data: ApiResponse<any[]> = await response.json();
    return data.data;
  }

  // Search surahs by name
  async searchSurats(
    query: string,
    translationId: TranslationId = TranslationId.ID
  ): Promise<any[]> {
    const params = new URLSearchParams({
      surat: query
    });
    
    const response = await fetch(`${BASE_URL}/${translationId}/surat?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search surahs');
    }
    const data: ApiResponse<any[]> = await response.json();
    return data.data;
  }

  // Search verses within a specific surah
  async searchVersesInSurah(
    suratNumber: number,
    query: string,
    translationId: TranslationId = TranslationId.ID,
    page: number = 1,
    size: number = 10
  ): Promise<any[]> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await fetch(`${BASE_URL}/${translationId}/surat/ayat/${suratNumber}?${params}`);
    if (!response.ok) {
      throw new Error('Failed to search verses in surah');
    }
    const data: ApiResponse<any[]> = await response.json();
    return data.data;
  }

  // Get hadits narrator info
  async getHaditsPerawiInfo(translationId: TranslationId = TranslationId.ID): Promise<HaditsPerawi[]> {
    const response = await fetch(`${BASE_URL}/${translationId}/hadits/info`);
    if (!response.ok) {
      throw new Error('Failed to fetch hadits perawi info');
    }
    const data: ApiResponse<HaditsPerawi[]> = await response.json();
    return data.data;
  }

  // Get hadits by narrator
  async getHaditsByPerawi(
    rawi: string,
    page: number = 1,
    size: number = 10,
    translationId: TranslationId = TranslationId.ID
  ): Promise<Hadits[]> {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString()
    });
    
    const response = await fetch(`${BASE_URL}/${translationId}/hadits/${rawi}?${params}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hadits by ${rawi}`);
    }
    const data: ApiResponse<Hadits[]> = await response.json();
    return data.data;
  }

  // Get specific hadits
  async getHaditsDetail(
    rawi: string,
    haditsNumber: number,
    translationId: TranslationId = TranslationId.ID
  ): Promise<Hadits> {
    const response = await fetch(`${BASE_URL}/${translationId}/hadits/${rawi}/${haditsNumber}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch hadits ${haditsNumber} from ${rawi}`);
    }
    const data: ApiResponse<Hadits> = await response.json();
    return data.data;
  }
}

export const quranApi = new QuranApiService();