import React from 'react'
import CreateProduct from '@/app/[locale]/components/Pages/Products/Create/CreateProduct';
type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      <CreateProduct locale={locale}/>
    </div>
  )
}

export default Page
