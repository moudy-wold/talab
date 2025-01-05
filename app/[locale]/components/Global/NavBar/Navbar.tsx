"use client";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useContext, useEffect, useState } from "react";
import SearchProducts from "../Search/SearchProducts/SearchProducts";
import UserIcons from "@/app/[locale]/components/Global/UserIcon/UserIcons";
import Loader from "../Loader/LargeLoader/LargeLoader";
import { MyContext } from "@/app/[locale]/context/myContext";
import Cookies from 'js-cookie';
import { GiHamburgerMenu } from "react-icons/gi";
import Sidebar from "@/app/[locale]/components/Global/Sidebar/Sidebar";
import { useTranslation } from "@/app/i18n/client";
import { usePathname, useRouter } from "next/navigation"
import { Languages } from "@/app/[locale]/utils/constant"
import { CiSearch } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";


type Props = {
  locale: string,
  logo:string,
}

function Navbar({ locale,logo }: Props) {
  const { t, i18n } = useTranslation(locale, "common");
  const currentPathname = usePathname();

  const [isLoading, setIsLoading] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [openBurgerMenu, setOpenBurgerMenu] = useState(false);
  const [isLogend, setIsLogend] = useState(false);
  const path = usePathname();
  const { logined, setLogined } = useContext(MyContext);
  const [currentLocale, setCurrentLocale] = useState(locale);
  const router = useRouter();

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
        <div className={`lg:hidden ${isLogend ? " grid grid-cols-[8%_68%_17%] gap-4 " : "w-full flex  justify-between"}  items-center `}>
          {/* Start  Burger Icon*/}
          <div className={`${isLogend ? "block" : "hidden"}`}>
            <div className={`${locale == "ar" ? "right-[2px]" : "left-[2px]"} !absolute !z-50 top-2 mt-[2px] `}>
              <GiHamburgerMenu
                className="text-3xl"
                onClick={() => { setOpenBurgerMenu(!openBurgerMenu) }}
              />
            </div>
          </div>
          {/* End  Burger Icon*/}

          {/* Start Select */}
          <div className={`${isLogend ? "hidden" : "block"} mt-[2px]`}>
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

          {/* Start Search */}
          <div className={`relative w-full mx-auto !z-50 -mt-7 `}>
            <div className={`${isLogend ? "block" : "hidden"} w-10 flex items-center absolute top-1 md:-top-1 right-2 md:-right-12`}>
              {openSearch ? (
                <p><IoIosCloseCircleOutline onClick={() => { setOpenSearch(false) }} className={`text-xl`} /></p>
              ) : (
                <p> <CiSearch onClick={() => { setOpenSearch(true) }} className="border-2 border-gray-300 p-[1px] text-xl rounded-md" /></p>
              )}
            </div>
            <div
              className={`${openSearch ? " right-1/2 translate-x-1/2" : " -right-[1500px]"
                } ${isLogend ? "block" : "hidden"} absolute w-[320px] flex items-center justify-center mx-auto md:w-full !z-50 top-12 transition-all duration-200  `}
            >
              <SearchProducts locale={locale} />
            </div>
          </div>
          {/* End Search */}


          {/* Start Logo */}
          <div className="flex items-center justify-end pt-1">
            <Link href="/">
              <Image
                src="/assets/logo.png"
                width={107}
                height={80}
                alt="Logo"
                className="!w-full !h-full  "
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
            {/* <Link href="/" className="mr-2">
              <Image
                src={logo}
                height={154}
                width={154}
                alt="Logo"
              />
            </Link> */}
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
