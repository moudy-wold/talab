"use client";
import React, { Fragment, useContext, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { RiAddCircleLine } from "react-icons/ri";
import { TbCategoryFilled } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { Languages } from "@/app/[locale]/utils/constant";
import { usePathname, useRouter } from "next/navigation";
import { MdBorderClear, MdOutlineBorderAll } from "react-icons/md";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdOutlineLocalOffer } from "react-icons/md";
import { FaFirstOrderAlt } from "react-icons/fa";
import { MdAccountBalance } from "react-icons/md";
import { IoStatsChartSharp } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { CiLogout } from "react-icons/ci";
import { Modal, notification } from "antd";
import { LogOut } from "@/app/[locale]/api/auth";
import Cookies from 'js-cookie';
import { MyContext } from "@/app/[locale]/context/myContext";

type Item = {
  label: string;
  key: string;
  url?: string;
  icon: any;
  children?: Item[];
};

type Props = {
  locale: string;
  openBurgerMenu?: boolean;
  setOpenBurgerMenu?: any
};

function Sidebar({ locale, openBurgerMenu, setOpenBurgerMenu }: Props) {
  const { t, i18n } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [activeLink, setActiveLink] = useState("");
  const [current, setCurrent] = useState("");
  const currentPathname = usePathname();
  const router = useRouter();
  const [currentLocale, setCurrentLocale] = useState('')
  const [openLogOut, setOpenLogOut] = useState(false);
  const { setLogined } = useContext(MyContext);

  const items: Item[] = [
    {
      label: t("products"),
      key: "2",
      icon: <TbCategoryFilled />,
      children: [
        {
          label: t("all_products"),
          key: "22",
          url: "/dashboard/products",
          icon: <MdOutlineBorderAll />
        },
        {
          label: t("add_product"),
          key: "22",
          url: "/dashboard/products/create",
          icon: <IoIosAddCircleOutline />
        },
      ]
    },
    {
      label: t("offers"),
      key: "5",
      url: "/dashboard/offers",
      icon: <MdOutlineLocalOffer />
    },
    {
      label: t("orders"),
      key: "4",
      icon: <FaFirstOrderAlt />,
      children: [
        {
          label: t("all_orders"),
          key: "4.1",
          url: "/dashboard/orders",
          icon: <MdBorderClear />
        },
        // {
        //   label: t("return_order"),
        //   key: "4.2",
        //   url: "/dashboard/orders/return-orders",
        //   icon: <RiAddCircleLine />
        // }
      ]
    },

    {
      label: t("accounting"),
      key: "6",
      url: "/dashboard/accounting",
      icon: <MdAccountBalance />
    },
    {
      label: t("staticits"),
      key: "55",
      url: "/dashboard/staticits",
      icon: <IoStatsChartSharp />
    },
    {
      label: t("setting"),
      key: "7",
      icon: <IoSettingsOutline />,
      children: [
        {
          label: t("profile"),
          key: "5",
          url: "/dashboard/profile",
          icon: <CgProfile />
        },

      ]
    }
  ];

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
    setOpenLogOut(false)
    setIsLoading(true)
    LogOut()
      .then(() => {
        notification.success({ message: t("succeffly_logout") });
        localStorage.clear();
        Cookies.remove('token');
        setLogined(false)
        setTimeout(() => {
          window.location.reload();
        }, 100);
        router.push("/auth/login")
      })
      .catch((err) => {
        notification.error({ message: err.response.data.message });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <>
      <div className={` ${locale == "ar" ? (openBurgerMenu ? "shadow-2xl right-0 " : "-right-[320px] lg:!right-0") : (openBurgerMenu ? "  left-0" : "-left-[320px] lg:!left-0 ")} border-r-2 border-l-2  border-gray-300  fixed   z-10 top-0 transition-all duration-150 bg-white  w-[320px] min-h-[50vh]`}>
        <div className={`px-6 py-1 mt-12 lg:mt-28`}>
          <div className="flex items-center border-b-2 border-gray-300 lg:hidden px-2 h-16 ">
            {/* Start Select */}
            <div className="border-2 border-gray-300 rounded-lg p-1">
              <select
                defaultValue={locale}
                onChange={(e) => {
                  handleLocaleChange(e.target.value);
                }}
                className="mt-1"
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
            {/* {/* End Select */}
          </div>

          {items.map((item: any, index: number) => (
            <div key={index}>
              {item.children ? (
                <div
                  className={`rounded-lg my-1 ${current == item.key ? "bg-gray-400" : "bg-white"
                    } cursor-pointer `}
                >
                  {/* Start  */}
                  <div className="">
                    <button
                      type="button"
                      className="flex p-2 py-4 text-xl items-center justify-between w-full text-left font-semibold  hover:bg-gray-100 rounded-lg"
                      onClick={() => {
                        activeLink == item.key
                          ? setActiveLink("")
                          : setActiveLink(item.key);
                      }}
                      aria-controls="faqs-text-01"
                    >
                      <span className="flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>

                      <svg
                        width="12"
                        height="15"
                        viewBox="0 0 12 19"
                        fill="none"
                        className={`cursor-pointer ${activeLink == item.key ? "rotate-180" : "rotate-90"
                          } transition-all duration-200 mx-3`}
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.53033 0.469669C6.23744 0.176777 5.76256 0.176777 5.46967 0.469669L0.696699 5.24264C0.403806 5.53553 0.403806 6.01041 0.696699 6.3033C0.989593 6.59619 1.46447 6.59619 1.75736 6.3033L6 2.06066L10.2426 6.3033C10.5355 6.59619 11.0104 6.59619 11.3033 6.3033C11.5962 6.01041 11.5962 5.53553 11.3033 5.24264L6.53033 0.469669ZM6.75 19L6.75 1H5.25L5.25 19H6.75Z"
                          fill="#110F0F"
                        />
                      </svg>
                    </button>

                    <div
                      id="faqs-text-01"
                      role="region"
                      aria-labelledby="faqs-title-01"
                      className={`grid overflow-hidden transition-all duration-300 ease-in-out -mt-1 ${activeLink == item.key
                        ? " grid-rows-[1fr] opacity-100"
                        : " grid-rows-[0fr] opacity-0"
                        }`}
                    >
                      <div className="overflow-hidden">
                        {item?.children?.map((child: any, ind: number) => (
                          <Link
                            key={ind}
                            href={child.url}
                            onClick={() => { setOpenBurgerMenu && setOpenBurgerMenu(false) }}
                            className="flex p-2 px-4 my-2 items-center gap-2 hover:text-black hover:no-underline hover:bg-gray-100 rounded-lg">
                            <span>{child.icon}</span>
                            <span className="text-lg  text-black font-semibold ">
                              {child.label}
                            </span>
                          </Link>
                        ))}

                      </div>
                    </div>
                  </div>
                  {/* End Whot Us */}
                </div>
              ) : (
                <Link
                  href={item.url}
                  onClick={() => {
                    if (setOpenBurgerMenu) {
                      setOpenBurgerMenu(false);
                    }
                  }}
                  className="hover:no-underline hover:bg-gray-100 p-2 my-1 rounded-lg flex items-center gap-2">
                  <p className="">{item.icon}</p>
                  <p className=" font-semibold p-2 text-xl">{item.label}</p>
                </Link>
              )}
            </div>
          ))}
          <div className="lg:hidden flex items-center relative cursor-pointer mt-2" onClick={() => { setOpenLogOut(true) }}>
            <p className="mx-2">  <CiLogout className=" text-xl text-[#8c8c8c]" /></p>
            <span className=" lg:hidden block mt-[4px] text-center text-xl font-semibold">{t("logout")}</span>
          </div>
        </div>
      </div>
      {/* Start LogOut Model */}
      <Modal
        title={t("logout")}
        centered
        open={openLogOut}
        okButtonProps={{}}
        onOk={() => { handleLogOut() }}
        onCancel={() => { setOpenLogOut(false) }}
        width={500}
      >
        <p>{t("are_you_sure_log_out")} </p>
      </Modal>
      {/* End LogOut Model */}
    </>
  );
}

export default Sidebar;
