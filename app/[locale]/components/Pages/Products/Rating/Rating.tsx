import React from "react";
import Image from "next/image";
import { useTranslation } from "@/app/i18n/client";

import moment from "moment";
type Props = {
    locale: any,
    reviews: any,
    product_id?: string,
    store?: boolean,
}
function Rating({ locale, reviews }: Props) {
    const { t } = useTranslation(locale, "common");
     
    const ratingMarge =[false, false, false, false, false]
    return (
        <div className="py-7 px-5 border-t-2 border-gray-300 ">
            {/* Start Title */}
            <div>
                <h1 className="w-fit border-b-[1px] border-black text ">{t("reviews")}</h1>
            </div>
            {/* End Title */}


            {/* Start Show Reviews */}
            {reviews?.length == 0 && <p className="mt-2">{t("no_reviews_yet")}</p>}
            <div className="flex flex-col gap-3 mt-3 p-3">
                {reviews?.map((re: any,index:any) => {
                    // Rating
                    const updatedMarge = ratingMarge.map((_, index) => index < re.rating);
                    return (
                        <div key={index} className="min-w-[220px] !max-w-[350px] my-3">
                            <div className=" bg-[#f0f2f5] p-2 px-3 rounded-lg">
                                <div className="flex items-center justify-between">
                                    {/* Start Name */}
                                    <p className="">{re.user_name}</p>
                                    {/* End Name */}

                                    {/* Start User Rating */}
                                    <ul className="flex gap-1 ">
                                        {updatedMarge?.map((item: any,index:number) => (
                                            <li className="" key={index}>
                                                {item ?
                                                    <Image alt="star" src="/assets/svg/fullStar.svg" width={17} height={17} className="" />
                                                    :
                                                    <Image alt="star" src="/assets/svg/emptyStar.svg" width={15} height={15} className="" />
                                                }
                                            </li>
                                        ))}

                                    </ul>
                                    {/* End User Rating */}
                                </div>

                                {/* Start review */}
                                <p>{re.review}</p>
                                {/* End review */}
                            </div>
                            <div className="flex items-center gap-4 p-[2px]">
                                <span className="text-[13px] ">{moment(re.created_at).locale("en").format("DD/MM/YYYY HH:mm")}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* End Show Reviews */}           
        </div>
    )
}
export default Rating