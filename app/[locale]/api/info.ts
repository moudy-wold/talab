import { AxiosResponse } from "axios";
import axios from "./axios";

export async function GetInfo(): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab`);
}

export async function EditInfo(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/edit`, data);
}

// Get Commissios
export async function GetCommissions(): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/commissions`);
}

// Get Logo & Icon 
export async function GetLogoAndIcon(): Promise<AxiosResponse<any>> {
  return await axios.get(`/website/logo`);
}

export async function GetFooterData() {
  return await axios.get(`/website/footer`);
}
