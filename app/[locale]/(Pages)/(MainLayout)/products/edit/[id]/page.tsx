import React from "react";
// import PageContent from '@/app/[locale]/components/Pages/Categories/PageContent';

type Params = {
  params: {
    locale: string;
    id: string;
  };
};
function Page({ params: { locale, id } }: Params) {
  return <div>{/* <PageContent locale={locale}/> */}</div>;
}

export default Page;
