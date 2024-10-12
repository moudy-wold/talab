import axios from "./axios";
import { AxiosResponse } from "axios";

export async function GetAllOrder(page?: number): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/order?page=${page}`);
}

export async function GetAllOrderForUser(
  user_id: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/order?user_id=${user_id}`);
}

export async function GetOrderById(
  order_id: string,
  page?: number
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/order/${order_id}?page=${page}`);
}

export async function GetOrderByUserId(
  user_Id: string
): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/order?user_id=${user_Id}`);
}

export async function UpdateStatus(
  order_id: string,
  status: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/talab/order/update-status?_method=patch&order_id=${order_id}&status=${status}`
  );
}
