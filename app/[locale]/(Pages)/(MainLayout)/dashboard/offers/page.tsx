import React from 'react'
import OffersPage from '@/app/[locale]/components/Pages/Offers/PageContent';

type Params = {
  params: {
    locale: string;
  };
}
async function Page({ params: { locale } }: Params) {
  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >


      <div style={{ overflowX: 'auto' }}>

        <OffersPage locale={locale} />
      </div>
    </div>
  )
}

export default Page
