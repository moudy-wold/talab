import { AxiosResponse } from "axios";
import axios from "./axios";

export interface User {
  token: string;
  user: {
    userName: string;
    phoneNumber: string;
    role: "customer" | "admin";
    _id: string;
    services: [
      {
        _id: string;
        userId: string;
        phoneType: string;
        serviceType: string;
        serviceCost: number;
        serviceCurrency: string;
        serviceStatus: "pending" | "active" | "refused" | "done";
        warantiDuration: string;
        createdAt: string;
        updatedAt: string;
        __v: 0;
      }
    ];
  };
}

export async function Register(data: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/auth/register`, data);
}

export async function Login(
  email: string,
  password: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/talab/auth/login?email=${email}&password=${password}`
  );
}
export async function LogOut(): Promise<AxiosResponse<any>> {
  return await axios.get(`/talab/auth/logout`);
}

export async function ForgetPass(email: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/auth/forgot?email=${email}`);
}

export async function ResetPass(
  email: string,
  otp: string,
  password: string
): Promise<AxiosResponse<any>> {
  return await axios.post(
    `/talab/auth/reset?email=${email}&otp=${otp}&password=${password}`
  );
}
export async function ConfirmOTP(otp: any): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/auth/email/verify-otp?otp=${otp}`);
}

export async function SendEmail(email: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/api/email/`, email);
}

export async function ResendOTP(email: string): Promise<AxiosResponse<any>> {
  return await axios.post(`/talab/auth/email/resend?email=${email}`);
}
