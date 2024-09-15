import { AxiosResponse } from 'axios';
import axios from './axios';

export interface User {
  token: string,
  user: {
      userName: string,
      phoneNumber: string,
      role: "customer" |"admin",
      _id: string,
      services: [
          {
              _id: string
              userId: string,
              phoneType: string,
              serviceType: string,
              serviceCost: number,
              serviceCurrency: string,
              serviceStatus: "pending" |"active" |"refused" |"done",
              warantiDuration: string,
              createdAt: string,
              updatedAt: string,
              __v: 0
          },          
      ]
  }
}


  export async function Login( data: any): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/login`, data);
  }
  
  
  export async function ChangePassword( data: any): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/change-password`, data);
  }
  
  export async function LogOut(): Promise<AxiosResponse<any>> {
    return await axios.get(`/api/logout`);
  }

  export async function UpdatePassword(user_id:string,phoneNumber:string,password:string): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/users/update-password/${user_id}?phoneNumber=${phoneNumber}&password=${password}`);
  }  

  // Multibate
 

  export async function ResendVerifyEmail(): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/email/resend`);
  }  

  // For Customer

  export async function RegisterForCustomer( data: any): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/front/register-customer`, data);
  }
    
  export async function SendEmail(email:string ): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/email/`, email);
  }

  export async function UpdateOrAddEmailAndName(data:any ): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/common/update/profil`, data);
  }

  export async function ConfirmOTP( otp: any): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/email/verify-otp?otp=${otp}`, );
  }

  export async function ResendOTP( ): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/email/resend`, );
  }

  export async function ForgetPass( email:string): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/forgot?email=${email}`, );
  }

  export async function ResetPass( otp:string,email:string,password:string): Promise<AxiosResponse<any>> {
    return await axios.post(`/api/reset?otp=${otp}&email=${email}&password=${password}}`, );
  }

  // {{url}}/users/update-password/c3fdf3ff-5fdc-4575-b672-cd9b6f784ecd?phoneNumber=1234567890&password=ayman123