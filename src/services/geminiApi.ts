import { VerseInsight } from '@/types/quran';

export interface GeminiApiConfig {
  apiKey: string;
  model?: string;
}

class GeminiApiService {
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models';
  private defaultModel = 'gemini-2.0-flash-exp';

  async generateVerseInsight(
    surahNumber: number,
    verseNumber: number,
    verseText: string,
    verseTranslation: string,
    config: GeminiApiConfig
  ): Promise<VerseInsight> {
    const prompt = this.buildInsightPrompt(surahNumber, verseNumber, verseText, verseTranslation);
    
    const response = await fetch(
      `${this.baseUrl}/${config.model || this.defaultModel}:generateContent?key=${config.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.3,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Gemini API Error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!generatedText) {
      throw new Error('No response generated from Gemini');
    }

    return this.parseInsightResponse(generatedText);
  }

  private buildInsightPrompt(
    surahNumber: number,
    verseNumber: number,
    verseText: string,
    verseTranslation: string
  ): string {
    return `Sebagai seorang ahli tafsir Al-Qur'an dan hadits, berikan analisis mendalam untuk ayat berikut:

**Ayat:** QS. ${surahNumber}:${verseNumber}
**Teks Arab:** ${verseText}
**Terjemahan:** ${verseTranslation}

Berikan respons dalam format JSON dengan struktur berikut:

{
  "asbabun_nuzul": "Jelaskan latar belakang turunnya ayat ini dengan detail historis",
  "tafsir_summary": "Penjelasan makna ayat secara komprehensif menurut para mufassir",
  "historical_context": "Konteks sejarah dan situasi pada masa turunnya ayat",
  "related_hadits": [
    {
      "hadits_number": "Nomor hadits (contoh: HR. Bukhari 123)",
      "text": "Teks hadits yang relevan",
      "source": "Sumber hadits",
      "relevance": "Penjelasan keterkaitan dengan ayat"
    }
  ],
  "related_verses": [
    {
      "surah_number": 2,
      "ayah_number": 155,
      "text": "Teks ayat terkait (jika ada)",
      "connection": "Penjelasan hubungan dengan ayat utama"
    }
  ],
  "practical_wisdom": "Hikmah praktis yang bisa diambil untuk kehidupan sehari-hari",
  "key_themes": ["tema1", "tema2", "tema3"]
}

PENTING: 
- Pastikan informasi akurat berdasarkan sumber-sumber tafsir yang terpercaya
- Jika tidak ada asbabun nuzul khusus, jelaskan konteks umum
- Sertakan minimal 1-2 hadits yang relevan jika memungkinkan
- Berikan respons dalam Bahasa Indonesia yang mudah dipahami
- Respons harus berupa JSON yang valid`;
  }

  private parseInsightResponse(responseText: string): VerseInsight {
    try {
      // Clean the response text - remove markdown code blocks if present
      const cleanedText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      const parsed = JSON.parse(cleanedText);
      
      return {
        asbabun_nuzul: parsed.asbabun_nuzul || '',
        tafsir_summary: parsed.tafsir_summary || '',
        historical_context: parsed.historical_context || '',
        related_hadits: parsed.related_hadits || [],
        related_verses: parsed.related_verses || [],
        practical_wisdom: parsed.practical_wisdom || '',
        key_themes: parsed.key_themes || []
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      
      // Fallback parsing - extract information using regex if JSON parsing fails
      return this.fallbackParsing(responseText);
    }
  }

  private fallbackParsing(text: string): VerseInsight {
    return {
      asbabun_nuzul: this.extractSection(text, 'asbabun_nuzul') || 'Informasi asbabun nuzul tidak tersedia.',
      tafsir_summary: this.extractSection(text, 'tafsir_summary') || 'Tafsir tidak tersedia.',
      historical_context: this.extractSection(text, 'historical_context') || 'Konteks sejarah tidak tersedia.',
      related_hadits: [],
      related_verses: [],
      practical_wisdom: this.extractSection(text, 'practical_wisdom') || '',
      key_themes: []
    };
  }

  private extractSection(text: string, section: string): string | null {
    const regex = new RegExp(`"${section}"\\s*:\\s*"([^"]*)"`, 'i');
    const match = text.match(regex);
    return match ? match[1] : null;
  }

  // Validate API key format
  static validateApiKey(apiKey: string): boolean {
    return apiKey.startsWith('AIza') && apiKey.length > 30;
  }
}

export const geminiApi = new GeminiApiService();
export { GeminiApiService };