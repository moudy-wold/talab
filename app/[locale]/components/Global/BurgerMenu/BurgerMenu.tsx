"use client"
import React, { useEffect, useState } from "react";
import Link from "next/link"
import { LogOut } from "@/app/[locale]/api/auth";
import { CiMenuFries, CiLogin } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import LargeLoades from "../Loader/LargeLoader/LargeLoader";
import { t } from "i18next";
import { notification } from "antd";

function BurgerMenu() {

  const [isLogend, setIsLogend] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [burgerMenu, setBurgerMenu] = useState(false)




  const handleLogOut = () => {
    LogOut()
      .then(() => {
        notification.success( {message : t("succeffly_logout")});
        localStorage.clear()
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .catch((err) => {
        console.log(err)
        notification.error({message: t(err.response.data.message)});
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  useEffect(() => {
    const logend = localStorage.getItem("isLogend");
    if (logend == undefined || logend !== "true") {
      setIsLogend(true);
    }
  }, []);




  return (
    <>
      {isLoading && <LargeLoades />}
      <div className={`${burgerMenu ? "right-0 " : "-right-[320px]"} fixed z-50 top-0   bg-white w-[320px] h-[100vh] transition-all duration-200`}>

        <div className="flex items-center justify-between p-5 bg-[#006496]">
          <div className="flex items-center justify-between  w-20"><CiMenuFries className="text-white text-xl mr-4 font-bold cursor-pointer" /><span className="text-white text-xl font-medium"> {t("the_list")}</span></div>
          <div><IoMdClose className="text-white text-xl mr-4 font-bold cursor-pointer" onClick={() => { console.log("for close") }} /></div>
        </div>

        <div className="px-6 py-1">
          {isLogend ?
            <div className="hover:bg-gray-100 rounded-2xl cursor-pointer px-5 py-1 flex items-center font-semibold" onClick={() => { handleLogOut() }}>
              <CiLogin className=" text-xl" />
              <span className="mr-2 font-semibold  text-[18px]"  >{t("logout")}</span>
            </div> :
            <div className="hover:bg-gray-100 rounded-2xl cursor-pointer px-5 py-1 flex items-center font-semibold" >
              <CiLogin />
              <Link href="/auth/login" className="font-semibold mx-1 text-[18px]"> {t("login")}</Link>
            </div>
          }


        </div>
      </div>
    </>
  )
}

export default BurgerMenu;

