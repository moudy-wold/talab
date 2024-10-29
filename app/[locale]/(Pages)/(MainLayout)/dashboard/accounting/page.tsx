import PageContent from '@/app/[locale]/components/Pages/Accounting/PageContent';
import React from 'react'
type Params = {
  params: {
    locale: string;
  };
}
function Page({ params: { locale } }: Params) {
  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >


      <div style={{ overflowX: 'auto' }}>

        <PageContent locale={locale} />
      </div>
    </div>
  )
}

export default Page
