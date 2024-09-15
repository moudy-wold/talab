"use server"
import { cookies } from "next/headers"

export async function GetTokenInSsr() {    
    return cookies().get("token")
  
}