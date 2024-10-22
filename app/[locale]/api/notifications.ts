import { AxiosResponse } from 'axios';
import axios from './axios';

 
export async function GetAllNotifications(page?:number): Promise<AxiosResponse<any>> {
  return await axios.get(`/common/notifications?page=${page}`);
}

export async function SetNotoficationAsReadById( id: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/common/notifications-set-read?notification_id=${id}`);
}

export async function SetAllNotoficationAsRead(): Promise<AxiosResponse<any>> {
  return await axios.post(`/common/notifications-all-read`);
}

export async function DeleteNotoficationById( id: string): Promise<AxiosResponse<any>> {
  return await axios.delete(`/common/notifications-delete?notification_id=${id}`);
}

export async function DeleteAllNotifications(): Promise<AxiosResponse<any>> {
  return await axios.delete(`/common/notifications-delete-all`);
}

 