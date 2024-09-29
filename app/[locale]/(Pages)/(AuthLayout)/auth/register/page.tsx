import Register from '@/app/[locale]/components/Pages/Auth/register/page';

type Props = {
  params: {
    locale: string
  }
}
function Page({ params: { locale } }: Props) {
  return (
    <main className="py-5 md:px-9 min-h-[calc(100vh-221px)]">
      <Register locale={locale} />
    </main>
  );
}

export default Page;
