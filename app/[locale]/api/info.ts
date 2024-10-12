import { AxiosResponse } from "axios";
import axios from "./axios";


export async function GetInfo(): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab`);
  }


  export async function EditInfo(data:any): Promise<AxiosResponse<any>> {
    return await axios.post(`/talab`,data);
  }