"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { useTranslation } from "@/app/i18n/client";

type Props = {
  path?: string,
  locale: string
}
function SearchProducts({ path, locale }: Props) {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [inputvalue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const [openSearchAdmin, setOpenSearchAdmin] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleOnChange = () => {
    // const getData = () => {
    //   setIsLoading(true);
    //   SearchProductsForCustomer(inputvalue)
    //     .then((res) => {
    //       if (res.status) {
    //         setData(res.data?.data)
    //         setOpenSearch(true)            
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err)
    //       notification.success({
    //         message: err.response.data.error.message
    //       })
    //     })
    //     .finally(() => {
    //       setIsLoading(false);
    //     })
    // }
    // const interval = setTimeout(getData, 1000);
  }

  const handleSearch = () => {
    // setIsLoading(true);

    // SearchProductsForCustomer(inputvalue)
    //   .then((res) => {
    //     if (res.status) {
    //       setData(res.data?.data)
    //       setOpenSearch(true)
    //     }
    //   })
    //   .catch((err) => {
    //     notification.success({
    //       message: err.response.data.error.errors[0].msg
    //     })
    //   })
    //   .finally(() => {
    //     setIsLoading(false);

    //   })
  }


  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setData([])
        setInputValue("")
        setOpenSearch(false)
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [wrapperRef]);

  return (
    <div className="w-full relative !z-50" ref={wrapperRef}>

      <div className="flex items-center w-full ">

        <input
          type="text"
          placeholder={t("search...")}
          onChange={(e) => { handleOnChange(); setInputValue(e.target.value) }}
          value={inputvalue}
          className="outline-none px-2 lg:px-4 lg:py-[10px] border-2 border-solid w-11/12 rounded-s-md text-lg text-[#8c8c8c]"
        />
        <Link href={`/search/${inputvalue}`} >
          <button
            onClick={() => { handleSearch() }}
            className={`${isLoading ? "bg-white" : "bg-[#006496]"} bg-[#006496] w-7 h-7 lg:w-12 lg:h-12 text-xs text-white flex items-center justify-center rounded-e-md border-[2px] border-[#006496]`}
          >
            {isLoading ?
              <Loader /> :
              <CiSearch className="w-7 h-7 lg:font-bold" />}
          </button>
        </Link>
      </div>

      {openSearch ?
        <>
          {data.length ?
            <div className=" max-h-[400px] overflow-scroll absolute z-50 w-full min-h-10 bg-white border-[1px] border-gray-300 rounded-lg p-1 top-[58px] right-0 shadow-lg " >
              {data.map((item: any) => (
                <Link key={item._id} href={path ? `/admin/category/${path}/edit/${item._id}` : `/category/product/${item._id}`}>
                  <div className="flex  border-b-[1px] border-gray-400 p-1 hover:bg-[#006496] [&>div>p]:hover:text-white  ">
                    <div className="p-2">
                      <Image src={item.images[0]} alt={item.name} width={60} height={60} className="border-[1px] border-gray-300 rounded-xl !w-16 !h-16" />
                    </div>
                    <div className="mr-3 p-4">
                      <p className="text-[#444] text-base ">{item.name}</p>
                      <p className="text-[#006496]  text-lg mt-4 ">{item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}

            </div> :
            <div className="absolute w-full min-h-10 bg-white border-[1px] border-gray-300 rounded-lg p-4 top-[58px] right-0 shadow-lg "  >
              <p className=" text-xl"> {t("no_matching_data")}</p>
            </div>
          }
        </> : <></>}

    </div>
  );
}

export default SearchProducts;
