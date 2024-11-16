"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import SearchProducts from "../Search/SearchProducts/SearchProducts";
import UserIcons from "@/app/[locale]/components/Global/UserIcon/UserIcons";
import { CiLogin } from "react-icons/ci";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";
import { Languages } from "@/app/[locale]/utils/constant";
import { LogOut } from "@/app/[locale]/api/auth";
import { notification } from "antd";
import Loader from "../Loader/LargeLoader/LargeLoader";
import { MyContext } from "@/app/[locale]/context/myContext";
import Cookies from 'js-cookie';
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "@/app/[locale]/components/Global/Sidebar/Sidebar";


type Props = {
  locale: string
}

function Navbar({ locale }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);
  const [isLogend, setIsLogend] = useState(false);
  const path = usePathname();
  const { logined, setLogined } = useContext(MyContext);

  useEffect(() => {
    const logend = localStorage.getItem("isLogend");
    if (logend != undefined && logend == "true") {
      setIsLogend(true)
    } else {
      setIsLogend(false)
    }
  }, [logined])
  return (
    <div className="">
      {isLoading && <Loader />}
      <main className={`container py-3 lg:py-6 `}>
        
        {/* Start Burger Menu */}
        <div className={`lg:hidden ${isLogend ? " grid grid-cols-[8%_68%_17%] gap-4 " : "flex  justify-between"}  items-center `}>
          {/* Start  Burger Icon*/}
          <div className="">
            <div className=" !absolute !z-50 top-2 mt-[2px]">
              <GiHamburgerMenu
                className="text-3xl"
                onClick={() => { setOpenBurgerMenu(!openBurgerMenu) }}
              />
            </div>
          </div>
          {/* End  Burger Icon*/}

          {/* Start Search */}
          <div className={`relative w-full mx-auto !z-50 -mt-7 `}>
            {!openSearch && (
              <div
                className={`${!openSearch ? " -right-2  " : " -right-[420px]"
                  } ${isLogend ? "block" : "hidden"} absolute !z-50 top-0 transition-all duration-200  `}
              >
                <SearchProducts locale={locale} />
              </div>
            )}
          </div>
          {/* End Search */}


          {/* Start Logo */}
          <div className="flex items-center justify-end pt-1">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                height={80}
                width={107}
                alt="Logo"
              />
            </Link>
          </div>
          {/* End Logo */}
        </div>
        {/* End Burger Menu */}

        {/* Start Lg Screen */}
        <div className={`hidden lg:grid ${path.includes("auth") ? "grid-cols-[75%_25%] md:w-1/2 mx-auto md:px-20" : "grid-cols-[25%_50%_25%]"}   items-center justify-between`}>
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
          <div className={`${path.includes("auth") ? "hidden" : "block"} `}>
            <SearchProducts locale={locale} />
          </div>
          {/* End Search */}

          {/* Start User Icons */}
          <div className="flex justify-end ">
            <UserIcons locale={locale} isLogend={isLogend} />
          </div>
          {/* End User Icons */}
        </div>
        {/* ENd Lg Screen */}

        {/* Start SideBar */}
        <div className="block lg:hidden ">
          <Sidebar
            locale={locale}
            openBurgerMenu={openBurgerMenu}
            setOpenBurgerMenu={setOpenBurgerMenu}
          />
        </div>
        {/* End SideBar */}

      </main>
    </div>
  );
}

export default Navbar;
