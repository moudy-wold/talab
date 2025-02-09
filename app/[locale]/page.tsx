"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import LargeLoader from "./components/Global/Loader/LargeLoader/LargeLoader"

export default function Page() {
  const router = useRouter();
  // const { logined, setLogined } = useContext(MyContext);

  useEffect(() => {
    setTimeout(() => {
      const logend = localStorage.getItem("isLogend");
      if (logend == undefined || logend !== "true") {
        router.push("/auth/login")
      } else {
        router.push("/dashboard")
      }
    }, 100)
  }, []);

  return (
    <div >
      <LargeLoader />
    </div>
  );
}
