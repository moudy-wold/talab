import React, { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { FaUserAlt } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation"
import { CiLogin } from "react-icons/ci";
import { LogOut } from "@/app/[locale]/api/auth";
import { toast } from 'react-toastify';
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { useTranslation } from "@/app/i18n/client";
import { notification } from "antd";
import { Languages } from "@/app/[locale]/utils/constant"
type Props = {
  locale: string
}
function UserIcons({ locale }: Props) {
  const { t, i18n } = useTranslation(locale, "common");
  const [currentLocale, setCurrentLocale] = useState(locale);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentPathname = usePathname();

  const [id, setId] = useState("")
  const [isLoggend, setIsLoggend] = useState<any>()

  // Handle Change Language
  const handleLocaleChange = (newLocale: any) => {
    if (!currentPathname) return;
    const pathWithoutLocale = currentPathname.replace(/^\/[^\/]+/, "");
    localStorage.setItem("direction", newLocale === "ar" ? "rtl" : "ltr");
    document.dir = newLocale === "ar" ? "rtl" : "ltr";
    i18n.changeLanguage(newLocale);
    router.push(`/${newLocale}${pathWithoutLocale}`);
    setCurrentLocale(newLocale); // Update the local state
  };


  const handleLogOut = () => {
    setIsLoading(true)
    LogOut()
      .then((res) => {
        notification.success({ message: t("succeffly_logout") });
        localStorage.clear();
        setTimeout(() => {
          window.location.reload();
        }, 100);
        router.push("/")
      })
      .catch((err) => {
        notification.error({ message: err.response.data.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }



  return (
    <main className="">
      {isLoading && <Loader />}
      <div className="flex items-center justify-between">
        {/* Start Select */}
        <div className="mx-5">
          <select
                defaultValue={locale}

            onChange={(e) => {
              handleLocaleChange(e.target.value);
            }}
            className=""
          >
            {Languages.map((item: { id: number; title: string; value: string }, index: number) => {
              return (
                <Fragment key={index}>
                  
                    <option value={item.value} key={index + 5}>
                      {item.title}
                    </option>
                  
                </Fragment>
              );
            })}
          </select>
        </div>
        {/* End Select */}


        <div className="w-16 felx flex-col justify-center items-center relative  !z-[99999999] hover:scale-110 transition-all duration-200 ">
          {isLoggend ? <>
            <div
              className="flex items-center flex-col relative cursor-pointer mt-[2px]">


            </div>
          </> : <div className="ml-1">
            <Link href="/auth/login" className="flex flex-col items-center">
              <FaUserAlt className=" text-xl text-[#8c8c8c]" />
              <span className=" hidden lg:block mt-[4px] text-center text-sm">{t("login")}</span>
            </Link>
          </div>
          }
        </div>




      </div>
    </main>
  );
}

export default UserIcons;
