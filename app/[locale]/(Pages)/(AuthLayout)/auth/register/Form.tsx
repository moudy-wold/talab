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

type FieldType = {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  rePassword: string;
  accept: boolean;
  recaptcha: boolean;
};

const FormComponent: React.FC = () => {
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
            rules={[{ required: true, message: "يرجى إدخال الإسم!" }]}
          >
            <Input
              placeholder="الاسم "
              className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            />
          </Form.Item>
        </div>

        <div className="">
          <Form.Item<FieldType>
            name="phoneNumber"
            rules={[{ required: true, message: "يرجى إدخال رقم الهاتف!" }]}
          >
            <Input
              placeholder="رقم الهاتف"
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
              message: "يرجى إدخال البريد الإلكتروني",
            },
          ]}
        >
          <Input
            placeholder="البريد الالكتروني"
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
          />
        </Form.Item>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: true, message: "يرجى إدخال كلمة المرور!" },
              {
                min: 8,
                message: "يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل!",
              },
            ]}
            className="!mb-3"
          >
            <Input.Password
              placeholder=" كلمة المرور"
              className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
            />
          </Form.Item>

          <Form.Item
            name="rePassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "يرجى تأكيد كلمة المرور!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("كلمة السر غير متطابقة"));
                },
              }),
            ]}
          >
            <div>
              <Input.Password
                placeholder="تأكيد كلمة المرور"
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
              { required: true, message: "يرجى الموافقة على الشروط والأحكام!" },
            ]}
          >
            <Checkbox rootClassName="gap-2">
              أوافق على{" "}
              <Link href={"/terms-of-use"} className="text-[#006496] underline">
                الشروط والأحكام
              </Link>{" "}
              و
              <Link
                target="_blank"
                href={"/privacy-policy"}
                className="text-[#006496] underline"
              >
                سياسة الخصوصية
              </Link>
            </Checkbox>
          </Form.Item>
        </div>

        <div className="">
          <Form.Item<FieldType>
            name="recaptcha"
            rules={[
              { required: true, message: "يرجى تأكيد أنك لست إنسان آلي!" },
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
            التسجيل في الموقع
          </button>
        </div>
        <div className="flex items-center w-fit mr-auto mt-8">
          <span> لديك حساب؟ </span>
          <Link href="/auth/login" className="text-[#006496] underline">
            {" "}
            تسجيل الدخول
          </Link>
        </div>
      </Form>
      <Modal
        title="تفاصيل إنشاء الحساب"
        centered
        open={openVerifyPopup}
        okButtonProps={{ style: { display: "none" } }}
        onCancel={() => {
          setOpenVerifyPopup(false);
          push("/auth/login");
        }}
        width={500}
      >
        <OTPPopup setOpenVerifyPopup={setOpenVerifyPopup} />
      </Modal>
    </div>
  );
};

export default FormComponent;
