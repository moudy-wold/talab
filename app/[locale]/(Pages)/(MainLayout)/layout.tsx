"use client"
import React, { ReactNode, useEffect } from "react";
import Sidebar from "@/app/[locale]/components/Global/Sidebar/Sidebar";
import { useRouter } from "next/navigation";


interface RootLayoutProps {
  params: {
    locale: string;
  };
  children: ReactNode;
}

function MainLayout({ params: { locale }, children }: RootLayoutProps) {
  const {push} = useRouter();
  
  useEffect(() => {
    const logend = localStorage.getItem("isLogend");
    if (logend == undefined || logend !== "true") {
      push("/auth/login")
    }
  }, [])
  return (

    <div className={``}>
      <div className="grid lg:grid-cols-[25%_72%] pt-16 lg:pt-0 gap-3 lg-pt-0 ">
        <div className="hidden lg:block">
          <Sidebar locale={locale}  />
        </div>
        <div className={``}>
          {children}
        </div>
      </div>
      <div className="">
        {/* <Footer /> */}
      </div>

    </div>

  );
}

export default MainLayout;
