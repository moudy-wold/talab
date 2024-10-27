import React from "react";
import EditProduct from '@/app/[locale]/components/Pages/Products/Edit/EditProduct';
import { GetProductById } from "@/app/[locale]/api/products";

type Params = {
  params: {
    locale: string;
    id: string;
  };
};
async function Page({ params: { locale, id } }: Params) {
  return (
    <div>
      <EditProduct locale={locale} id={id} />
    </div>)
}

export default Page;
