import axios from "./axios";
import { AxiosResponse } from "axios";

export async function GetAllOrder(
  page?: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/order?page=${page}`);
}

export async function GetAllOrderForUser(
    user_id: number
  ): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/order?user_id=${user_id}`);
  }

export async function GetOrderById(
    order_id: string
  ): Promise<AxiosResponse<any>> {
    return await axios.get(`/talab/order/${order_id}`);
  }
  

  export async function UpdateQuantity(order_id : string ,status :string): Promise<AxiosResponse<any>> {
    return await axios.post(`/talab/order/update-status?_method=patch&order_id=${order_id}&status=${status}`);
  }
  
//   /talab/order/update-status?_method=patch&order_id=348f81ba-6fd0-424f-9da3-9a2457502bb7&status=preparing