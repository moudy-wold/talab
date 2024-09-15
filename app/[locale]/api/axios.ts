import axios from "axios";
import { GetTokenInSsr } from "./getTokenInssr";
import RedirectInCsc from "./redirectIncCsc";

import fetchCsrfToken from "./CsrfToken";

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
});
axiosInstance.interceptors.request.use(async(config)  => {

  const token  = await GetTokenInSsr().then((res)=> res?.value )    
  const csrfTokenData = await fetchCsrfToken();

  if(csrfTokenData != null ){
    config.headers["XSRF-TOKEN"] = csrfTokenData[0];
    config.headers["mobil_store_session"] = csrfTokenData[1];
  }

  config.headers.Authorization = `Bearer ${token}`;  
  config.headers["Accept"] = "/"
  config.headers["X-Frontend-Host"] = "moudy.aymen" ;

    return config;
  } 
);

axiosInstance.interceptors.response.use( (response)  => {
    return response;
  },
  async (error:any) => {
    console.log(error,"qqqqqqqqqqqqqqqqqqq")
    
    if (error?.response?.data?.error?.message == "Unauthorized") {      
      await RedirectInCsc();  
    }
    if( error?.response?.status === 403 && !error?.response?.data?.plan_expire){    
      await RedirectInCsc();
    }     
         
    return Promise.reject(error);
  }
);


export default axiosInstance;

