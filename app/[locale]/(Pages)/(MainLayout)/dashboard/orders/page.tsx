import React from 'react'
import OrdersList from '@/app/[locale]/components/Pages/Orders/PageContent';
type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >


    <div style={{ overflowX: 'auto' }}>

      <OrdersList locale={locale}/>
    </div>
    </div>
  )
}

export default Page
