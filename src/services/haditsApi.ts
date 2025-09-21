import { HadithInfoResponse, SingleHadithResponse } from "@/types/hadits";

const API_BASE_URL = "https://quran-api2.vercel.app/api/id";

export const getSingleHadith = async (
  rawi: string,
  haditsNumber: number
): Promise<SingleHadithResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/hadits/${rawi}/${haditsNumber}`
  );
  if (!response.ok) {
    throw new Error("Gagal memuat data hadits");
  }
  return response.json();
};

export const getHaditsInfo = async (): Promise<HadithInfoResponse> => {
  const response = await fetch(`${API_BASE_URL}/hadits/info`);
  if (!response.ok) {
    throw new Error("Gagal memuat info perawi");
  }
  return response.json();
};

export const getHadithList = async (
  rawi: string,
  page: number,
  size: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URL}/hadits/${rawi}?page=${page}&size=${size}`
  );
  if (!response.ok) {
    throw new Error("Gagal memuat daftar hadits");
  }
  return response.json();
};
