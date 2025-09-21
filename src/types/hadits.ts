export interface Hadith {
  number: number;
  arab: string;
  id: string;
}

export interface SingleHadithData {
  name: string;
  slug: string;
  total: number;
  hadith: Hadith;
}

export interface SingleHadithResponse {
  data: {
    number: number;
    arab: string;
    id: string;
  };
}

export interface HadithInfo {
  name: string;
  slug: string;
  total: number;
}

export interface HadithInfoResponse {
  data: HadithInfo[];
}

export interface HadithSearchResult {
  rawi: string;
  hadits_number: number;
  text: string;
}

export interface HadithListResponse {
  data: Hadith[];
}
