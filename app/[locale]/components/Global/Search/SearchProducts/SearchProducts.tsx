"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import Link from "next/link";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { useTranslation } from "@/app/i18n/client";
import { ProductsSearch } from "@/app/[locale]/api/products"
import { notification, Pagination } from "antd";
type Props = {
  locale: string
}
function SearchProducts({ locale }: Props) {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [inputvalue, setInputValue] = useState("");
  const [data, setData] = useState([]);
  const [openSearch, setOpenSearch] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState<any>(0);

  const handlePageChange = async (page: any) => {
    setIsLoading(true);
    try {
      const res = await ProductsSearch(inputvalue, page);
      setTotalItems(res.data.pagination.total);
      setPageSize(res.data.pagination.per_page);
      setCurrentPage(page)
    } catch (err: any) {
      notification.error({
        message: err.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }

  };
  const getData = () => {
    setIsLoading(true);
    ProductsSearch(inputvalue, 1)
      .then((res) => {
        if (res.status) {
          setData(res.data?.data)
          setOpenSearch(true)
        }
        console.log(res.data.data)
      })
      .catch((err) => {
        console.log(err)
        notification.success({
          message: err.response.data.error.message
        })
      })
      .finally(() => {
        setIsLoading(false);
      })
  }
  const handleOnChange = () => {

    const interval = setTimeout(getData, 1000);
  }

  const handleSearch = () => {
    setIsLoading(true);
    getData()
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
    <div className="w-full relative !z-30 border-b-2 border-gray-300 md:border-0" ref={wrapperRef}>
      <div className="flex items-center w-full ">
        <input
          type="text"
          placeholder={t("search...")}
          onChange={(e) => { handleOnChange(); setInputValue(e.target.value) }}
          value={inputvalue}
          className="outline-none px-2 lg:px-4 py-[7px] lg:py-[9px] border-2 border-solid w-11/12 rounded-s-md text-lg text-[#8c8c8c]"
        />
        <Link href={`/dashboard/search/${inputvalue}`} className={`${inputvalue.trim() === "" && "pointer-events-none"}`} >
          <button
            onClick={() => { handleSearch() }}
            className={`${isLoading ? "bg-white" : "bg-[#006496]"} ${inputvalue.trim() === "" && "pointer-events-none"}  bg-[#006496] w-10 h-11 lg:w-12 lg:h-12 text-xs text-white flex items-center justify-center rounded-e-md border-[2px] border-[#006496]`}
          >
            {isLoading ?
              <Loader /> :
              <CiSearch className={`${inputvalue.trim() === "" && "pointer-events-none"}  w-7 h-7 lg:font-bold`} />}
          </button>
        </Link>
      </div>

      {openSearch ?
        <>
          {data.length ?
            <div className=" max-h-[400px] overflow-y-scroll absolute z-50 w-full min-h-10 bg-white border-[1px] border-gray-300 rounded-lg p-1 top-[58px] right-0 shadow-lg " >
              {data.map((item: any) => (
                <Link key={item._id} href={`/dashboard/products/edit/${item._id}`}>
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
              {/* Start Pagination */}
              <div className={`mx-auto my-2 w-fit [&>ul]:flex [&>ul]:items-center [&>ul>li]:border-[1px] [&>ul>li]:!pb-[3px] [&>ul>li]:border-[#006496] [&>ul>li]:rounded-md] [&>ul]:w-full notification-pagination`}>
                <Pagination
                  current={currentPage}
                  total={totalItems}
                  pageSize={pageSize}
                  onChange={handlePageChange}
                  simple
                />

              </div>
              {/* End Pagination */}
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
