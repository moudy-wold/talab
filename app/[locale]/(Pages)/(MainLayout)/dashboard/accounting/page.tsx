import React from 'react'
import PageContent from '@/app/[locale]/components/Pages/Accounting/PageContent';
import {GetCommissions} from "@/app/[locale]/api/info";
type Params = {
  params: {
    locale: string;
  };
}
async function Page({ params: { locale } }: Params) {
  const commissions_data = await GetCommissions()
  return (
    <div className="!w-[390px] sm:!w-[640px] md:!w-[768px] lg:!w-full " >
      <div style={{ overflowX: 'auto' }}>
        <PageContent locale={locale} data={commissions_data?.data} />
      </div>
    </div>
  )
}

export default Page
