"use client";
import React, { useState } from "react";
import { useTranslation } from "../../../../i18n/client";
import Image from "next/image";
import Link from "next/link";
import StripHtmlTags from "../StripHTMLTags/StrippHTMLTag";
 
function Footer({ locale, data,logo }) {
  const { t } = useTranslation(locale, "common");
  const [openAppTypeQuestion, setOpenAppTypeQUestion] = useState(false);
  const currentYear = new Date().getFullYear();
  const [domain, setDomain] = useState("LOGICPRODEV");
  return (
    <div className="mt-20 border-t-2 border-gray-300 px-[10px]  pb-6  lg:px-20 relative z-10 bg-white">
      {/* Start Large Screen  */}
      <div className="hidden lg:block">
        <div className="flex justify-between items-start ">
           
          {/* Start Addrees */}
          {/* <div className=" mt-3">
                <p className="text-[#F5F5F5] text-sm">
                  İZZET PAŞA MAH. YENİ YOL CAD. NUROL TOWER{" "}
                </p>
                <p className="text-[#F5F5F5] text-sm">
                  NO: 3 İÇ KAPI NO: 336 ŞİŞLİ/ İSTANBUL
                </p>
              </div> */}
          {/* End Addrees */}
        </div>

        <div className="flex items-end justify-between ">
          {/* Start Logo */}
          <div className="">
            <Link href="/" >
          {/* <Image src={logo} alt="logo" width={150} height={150} className="" /> */}
          </Link>
          </div>
          {/* End Logo */}

          {/* Start Copy Right */}
          <div className="mt-20">
            <p className=" text-sm">
              {domain} Group © {currentYear} All Right Reserved
            </p>
          </div>
          {/* end Copy Right */}

          {/* Start email && whatsapp */}
          <div className="">
            <div className="flex flex-row-reverse items-center justify-between gap-5">

              {data?.email != null ? (
                <StripHtmlTags htmlString={data?.phone} />
              ) : (
                "00905374561068"
              )}
              WhatsApp :
            </div>
            <div className="flex flex-row-reverse items-center justify-between gap-5">
              {data?.email != null ? (
                <StripHtmlTags htmlString={data?.email} />
              ) : (
                "ahmad.najy5@gmail.com"
              )}
              E-mail :

            </div>
             

          </div>
          {/* End Email && WhatsApp*/}

          {/* Start Social Medya */}
          <div className="">
            <p className={`text-xl  w-full text-center  `}>
              {t("follow_us")}
            </p>
            <div className="flex items-center justify-end gap-5 mt-3 ">
              <Link
                href="https://www.facebook.com/ecigrouptr/"
                className="hover:scale-110 transition-all duration-200"
              >
                <Image
                  src="/assets/svg/telegram.svg"
                  alt="telgram"
                  width={40}
                  height={40}
                  className=""
                />
              </Link>
              <Link
                href={"@MuhammedAkil97"}
                className="hover:scale-110 transition-all duration-200"
              >
                <Image
                  src="/assets/svg/facebook.svg"
                  alt="facebook"
                  width={40}
                  height={40}
                  className=""
                />
              </Link>
            </div>
          </div>
          {/* End Social Medya */}
        </div>
      </div>
      {/* End Large Screen  */}

      {/* Start Small Screen  */}
      <div className="block lg:hidden">

        {/* Start Logo */}
        <div className="">
          <Link href="/">
          {/* <Image src={logo} alt="logo" width={150} height={150} className="" /> */}
          </Link>
          </div>
          {/* End Logo */}

        {/* Start Addrees */}
        {/* <div className=" border-y-[2px] border-white py-6">
              <p className="text-[#F5F5F5] text-sm">
                İZZET PAŞA MAH. YENİ YOL CAD. NUROL TOWER{" "}
              </p>
              <p className="text-[#F5F5F5] text-sm">
                NO: 3 İÇ KAPI NO: 336 ŞİŞLİ/ İSTANBUL
              </p>
            </div> */}
        {/* End Addrees */}

        {/* Start create-store */}
        <div className="mt-5">
          <div className="flex md:block ">
            WhatsApp : {" "}
            {data?.email != null ? (
              <StripHtmlTags htmlString={data?.phone} />
            ) : (
              "00905374561068"
            )}
          </div>
          <div className="flex md:block my-0 ">
            E-mail : {" "}
            {data?.email != null ? (
              <StripHtmlTags htmlString={data?.email} />
            ) : (
              " ahmad.najy5@gmail.com "
            )}
          </div>
 
        </div>
        {/* End Email && WahstApp */}

        <div className="flex items-end justify-between mt-2">
          {/* Start Copy Right */}
          <div className="">
            <p className="text-xs ">{domain} © {currentYear} All Right Reserved</p>
          </div>
          {/* end Copy Right */}

          {/* Start Social Medya */}
          <div className="mr-3">
            <p
              className={`text-xl w-full text-center`}
            >
              {t("follow_us")}
            </p>
            <div
              className={`  gap-5 justify-between flex items-center mt-2`}
            >
              <Link
 href={"@MuhammedAkil97"}
                className=""
              >
                <Image
                  src="/assets/svg/telegram.svg"
                  alt="telgram"
                  width={40}
                  height={40}
                  className=""
                />
              </Link>
              <Link
                href="https://www.facebook.com/ecigrouptr/"
                className=""
              >
                <Image
                  src="/assets/svg/facebook.svg"
                  alt="facebook"
                  width={40}
                  height={40}
                  className=""
                />
              </Link>
            </div>
          </div>
        </div>

        {/* End Social Medya */}
      </div>

      {/* End Small Screen  */}

      {/* Start Question Modae */}
      <div className="relative">
        {openAppTypeQuestion && <AppTypeQuestion locale={locale} openAppTypeQuestion={openAppTypeQuestion} setOpenAppTypeQUestion={setOpenAppTypeQUestion} />}
      </div>
      {/* End Question Modae */}
    </div>
  );
}

export default Footer;
