import React from "react";
import StaticitsList from '@/app/[locale]/components/Pages/Staticits/PageContent';
import { GettStaticits_top_ordered_products, GettStaticits_top_viewed_products } from "@/app/[locale]/api/statiscits";

type Params = {
    params: {
        locale: string;
    };
}
async function Page({ params: { locale } }: Params) {
    const top_Products = await GettStaticits_top_viewed_products()
    const top_Ordered = await GettStaticits_top_ordered_products()
    return (
        <div>
            <StaticitsList locale={locale} top_Products={top_Products?.data?.data} top_Ordered={top_Ordered?.data?.data} />
        </div>
    )
}

export default Page;