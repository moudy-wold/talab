import React from 'react'
import ReturnOrders from "@/app/[locale]/components/Pages/Orders/ReturnOrders/PageContent";

type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
        <ReturnOrders locale={locale} />
    </div>
  )
}

export default Page
