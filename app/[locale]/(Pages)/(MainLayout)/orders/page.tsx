import React from 'react'
import OrdersList from '@/app/[locale]/components/Pages/Orders/PageContent';
type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      <OrdersList locale={locale}/>
    </div>
  )
}

export default Page
