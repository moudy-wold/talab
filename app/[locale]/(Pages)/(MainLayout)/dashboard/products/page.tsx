import React from 'react'
import ProductsList from '@/app/[locale]/components/Pages/Products/PageContent';

type Params = {
  params: {
    locale: string;
  };
}
function Page({ params: { locale } }: Params) {

  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >


      <div style={{ overflowX: 'auto' }}>

        <ProductsList locale={locale} />
      </div>
    </div>
  )
}

export default Page
