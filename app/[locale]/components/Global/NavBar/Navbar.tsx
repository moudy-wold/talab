"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import SearchProducts from "../Search/SearchProducts/SearchProducts";
import UserIcons from "@/app/[locale]/components/Global/UserIcon/UserIcons";
import { GiHamburgerMenu } from "react-icons/gi";
import { CiLogin, CiSearch } from "react-icons/ci";
// import { openBurgerMenu } from '@/app/[locale]/lib/todosSlice'
import { GrUserAdmin } from "react-icons/gr";
import { usePathname } from "next/navigation";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "@/app/i18n/client";


type Props = {
  locale: string
}

function Navbar({ locale }: Props) {
  const { t } = useTranslation(locale, "common")
  const [openSearch, setOpenSearch] = useState(false);
  const [isLogend, setIsLogend] = useState(false);

  const handleLogOut = () => {
    // LogOut()
    // .then((res) => {
    //   notification.success( t("succeffly_logout"));
    //   localStorage.clear()
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 100);
    // })
    // .catch((err) => {
    //   console.log(err)
    //   notification.error({message:err.response.data.message});
    // })
    // .finally(() => {
    //   setIsLoading(false);
    // });
  };

  return (
    <div className="">
      <main className={`container py-1 lg:py-6  `}>
        {/* Start Burger Menu */}
        <div className={`grid lg:hidden ${isLogend ? "grid-cols-[78%_20%] " : "justify-center"}  items-center `}>
          <div className=" flex">
            <div className="  ">
              {isLogend && (
                <div
                  className="border-2 border-gray-300  rounded-md cursor-pointer  py-1 flex items-center font-semibold"
                  onClick={() => {
                    handleLogOut();
                  }}
                >
                  <CiLogin className=" text-xl" />
                </div>
              )}
            </div>

            <div className="mr-3 relative flex items-center  w-4/5 !z-50">
              {!openSearch && (
                <div
                  className={`${openSearch ? " right-0  " : " -right-[300px"
                    } ${isLogend ? "block" : "hidden"} absolute !z-50 top-0  mr-5  transition-all duration-200 w-4/5`}
                >
                  <SearchProducts locale={locale} />
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="mr-4">
              <Link href="/">
                <Image
                  src="/assets/logo.png"
                  height={100}
                  width={137}
                  alt="Logo"
                />
              </Link>
            </div>
          </div>
        </div>
        {/* End Burger Menu */}

        {/* Start Lg Screen */}
        <div className="hidden lg:grid grid-cols-[25%_50%_25%] items-center justify-between">
          {/* Start Logo */}
          <div className="flex items-center justify-start  ">
            <Link href="/" className="mr-2">
              <Image
                src="/assets/logo.png"
                height={154}
                width={154}
                alt="Logo"
              />
            </Link>
          </div>
          {/* End Logo */}

          {/* Start Search */}
          <div className="">
            <SearchProducts locale={locale} />
          </div>
          {/* End Search */}

          {/* Start User Icons */}
          <div className="flex justify-end ">
            <UserIcons locale={locale} />
          </div>
          {/* End User Icons */}
        </div>
        {/* ENd Lg Screen */}
      </main>
    </div>
  );
}

export default Navbar;
