"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    let logend = localStorage.getItem("isLogend");
    if (logend == undefined || logend !== "true") {
      router.push("/auth/login")
    }else{
      router.push("/dashboard")
    }
  }, [])
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">

    </div>
  );
}
