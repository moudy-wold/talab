import { AxiosResponse } from "axios";
import axios from "./axios";


export async function GetMainCategories(): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/categories/main`);
  }


  export async function GetSubCategories(id:string): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/categories/main/${id}`);
  }