"use client"
import React from "react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";

function OrderDataCards({ data, locale }: any) {
    const { t } = useTranslation(locale, "common");
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.order_details.map((item: any, index: number) => {
                const obj = JSON.parse(item.details)
                const arrDetails = []
                for (const key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        const newObject: any = { label: key, value: obj[key] };
                        arrDetails.push(newObject);
                    }
                }
                return (
                    <div key={index}>
                        <div className='p-5 border-2 border-gray-200 rounded-lg my-3'>
                            <div className='grid grid-cols-[20%_79%] gap-4'>

                                {/* Start Image */}
                                <div>
                                    <Image src={item?.product ? item?.product?.images[0] : "/"} alt={"data.id"} width={100} height={145} className='rounded-lg !w-[100px] !h-[100px] border-2 ' />
                                </div>
                                {/* End Image */}

                                {/* Start Details */}
                                <div className=''>
                                    <h1 className='text-gray-600'>{item?.product_name}</h1>
                                    <div className="flex items-center gap-1">
                                        <p className="">{t("quantity:")} </p>
                                        <p className='text-base text-[#555] my-1'> {item?.quantity}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <p className="">{t("price :")} </p>
                                        <p className='text-[#006496] text-lg my-1'> {item?.price}</p>
                                    </div>
                                    {/* Start Details */}
                                    <div className="flex flex-wrap items-center gap-1  my-1">
                                        {arrDetails.map((detail: any) => {
                                            return (
                                                <div className="bg-white border-gray-300 border-2 rounded-md" key={item.id}>
                                                    <span className=" p-2 px-4 text-lg lg:text-xl text-[#006496]">
                                                        {detail.label}
                                                    </span>
                                                    <span className="p-2 text-base lg:text-lg">
                                                        {detail.value}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/* End Details */}

                                </div>
                                {/* End Details */}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
export default OrderDataCards;