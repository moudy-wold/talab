import axios from "axios";
import { GetTokenInSsr } from "./getTokenInssr";
import RedirectInCsc from "./redirectIncCsc";
import i18next from "i18next";
import fetchCsrfToken from "./CsrfToken";

const axiosInstance = axios.create({
  baseURL: process.env.API_BASE_URL,
});
axiosInstance.interceptors.request.use(async (config) => {
  const token = await GetTokenInSsr().then((res) => res?.value);
  const csrfTokenData = await fetchCsrfToken();

  if (csrfTokenData != null) {
    config.headers["XSRF-TOKEN"] = csrfTokenData[0];
    config.headers["mobil_store_session"] = csrfTokenData[1];
  }

  if (config.data instanceof FormData) {
    config.headers["Content-Type"] = "multipart/form-data";
  }
  // config.headers["Accept-Language"] = i18next.logger.options.lng || "en";
  // config.headers["Accept-Language"] = i18next.language || "en";
  config.headers.Authorization = `Bearer ${token}`;
  config.headers["Accept"] = "/";

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: any) => {
    console.log(error.response, "error from main axios fild");
    // if (error?.response?.status == 401) {
    //   console.log("from 401");
    //   // await RedirectInCsc();
    // }
    if (
      error?.response?.data?.message == "Unauthorized" ||
      error?.response?.data?.message == "Unauthenticated."
    ) {
      console.log("from un");
      // await RedirectInCsc();
    }
    // if (
    //   error?.response?.status === 403 &&
    //   !error?.response?.data?.plan_expire
    // ) {
    //   console.log("from plan");
    //   await RedirectInCsc();
    // }

    return Promise.reject(error);
  }
);

export default axiosInstance;
