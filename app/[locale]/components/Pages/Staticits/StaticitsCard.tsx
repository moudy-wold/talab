"use client";
import React from "react";
import Image from "next/image"
import { useTranslation } from "@/app/i18n/client";
import GlobalRating from "../../Global/GlobalRating/GlobalRating";
import { useRouter } from "next/navigation";
type Props = {
    locale: string,
    data: any;
    type: string;
}

function StaticitsCard({ locale, data, type }: Props) {
    const { t } = useTranslation(locale, "common");
    const { push } = useRouter()
    return (
        <div className="p-4">
            {/* Start Top Products */}
            <div className="">
                {/* Start Title */}
                {data.length > 0 &&
                    <h1 className="mb-3 font-semibold text-xl">
                        {type == "top_viewed_product" ? t("top_viewed_products") : t("top_orded_products")}

                    </h1>
                }
                {/* end Title */}

                {/* Start Products */}
                <div className=" grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 items-center justify-between gap-1">
                    {data?.map((item: any, index: number) => {
                        return (
                            <div
                                onClick={() => { push(`/dashboard/products/edit/${item._id}`) }}
                                key={index}
                                className="!h-[232px] cursor-pointer border-2 border-gray-300 rounded-lg p-3 ">
                                {/* Start number_of_visits */}
                                <div className="flex items-center gap-5 justify-center ">
                                    {type == "top_viewed_product" ?
                                        (
                                            <>
                                                <p className="">{t("number_of_visits :")}</p>
                                                <p className="border-2 border-gray-300 py-[0px] px-1 rounded-lg">{item?.visits_count}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="">{t("number_of_ordered :")}</p>
                                                <p className="border-2 border-gray-300 py-[0px] px-1 rounded-lg">{item?.purchase_count}</p>
                                            </>
                                        )}
                                </div>
                                {/* End number_of_visits */}

                                {/* Start  Image && Name && Brand && Price */}
                                <div className="flex items-center gap-2 my-2 py-2 border-t-2 border-gray-300">
                                    {/* Start Image */}
                                    <div className="">
                                        <Image src={item?.images[0]} width={75} height={75} alt={item.name} className="rounded-lg !w-[75px] !h-[75px]" />
                                    </div>
                                    {/* End Image */}

                                    {/* Start Name && Brand && price   */}
                                    <div className="">
                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[80px]">{item.name}</div>
                                        <div className="">{item.brand}</div>
                                    </div>
                                    {/* End Name && Brand && price   */}
                                </div>
                                {/* End Image && Name && Brand && Price */}


                                {/* Start Details */}
                                <div className="flex flex-col gap-4 my-4">
                                    <div className="mx-auto w-fit"><GlobalRating average_rating={item.average_rating} /></div>
                                    <div className="mx-auto w-fit">{item.price} {item.currency == "dolar" ? "$" : "₺"} </div>
                                </div>
                                {/* End Details */}
                            </div>
                        )
                    })}

                </div>
                {/* End Products */}
            </div>
            {/* End Top Products */}
        </div>
    )
}

export default StaticitsCard