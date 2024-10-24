import PageContent from '@/app/[locale]/components/Pages/Accounting/PageContent';
import React from 'react'
type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      <PageContent locale={locale}/>
    </div>
  )
}

export default Page
