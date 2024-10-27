"use client"
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const {push} = useRouter();

  useEffect(() => {
    const logend = localStorage.getItem("isLogend");
    if (logend == undefined || logend !== "true") {
      push("/auth/login")
    } else {
      push("/dashboard")
    }
  }, [push]);

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">

    </div>
  );
}
