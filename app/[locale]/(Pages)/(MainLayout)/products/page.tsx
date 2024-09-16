import React from 'react'
// import PageContent from '@/app/[locale]/components/Pages/Categories/PageContent';

type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      {/* <PageContent locale={locale}/> */}
    </div>
  )
}

export default Page
