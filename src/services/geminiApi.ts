import { GoogleGenAI, Type } from "@google/genai";
import { VerseInsight } from "@/types/quran";
import { HadithSearchResult } from "@/types/hadits";

export interface GeminiApiConfig {
  apiKey: string;
  model?: string;
}

const verseInsightSchema = {
  type: Type.OBJECT,
  properties: {
    asbabun_nuzul: {
      type: Type.STRING,
      description:
        "Jelaskan latar belakang turunnya ayat ini dengan detail historis. Jika tidak ada asbabun nuzul khusus, jelaskan konteks umum.",
    },
    tafsir_summary: {
      type: Type.STRING,
      description:
        "Penjelasan makna ayat secara komprehensif menurut para mufassir terpercaya (seperti Ibn Kathir, Jalalayn).",
    },
    historical_context: {
      type: Type.STRING,
      description: "Konteks sejarah dan situasi pada masa turunnya ayat.",
    },
    related_hadits: {
      type: Type.ARRAY,
      description: "Daftar 1-2 hadits yang relevan dengan ayat ini.",
      items: {
        type: Type.OBJECT,
        properties: {
          hadits_number: {
            type: Type.STRING,
            description: "Nomor hadits (contoh: HR. Bukhari 123)",
          },
          text: { type: Type.STRING, description: "Teks hadits yang relevan" },
          source: { type: Type.STRING, description: "Sumber hadits" },
          relevance: {
            type: Type.STRING,
            description: "Penjelasan keterkaitan dengan ayat",
          },
        },
        required: ["hadits_number", "text", "source", "relevance"],
      },
    },
    related_verses: {
      type: Type.ARRAY,
      description:
        "Daftar ayat-ayat lain dalam Al-Qur'an yang memiliki tema atau konteks serupa.",
      items: {
        type: Type.OBJECT,
        properties: {
          surah_number: {
            type: Type.NUMBER,
            description: "Nomor surah dari ayat terkait",
          },
          ayah_number: { type: Type.NUMBER, description: "Nomor ayat terkait" },
          text: { type: Type.STRING, description: "Teks ayat terkait" },
          connection: {
            type: Type.STRING,
            description: "Penjelasan hubungan dengan ayat utama",
          },
        },
        required: ["surah_number", "ayah_number", "text", "connection"],
      },
    },
    practical_wisdom: {
      type: Type.STRING,
      description:
        "Hikmah praktis atau pelajaran yang bisa diambil dari ayat ini untuk kehidupan sehari-hari.",
    },
    key_themes: {
      type: Type.ARRAY,
      description: "Daftar tema-tema kunci yang dibahas dalam ayat ini.",
      items: { type: Type.STRING },
    },
  },
  required: [
    "asbabun_nuzul",
    "tafsir_summary",
    "historical_context",
    "related_hadits",
    "related_verses",
    "practical_wisdom",
    "key_themes",
  ],
};

const hadithSearchSchema = {
  type: Type.ARRAY,
  description: "Daftar 5 hadits yang paling relevan dengan topik pencarian.",
  items: {
    type: Type.OBJECT,
    properties: {
      rawi: {
        type: Type.STRING,
        description:
          "Nama perawi hadits dalam format slug (contoh: bukhari, muslim, ahmad).",
      },
      hadits_number: {
        type: Type.NUMBER,
        description: "Nomor hadits yang relevan.",
      },
      text: {
        type: Type.STRING,
        description: "Teks hadits dalam Bahasa Indonesia.",
      },
    },
    required: ["rawi", "hadits_number", "text"],
  },
};

const verseSearchSchema = {
  type: Type.ARRAY,
  description:
    "Daftar 1-5 ayat yang paling relevan dengan deskripsi pencarian.",
  items: {
    type: Type.OBJECT,
    properties: {
      surah_name: {
        type: Type.STRING,
        description: "Nama surah.",
      },
      surah_number: {
        type: Type.NUMBER,
        description: "Nomor surah.",
      },
      verse_number: {
        type: Type.NUMBER,
        description: "Nomor ayat.",
      },
      verse_text: {
        type: Type.STRING,
        description: "Teks ayat dalam bahasa Arab.",
      },
      verse_translation: {
        type: Type.STRING,
        description: "Terjemahan ayat dalam bahasa Indonesia.",
      },
    },
    required: [
      "surah_name",
      "surah_number",
      "verse_number",
      "verse_text",
      "verse_translation",
    ],
  },
};

export const generateVerseInsight = async (
  surahNumber: number,
  verseNumber: number,
  verseText: string,
  verseTranslation: string,
  config: GeminiApiConfig
): Promise<VerseInsight> => {
  if (!config.apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const modelName = config.model || "gemini-1.5-flash";

  const prompt = `Sebagai seorang ahli tafsir Al-Qur'an dan hadits, berikan analisis mendalam untuk ayat berikut dalam format JSON yang terstruktur. Pastikan semua informasi akurat dan bersumber dari referensi yang terpercaya, dan sajikan dalam Bahasa Indonesia.

**Ayat:** QS. ${surahNumber}:${verseNumber}
**Teks Arab:** ${verseText}
**Terjemahan:** ${verseTranslation}`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: verseInsightSchema,
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as VerseInsight;
  } catch (error) {
    console.error("Error generating verse insight from Gemini:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(`Failed to get insight from Gemini. ${errorMessage}`);
  }
};

export const searchHadithByTopic = async (
  topic: string,
  config: GeminiApiConfig
): Promise<HadithSearchResult[]> => {
  if (!config.apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const modelName = config.model || "gemini-1.5-flash";

  const prompt = `Anda adalah mesin pencari hadits yang canggih. Cari dan kembalikan 5 hadits yang paling relevan berdasarkan topik berikut: "${topic}". Respons harus dalam format JSON array, di mana setiap objek berisi rawi (slug), nomor hadits, dan teks terjemahan bahasa Indonesia.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: hadithSearchSchema,
        temperature: 0.5,
      },
    });
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as HadithSearchResult[];
  } catch (error) {
    console.error("Error searching hadith with AI:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(`Gagal mencari hadits. ${errorMessage}`);
  }
};

export const searchVerseByDescription = async (
  description: string,
  config: GeminiApiConfig
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any[]> => {
  if (!config.apiKey) {
    throw new Error("Gemini API key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: config.apiKey });
  const modelName = config.model || "gemini-1.5-flash";

  const prompt = `Anda adalah mesin pencari Al-Qur'an yang canggih. Cari dan kembalikan 1-5 ayat yang paling relevan berdasarkan deskripsi berikut: "${description}". Respons harus dalam format JSON array, di mana setiap objek berisi nama surah, nomor surah, nomor ayat, teks ayat dalam bahasa Arab, dan terjemahan ayat dalam bahasa Indonesia.`;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: verseSearchSchema,
        temperature: 0.5,
      },
    });
    const jsonText = response.text.trim();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = JSON.parse(jsonText) as any[];

    // Transform the results to match the format of searchVerses
    return results.map((result) => ({
      name: result.surah_name,
      number_of_surah: result.surah_number,
      number_of_ayah: 0, // Not available from Gemini
      name_translations: {
        id: result.surah_name,
        en: result.surah_name,
        ar: result.surah_name,
      },
      verses: [
        {
          number: result.verse_number,
          text: result.verse_text,
          translation_id: result.verse_translation,
        },
      ],
      url: `Q.S.${result.surah_number}:${result.verse_number}`,
    }));
  } catch (error) {
    console.error("Error searching verse with AI:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    throw new Error(`Gagal mencari ayat. ${errorMessage}`);
  }
};

export const validateApiKey = (apiKey: string): boolean => {
  return apiKey.startsWith("AIza") && apiKey.length > 30;
};
