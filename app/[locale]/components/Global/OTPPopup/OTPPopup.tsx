"use client";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { Button, Form, Input, notification } from "antd";
import { ConfirmOTP, ResendOTP, ResetPass } from "@/app/[locale]/api/auth";
import Loader from "../Loader/Loader";
import { useForm } from 'antd/es/form/Form';

type FieldType = {
  otp: string;
  password: string;
  rePassword: string;
};

const OTPPopup = (props: any) => {
  const dispatch = useDispatch();
  const [form] = useForm();
  const path = usePathname()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const [otp, setOtp] = useState<string>("");
  const [resendDisabled, setResendDisabled] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  const handleConfirm = async () => {
    setIsLoading(true)
    ConfirmOTP(otp)
      .then((res) => {
        console.log(res)
        router.push("/auth/login")
      })
      .catch((err: any) => {
        notification.error({
          message: err.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }


  const handleResendOTP = async () => {

    ResendOTP()
      .then((res) => {
        console.log(res.status)
        if (res.status) {

          notification.success({
            message: "تمت إعادة إرسال الرمز"
          });
        }
      })
      .catch((err: any) => {
        console.log(err)
        notification.error({
          message: err.response.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });

  };

  const onFinish = async (data: any) => {
    console.log(data)
    console.log(props.emailValue)
    setIsLoading(true)
    if (props.emailValue) {
      ResetPass(data.otp, props.emailValue, data.password)
        .then((res: any) => {
          console.log(res)
          if (res.status) {
            setIsLoading(false)
            notification.success({
              message: "تم إرسال الكود إلى البريد الإلكتروني"
            })
            props.setOpenVerifyPopup(false)
          }
        })
        .catch((err: any) => {
          console.log(err)
          notification.error({
            message: err.response.data.message
          })
          setIsLoading(false)
        })
    } else {
      ConfirmOTP(otp)
        .then((res) => {
          console.log(res)
          if(path.includes("regisrer")){
            router.push("/auth/login")
          }
          notification.success({
            message: "تم تأكيد الحساب بنجاح",
          });
          props.setOpenVerifyPopup(false)
        })
        .catch((err: any) => {
          console.log(err)
          notification.error({
            message: err.response.data.message,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (resendDisabled) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 10000);
    }

    return () => clearInterval(timer);
  }, [resendDisabled]);

  useEffect(() => {
    if (countdown === 0) {
      setResendDisabled(false);
      setCountdown(60);
    }
  }, [countdown]);

  return (
    <div
      className={`absolute inset-0 top-0 flex items-center justify-center z-50`}>
      {isLoading && <Loader />}
      <div className="fixed inset-0 bg-black opacity-50 z-30"></div>
      <Form
        form={form}
        name="send-email"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        className=""
      >
        <div className="flex flex-col bg-white px-10 py-10 rounded-3xl z-50 relative items-center justify-center ">
          <button
            onClick={() => {
              setOtp("");
              props.setOpenVerifyPopup(false);
              if(path.includes("register")){router.push("/auth/login")}
            }}
            className="absolute -top-6 right-0 p-3 rounded-full"
          >
            <Image
              src={"/assets/cancel.svg"}
              alt="cancele"
              width={30}
              height={30}
            />
          </button>
          <h2 className=" font-bold text-3xl text-[#003459] mb-2">
            كود التحقق
          </h2>
          <p className="text-[#00171F]  w-full mt-5">
            أدخل كود التحقق المكون من 6 حانات

          </p>
          <Form.Item<FieldType>
            name="otp"


          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span></span>}
              renderInput={(props) => <input {...props} className="OTP_Input" />}
              containerStyle={{
                marginTop: "1.5rem",
                marginBottom: "8px",
                display: "flex",
                gap: "0.5rem",
              }}
              inputStyle={{
                width: "5rem",
                height: "5rem",
                borderRadius: "8px",
                fontSize: "1rem",
                border: "1px solid #000"
              }}
            />
          </Form.Item>
          <div className="flex items-center justify-cetner text-center gap-3 mb-10 w-full ">
            <p className=" text-[#00171F]"> ألم تستلم الكود </p>
            <p className={`text-[#006496] underline cursor-pointer 
            ${resendDisabled && "text-gray-500"}`}
              onClick={handleResendOTP}
            >
              {resendDisabled
                ? `إعادة الإرسال في ${countdown} ثانية`
                : "إعادة الإرسال"}
            </p>
          </div>
          {props.emailValue && 
          <div className="flex items-center justify-between gap-5 w-full">
            <Form.Item<FieldType>
              name="password"
              className="w-full"
              rules={[
                { required: true, message: 'يرجى إدخال كلمة المرور!' },
                { min: 8, message: 'يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل!' }
              ]}
            >
              <Input.Password placeholder=" كلمة المرور" className="!rounded-[2px] !py-3 placeholder:!text-[#646464]" />
            </Form.Item>

            <Form.Item
              name="rePassword"
              dependencies={['password']}
              className="w-full"
              rules={[
                { required: true, message: 'يرجى تأكيد كلمة المرور!' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('كلمة السر غير متطابقة'));
                  },
                }),
              ]}
            >
              <div>
                <Input.Password placeholder="تأكيد كلمة المرور" className="!rounded-[2px]    !py-3 placeholder:!text-[#646464]" />
              </div>
            </Form.Item>
          </div>}
          {/* <div className=" col-span-2">
            <button
              type="submit" className="rounded-full w-28 py-2 flex items-center justify-center text-base lg:text-xl text-white bg-[#006496] transition-all hover:bg-white hover:text-[#006496] hover:translate-y-1"
            >
              إرسال
            </button>
          </div> */}
          <button
            // onClick={handleConfirm}
            type="submit"
            className="w-full bg-[#006496] text-white font-bold text-xl lg:text-2xl  rounded-xl flex items-center justify-center pb-2 pt-2 hover:text-[#006496] hover:bg-white border-2 border-[#006496] transition-all duration-150"> confirm</button>
        </div>
      </Form>

    </div>
  );
};

export default OTPPopup;
