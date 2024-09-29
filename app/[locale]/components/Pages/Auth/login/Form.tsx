'use client'
import { Login } from '@/app/[locale]/api/auth';
import Loader from '@/app/[locale]/components/Global/Loader/Loader';
import { Form, Input, notification } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import { useTranslation } from '@/app/i18n/client';

type Props = {
  locale: string
}

type FieldType = {
  phoneNumber?: string;
  password?: string;
  remember?: string;
};

function FormComponent({ locale }: Props) {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [obj, setObj] = useState({});
  const router = useRouter()
  const onFinish = () => {
    setIsLoading(true)
    Cookies.remove('token');
    Login(obj)
      .then((res) => {
        if (res.status == 201) {
          setIsLoading(false)
          notification.success({
            message: t("register_success")
          })
          Cookies.set('token', res.data.token, { expires: 7, path: "/" });
          localStorage.setItem("userRole", JSON.stringify(res?.data?.data?.role));
          localStorage.setItem("userId", JSON.stringify(res.data.data._id))
          const ids = res?.data?.data?.Wishlists?.map((obj: any) => obj._id);
          localStorage.setItem("userWishList", JSON.stringify(ids))

          router.push("/")
          console.log(res.data.data)
        }
      })
      .catch((err: any) => {
        setIsLoading(false)
        console.log(err)
        notification.error({
          message: err.response.data.message
        })
      })
  };

  return (
    <>
      {isLoading && <Loader />}
      <Form
        name="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          name="phoneNumber"
          rules={[
            { required: true, message: t('please_enter_phone_number_correctly') },]}
        >
          <Input
            placeholder={t("phone_number")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            onChange={(e) => setObj((prevState) => ({ ...prevState, phoneNumber: e.target.value }))}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: t('please_enter_valid_password') }]}
        >
          <Input.Password
            placeholder={t("password")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            onChange={(e) => setObj((prevState) => ({ ...prevState, password: e.target.value }))} />
        </Form.Item>

        <div className="flex justify-end">
          <Link
            href={'/auth/change-password'}
            className="text-primary-foreground underline "
          >
            {t("forgot_your_password")}
          </Link>
        </div>

        <div className="flex flex-wrap gap-5 items-center justify-between mt-14">
          <div>
            <button
              type="submit"
              className=" rounded-full py-2 md:pb-3 px-5 md:px-10 text-lg md:text-xl border-2 border-[#006496] bg-[#006496] text-white hover:text-[#006496] hover:bg-white transition-all duration-200"
            >
              {t("login")}
            </button>
          </div>
          <div className="flex items-center">
            <span>{t("dnot_have_account")} </span>
            <Link href="/auth/register" className='text-[#006496] underline'> {t("create_account")}</Link>
          </div>
        </div>
      </Form>

    </>
  );
};

export default FormComponent;
