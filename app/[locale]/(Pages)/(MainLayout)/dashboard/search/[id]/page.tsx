import { ProductsSearch} from "@/app/[locale]/api/products";
import { useTranslation } from "@/app/i18n";
import React from "react";
import dynamic from 'next/dynamic'

const ProductsPage = dynamic(() => import('@/app/[locale]/components/Pages/Products/PageContent'), { ssr: false })
type Props = {
  params: { locale: string; id: string };
};
async function Page({ params: { locale, id } }: Props) {
  const data = await ProductsSearch(id,1);  
  const { t } = await useTranslation(locale, "common");
  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >
    <div style={{ overflowX: 'auto' }}>
      <ProductsPage
        search_data={data.data}
        params_searchValue={id}
        locale={locale}
      />
    </div>
    </div>
  );
}

export default Page;
