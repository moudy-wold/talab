import Login from '@/app/[locale]/components/Pages/Auth/login/LoginPage';
type Props = {
  params: {
    locale: string
  }
}
function Page({ params: { locale } }: Props) {

  return (

    <main className="py-5 md:px-9">
      <Login locale={locale} />
    </main>
  );
}

export default Page;
