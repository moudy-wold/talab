 "use server";
import axios from "axios";
import { cookies } from "next/headers";

// Fetch CSRF token from Laravel Sanctum
export default async function fetchCsrfToken() {
  try {
    const res :any = await axios.get("https://mobilstore.aymankanawi.info/sanctum/csrf-cookie", {
      withCredentials: true, // ensure cookies are sent and received
    });

    const xsrfToken :any  = res.headers["set-cookie"]
      .find((cookie :any) => cookie.includes("XSRF-TOKEN"))
      ?.split("XSRF-TOKEN=")[1]
      ?.split(";")[0];

    const mobilStoreSession = res.headers["set-cookie"]
      .find((cookie :any) => cookie.includes("mobil_store_session"))
      ?.split("mobil_store_session=")[1]
      ?.split(";")[0];


    if (xsrfToken) {
      cookies().set("XSRF-TOKEN", xsrfToken);
    }
    if (mobilStoreSession) {
      cookies().set("mobil_store_session", mobilStoreSession);
    }

    return [xsrfToken, mobilStoreSession ];
  } catch (error) {
    console.error("Error fetching CSRF token:", error);
    return null;
  }
}


// export default async function fetchCsrfToken() {
//   try {
//     const res = await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
//       withCredentials: true, // Ensure that cookies are included
//     });

//     const setCookieHeaders = res.headers["set-cookie"] || [];

//     // Find XSRF-TOKEN in the cookies
//     const  rawXsrfToken = setCookieHeaders.find((cookie) =>
//       cookie.includes("XSRF-TOKEN")
//     )?.split("XSRF-TOKEN=")[1]?.split(";")[0];

//     // const xsrfToken = rawXsrfToken ? decodeURIComponent(rawXsrfToken) : null;
//     const xsrfToken = rawXsrfToken;


//     // console.log(xsrfToken);


//     // Find mobil_store_session in the cookies
//     const mobilStoreSession = setCookieHeaders.find((cookie) =>
//       cookie.includes("mobil_store_session")
//     )?.split("mobil_store_session=")[1]?.split(";")[0];

//     // Return both tokens if they exist, otherwise return null
//     // const xsrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"));


//     if (xsrfToken || mobilStoreSession) {
//       return [xsrfToken, mobilStoreSession];
//     }

//     return null;
//   } catch (error) {
//     console.error("Error fetching CSRF token:", error);
//     return null;
//   }
// }