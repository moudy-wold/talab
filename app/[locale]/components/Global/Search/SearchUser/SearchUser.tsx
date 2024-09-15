"use client";
import React, { useState } from "react";
import { CiCirclePlus, CiEdit, CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";
import { RiDeleteBinLine } from "react-icons/ri";
import { MdOutlineDoneOutline } from "react-icons/md";
import { IoChatbubblesOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import LargeLoades from "../../Loader/LargeLoader/LargeLoader";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
type Props = {
  locale?: string;
};
function SearchUser({ locale }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState("");

  const onFinish = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    // try {
    //   const response = await SearchOnUserForEmployee(value)
    //   setSearchedData(response.data.customers)
    //   setOpenSearchData(true)
    //   setIsLoading(false)
    //   console.log(response.data.customers)
    // } catch (err: any) {
    //   setIsLoading(false)
    //   toast.error( "هناك مشكلة لا يمكن البحث الأن")
    // }
  };

  return (
    <div className="">
      {isLoading && <LargeLoades />}
      <form onSubmit={(e) => onFinish(e)} className="flex items-center w-full ">
        <input
          type="  text"
          placeholder="البحث..."
          onChange={(e) => {
            setValue(e.target.value);
          }}
          value={value}
          className="outline-none px-2 lg:px-4 lg:py-[10px] border-2 border-solid w-11/12 rounded-s-md text-lg text-[#8c8c8c]"
        />

        <button
          onClick={(e) => {
            onFinish(e);
          }}
          className={`${
            isLoading ? "bg-white" : "bg-[#006496]"
          } bg-[#006496] w-7 h-7 lg:w-12 lg:h-12 text-xs text-white flex items-center justify-center rounded-e-md border-[2px] border-[#006496]`}
        >
          {isLoading ? (
            <Loader />
          ) : (
            <CiSearch className="w-7 h-7 lg:font-bold" />
          )}
        </button>
      </form>
    </div>
  );
}
export default SearchUser;
