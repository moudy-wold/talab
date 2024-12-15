"use client"
import React, { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import LargeLoader from "./components/Global/Loader/LargeLoader/LargeLoader"
import { MyContext } from "./context/myContext";

export default function Page() {
  const router = useRouter();
  const { logined ,setLogined} = useContext(MyContext);

  useEffect(() => {
    console.log("FROM USE EFFECT")
    setTimeout(() => {
    console.log("FROM TIME OUT")

      const logend = localStorage.getItem("isLogend");

      if (logend == undefined || logend !== "true") {
        console.log("if")
        router.push("/auth/login")
      } else {
        console.log("else")
        router.push("/dashboard")
      }
    }, 100)
  }, [logined,setLogined]);
  // const logend = localStorage.getItem("isLogend");
  //     if (logend == undefined || logend !== "true") {
  //       console.log("if")
  //       router.push("/auth/login")
  //     } else {
  //       console.log("else")
  //       router.push("/dashboard")
  //     }
  return (
    <div >
      <LargeLoader />
    </div>
  );
}
