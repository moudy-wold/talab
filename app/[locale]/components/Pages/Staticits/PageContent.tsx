"use client";
import React from "react";
import StaticitsCard from "./StaticitsCard";
type Props = {
    locale: string;
    top_Products: any;
    top_Ordered: any;
}
function StaticitsList({ locale, top_Products, top_Ordered }: Props) {
    return (
        <div className="">

            {/* Start Top Products */}
            <div>
                <StaticitsCard locale={locale} data={top_Products} type="top_viewed_product" />
            </div>
            {/* End Top Products */}


            {/* Start Top ordered */}
            <div className="my-10">
                <StaticitsCard locale={locale} data={top_Ordered} type="top_ordered" />
            </div>
            {/* End Top ordered */}
        </div>)
}
export default StaticitsList