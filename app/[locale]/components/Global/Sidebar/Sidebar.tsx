"use client";
import React, { useState, useEffect } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { useTranslation } from "@/app/i18n/client";
import { RiAddCircleLine } from "react-icons/ri";
import { AiOutlineProduct } from "react-icons/ai";
import { TbCategoryFilled, TbJumpRope } from "react-icons/tb";
import { IoSettingsOutline } from "react-icons/io5";
import Link from "next/link";
import { RxSection } from "react-icons/rx";

type Item = {
  label: string;
  key: string;
  url?: string;
  icon: any;
  children?: Item[];
};
type Props = {
  locale: string;
};

function Sidebar({ locale }: Props) {
  const { t, i18n } = useTranslation(locale, "common");

  const [activeLink, setActiveLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [current, setCurrent] = useState("");
  const [categories, setCategories] = useState([]);

  const handleClickCategory = (category: any) => {
    localStorage.setItem("categoryId", category._id);
  };
  useEffect(() => {

    let arr: any = {
      label: t("categories"),
      key: "1",
      url: "/categories",
      icon: <AiOutlineProduct />,
      children: [
        {
          label: t("all_category"),
          key: "1.2",
          url: "/",
          icon: <RiAddCircleLine />
        }
      ]
    };
    const getCategories = async () => {
      try {
        // const res = await GetAllCategories();
        let res: any;
        res.data.data.forEach((category: any) => {
          arr.children.push({
            label: (
              <Link
                href={`/categories/${category.name}`}
                onClick={() => {
                  handleClickCategory(category);
                }}
              >
                {category.name}
              </Link>
            ),
            key: category._id,
            icon: <TbJumpRope />,
            url: `/admin/category/${category.name}`
          });
        });
      } catch (err: any) {
        console.log(err);
      }
    };

    //  getCategories()
  }, []);

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
          icon: <TbCategoryFilled />
        },
        {
          label: t("add_product"),
          key: "22",
          url: "/dashboard/products/create",
          icon: <TbCategoryFilled />
        },
      ]
    },       
    {
      label: t("offers"),
      key: "5",
      url: "/dashboard/offers",
      icon: <TbCategoryFilled />
    },
    {
      label: t("orders"),
      key: "4",
      icon: <IoSettingsOutline />,
      children: [
        {
          label: t("all_orders"),
          key: "4.1",
          url: "/dashboard/orders",
          icon: <RiAddCircleLine />
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
      icon: <TbCategoryFilled />
    },
    {
      label: t("setting"),
      key: "7",
      icon: <TbCategoryFilled />,
      children: [
        {
          label: t("profile"),
          key: "5",
          url: "/dashboard/profile",
          icon: <TbCategoryFilled />
        },
      ]
    }
  ];

  const handleClick = (item: any) => {
    // console.log(item);
  };
  return (
    <>
      {isLoading && <Loader />}
      <div className={`${locale == "ar" ? "right-0" : "left-0"}  fixed z-10 top-0 w-[320px] h-[100vh]`}>
        <div className="px-6 py-1 mt-28">
          {items.map((item: any,index:number) => (
            <div
            key={index}
              className=""
              onClick={() => {
                handleClick(item);
              }}
            >
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
                        {item?.children?.map((child: any,ind:number) => (
                          <Link href={child.url} key={ind} className="flex p-2 px-4 my-2 items-center gap-2 hover:text-black hover:no-underline hover:bg-gray-100 rounded-lg">
                            <span>{item.icon}</span>
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
                <Link href={item.url} className="hover:no-underline hover:bg-gray-100 p-2 my-1 rounded-lg flex items-center gap-2">
                  <p className="">{item.icon}</p>
                  <p className=" font-semibold p-2 text-xl">{item.label}</p>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Sidebar;
