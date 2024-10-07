import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetAllProduct(page?:number): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/products?page=${page}`);
}

export async function GetAllOffresProducts(page?:number): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/products/has-offers?page=${page}`);
}

export async function GetAllProductByCategoryId(
  id: string,
  page?:number,
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/products/cat/${id}`);
}

export async function GetProductById(id: string): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/products/${id}`);
}

export async function AddProduct(data: FormData): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/products`, data);
}

export async function EditProductById(
  id: string,
  data: FormData
): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/products/update/${id}`, data);
}

export async function UpdateOfferProduct(
  id: string,
  is_on_offer: "0" | "1",
  discount_price?:string,
  offer_start_date?:string,
  offer_expiry_date?:string,
): Promise<AxiosResponse<any>> {
  return await axios.post(`talab/products/update-offer/${id}?_method=patch&discount_price=${discount_price}&is_on_offer=${is_on_offer}&offer_start_date=${offer_start_date}&offer_expiry_date=${offer_expiry_date}`);
}


export async function DeleteProduct(id: string): Promise<AxiosResponse<any>> {
  return await axios.delete(`/talab/products/${id}`);
}


// /