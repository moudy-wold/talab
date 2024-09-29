import ChangePassword from '@/app/[locale]/components/Pages/Auth/change-password/page';
type Props = {
  params: {
    locale: string
  }
}
function ForgotPassword({ params: { locale } }: Props) {

  return (
    <main className="py-5 md:px-9">
      <ChangePassword locale={locale} />
    </main>
  );
}

export default ForgotPassword;
