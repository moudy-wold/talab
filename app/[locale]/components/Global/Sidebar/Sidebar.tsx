"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { useTranslation } from "@/app/i18n/client";
import { RiAddCircleLine } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryFilled, TbCertificate } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";

type Item = {
  label: string;
  key: string;
  url: string;
  icon: any;
  children?: Item[];  
};
type Props = {
  locale: string;
};

function Sidebar({ locale }: Props) {
  const { t, i18n } = useTranslation(locale, "common");

  const [whoUs, setWhoUs] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState("");

  const items: Item[] = [
    {
      label: "منتجات",
      key: "1",
      url: "/",
      icon: <AiOutlineProduct />,
      children: [
        {
          label: "إضافة منتج",
          key: "1.1",
          url: "/",
          icon: <RiAddCircleLine />
        },
        {
          label: "إضافة منتج",
          key: "1.2",
          url: "/",
          icon: <RiAddCircleLine />
        },
        {
          label: "إضافة منتج",
          key: "1.3",
          url: "/",
          icon: <RiAddCircleLine />
        }
      ]
    },
    {
      label: "أقسام",
      key: "2",
      url: "/",
      icon: <TbCategoryFilled />,
      children: [
        {
          label: "المنتجات",
          key: "2.1",
          url: "/",
          icon: <TbCertificate />
        }
      ]
    },
    {
      label: "إعدادات",
      key: "4",
      url: "/",
      icon: <IoSettingsOutline />
    }
  ];
  const handleClick = (item: any) => {
    console.log(item);
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className={`right-0 fixed z-50 top-0 w-[320px] h-[100vh]`}>
        <div className="px-6 py-1 mt-40">
          {items.map((item: any) => (
            <div
              className=""
              onClick={() => {
                handleClick(item);
              }}
            >
              {item.children ? (
                <div
                  className={`rounded-lg ${
                    current == item.key ? "bg-gray-400" : "bg-white"
                  } cursor-pointer `}
                >
                  {/* Start Whot Us */}
                  <div className="">
                    <h2>
                      <button
                        type="button"
                        className="flex items-center justify-between w-full text-left font-semibold py-2"
                        onClick={() => setWhoUs(!whoUs)}
                        aria-expanded={whoUs}
                        aria-controls="faqs-text-01"
                      >
                        <span>{item.label}</span>

                        <svg
                    width="12"
                    height="15"
                    viewBox="0 0 12 19"
                    fill="none"
                    className={`${
                      whoUs ? "-rotate-180" : "rotate-90"
                    } transition-all duration-200 mx-3`}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6.53033 0.469669C6.23744 0.176777 5.76256 0.176777 5.46967 0.469669L0.696699 5.24264C0.403806 5.53553 0.403806 6.01041 0.696699 6.3033C0.989593 6.59619 1.46447 6.59619 1.75736 6.3033L6 2.06066L10.2426 6.3033C10.5355 6.59619 11.0104 6.59619 11.3033 6.3033C11.5962 6.01041 11.5962 5.53553 11.3033 5.24264L6.53033 0.469669ZM6.75 19L6.75 1H5.25L5.25 19H6.75Z"
                      fill="#110F0F"
                    />
                  </svg>

                      </button>
                    </h2>

                    <div
                      id="faqs-text-01"
                      role="region"
                      aria-labelledby="faqs-title-01"
                      className={`grid text-sm text-slate-600 overflow-hidden transition-all duration-300 ease-in-out ${
                        whoUs
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">{item?.children?.map((child:any) =>(
                          <div className="bg-red-500"> 
                          {child.label}
                            </div>

                      ))}</div>
                    </div>
                  </div>
                  {/* End Whot Us */}
                </div>
              ) : (
                <div className="font-semibold">{item.label}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
