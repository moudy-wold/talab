import React from 'react'
import ProductsList from '@/app/[locale]/components/Pages/Products/PageContent';

type Params = {
  params: {
    locale: string;
  };
}
function Page({ params: { locale } }: Params) {

  return (
    <div>
      <ProductsList locale={locale}  />
    </div>
  )
}

export default Page
