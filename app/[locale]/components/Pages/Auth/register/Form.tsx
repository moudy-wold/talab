"use client";
import { useState } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { Checkbox, Form, Input, notification, Modal } from "antd";
import Link from "next/link";
import { RegisterForCustomer } from "@/app/[locale]/api/auth";
import { useRouter } from "next/navigation";
import OTPPopup from "@/app/[locale]/components/Global/OTPPopup/OTPPopup";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "@/app/i18n/client";

type Props = {
  locale: string;
}

type FieldType = {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  rePassword: string;
  accept: boolean;
  recaptcha: boolean;
  address: any;
  avatar: any;
};

const FormComponent = ({ locale }: Props) => {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [capched, setCapched] = useState<string | null>();
  const { push } = useRouter();
  const onFinish = ({
    password,
    email,
    accept,
    userName,
    phoneNumber,
  }: FieldType) => {
    setIsLoading(true);
    const formdata = new FormData();

    formdata.append("userName", userName);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("acceptTerms", accept ? "1" : "0");

    RegisterForCustomer(formdata)
      .then((res) => {
        if (res?.data?.message == "the user exists already") {
          notification.error({
            message: res?.data?.message,
          });
        } else {
          Cookies.set("token", res.data.token, { expires: 7, path: "/" });
          setOpenVerifyPopup(true);
        }
      })
      .catch((err: any) => {
        console.log(err);
        notification.error({
          message: err.responde.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div>
      {isLoading && <Loader />}
      <Form name="register-form" onFinish={onFinish} autoComplete="off">
        <div className="">
          <Form.Item<FieldType>
            name="userName"
            rules={[{ required: true, message: t("please_enter_name") }]}
          >
            <Input
              placeholder={t("name")}
              className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            />
          </Form.Item>
        </div>

        <div className="">
          <Form.Item<FieldType>
            name="phoneNumber"
            rules={[{ required: true, message: t("please_enter_phoneNumber") }]}
          >
            <Input
              placeholder={t("phone_number")}
              className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            />
          </Form.Item>
        </div>

        <Form.Item<FieldType>
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: t("please_enter_email"),
            },
          ]}
        >
          <Input
            placeholder={t("email")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
          />
        </Form.Item>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: t("please_enter_password") },
              {
                min: 8,
                message: t("password_must_at_least_8_characters_long"),
              },
            ]}
            className="!mb-3"
          >
            <Input.Password
              placeholder={t("password")}
              className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            />
          </Form.Item>

          <Form.Item
            name="rePassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: t("please_confirm_your_password") },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t("assword_does_not_match")));
                },
              }),
            ]}
          >
            <div>
              <Input.Password
                placeholder={t("confirm_password")}
                className="!rounded-[2px]    !py-3 placeholder:!text-[#646464]"
              />
            </div>
          </Form.Item>
        </div>
        <div>
          <Form.Item<FieldType>
            name="accept"
            valuePropName="checked"
            rules={[
              { required: true, message: t("please_agree_to_terms_and_conditions") },
            ]}
          >
            <Checkbox rootClassName="gap-2">
              {t("agree_to")}{" "}
              <Link href={"/terms-of-use"} className="text-[#006496] underline">
                {t("terms_and_conditions")}
              </Link>{" "}
              {t("and")}
              <Link
                target="_blank"
                href={"/privacy-policy"}
                className="text-[#006496] underline"
              >
                {t("privacy_policy")}
              </Link>
            </Checkbox>
          </Form.Item>
        </div>

        <div className="">
          <Form.Item<FieldType>
            name="recaptcha"
            rules={[
              { required: true, message: t("please_confirm_that_you_are_not_robot") },
            ]}
          >
            <ReCAPTCHA sitekey={process.env.SITE_KEY!} onChange={setCapched} />
          </Form.Item>
        </div>
        <div className="flex flex-wrap gap-5 items-center justify-center">
          <button
            type="submit"
            className=" rounded-full py-2 md:pb-3 px-5 md:px-10 text-lg md:text-xl border-2 border-[#006496] bg-[#006496] text-white hover:text-[#006496] hover:bg-white transition-all duration-200"
          >
            {t("register_onsite")}
          </button>
        </div>
        <div className="flex items-center w-fit mr-auto mt-8">
          <span> {t("do_you_have_account")}</span>
          <Link href="/auth/login" className="text-[#006496] underline">
            {" "}
            {t("login")}
          </Link>
        </div>
      </Form>
      <Modal
        title={t("account_creation_details")}
        centered
        open={openVerifyPopup}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setOpenVerifyPopup(false);
          push("/auth/login");
        }}
        width={500}
      >
        <OTPPopup setOpenVerifyPopup={setOpenVerifyPopup} locale={locale} />
      </Modal>
    </div>
  );
};

export default FormComponent;
