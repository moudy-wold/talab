import React from 'react'
// import CategoriesList from '@/app/[locale]/components/Pages/Categories/PageContent';
type Params = {
    params: {
        locale: string;
      };}
function Page({ params: { locale } }:Params) {
  return (
    <div>
      {/* <CategoriesList locale={locale}/> */}
    </div>
  )
}

export default Page
