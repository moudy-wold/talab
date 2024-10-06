import React from 'react'
import OffersPage from '@/app/[locale]/components/Pages/Offers/PageContent';

type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      <OffersPage locale={locale}/>
    </div>
  )
}

export default Page
