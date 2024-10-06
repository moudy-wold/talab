'use client'
import { Login } from '@/app/[locale]/api/auth';
import Loader from '@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader';
import { Form, Input, notification } from 'antd';
import Link from 'next/link';
import { useContext, useState } from 'react';
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie';
import { useTranslation } from '@/app/i18n/client';
import { MyContext } from "@/app/[locale]/context/myContext";

type Props = {
  locale: string
}

type FieldType = {
  password?: string;
  email:string;
  remember?: string;
};

function FormComponent({ locale }: Props) {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const { logined, setLogined } = useContext(MyContext);
  const [obj, setObj] = useState({
    email: "",
    password: ""
  });

  const router = useRouter()
  const onFinish = () => {
    setIsLoading(true)
    Cookies.remove('token');
    Login(obj.email, obj.password)
      .then((res) => {
        if (res.status == 201) {
          setIsLoading(false)
          notification.success({
            message: t("succeffly_login")
          })
          Cookies.set('token', res.data.token, { expires: 7, path: "/" });
          localStorage.setItem("isLogend", "true");
          setLogined(true)
          router.push("/dashboard")
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
          name="email"
          rules={[
            { required: true, message: t('please_enter_email') },]}
        >
          <Input
            placeholder={t("email")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            onChange={(e) => setObj((prevState) => ({ ...prevState, email: e.target.value }))}
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
              className=" rounded-full py-2 md:pb-3 px-5 md:px-6 text-lg md:text-xl border-2 border-[#006496] bg-[#006496] text-white hover:text-[#006496] hover:bg-white transition-all duration-200"
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
