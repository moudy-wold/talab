import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetMainCategories(): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/categories/main`);
}

export async function GetSubCategoriesByMainId(
  id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/categories/main/${id}`);
}

export async function GetSubCategoriesByMainSlug(
  slug: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/categories/main/${slug}`);
}
