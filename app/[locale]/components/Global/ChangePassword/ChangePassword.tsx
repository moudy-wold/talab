'use client';
import { ForgetPass } from "@/app/[locale]/api/auth";
import Loader from '@/app/[locale]/components/global/Loader/Loader';
import { Alert, Form, Input, Modal, notification } from 'antd';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'antd/es/form/Form';
import OTPPopup from '@/app/[locale]/components/global/OTPPopup/OTPPopup';

type FieldType = {
  email: string;
};

function FormComponent(props:any) {
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [openVerifyPopup, setOpenVerifyPopup] = useState(false)
  const [emailValue, setEmailValue] = useState("")
  const router = useRouter();

  const onFinish = async ({email}: FieldType) => {
    setIsLoading(true)
    setEmailValue(email)
    ForgetPass(email)
    .then((res:any)=>{
        console.log(res)
        if(res.status){
          setIsLoading(false)
            notification.success({
                message:"تم إرسال الكود إلى البريد الإلكتروني"
            })
        setOpenVerifyPopup(true)   
        }
    })
    .catch((err:any)=>{
        console.log(err)
        notification.error({
            message:err.response.data.message
        })
        setIsLoading(false)
    })
}

  return (
    <div className="m-auto p-4">
      <Loader isLoading={isLoading} />
      {errors.length !== 0 && (
        <div className="my-4">
          <Alert message="خطأ" description={errors} type="error" showIcon />
        </div>
      )}

      <h1 className="text-primary-foreground text-xl md:text-xl xl:text-3xl text-center mb-7 font-semibold">
        أرسل طلب تغيير كلمة السر
      </h1>

      <div>
        <Form
          form={form}
          name="send-email"
          initialValues={{ remember: true }}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
          className=""
        >
          <Form.Item<FieldType>
            name="email"
            className="block"
            label={<span className="text-sm  md:text-base">البريد الإلكرتوني</span>}
            rules={[{ required: true, message: "الرجاء إدخال البريد الإلكرتوني" }]}
          >
            <Input
              placeholder="الرجاء إدخال البريد الإلكرتوني"
              className="!rounded-[8px] !py-3  w-full block" />
          </Form.Item>
          <div className=" col-span-2">
            <button
              type="submit" className="rounded-full w-28 py-2 flex items-center justify-center text-base lg:text-xl text-white bg-[#006496] transition-all hover:bg-white hover:text-[#006496] hover:translate-y-1"
            >
              إرسال
            </button>
          </div>
        </Form>

      </div>

      <div className="text-[#A0A0A0] text-sm  mt-4">
        أتريد تسجيل الدخول؟{' '}
        <Link href={'/auth/login'} className="text-[#006496] underline">
          تسجيل الدخول
        </Link>
      </div>
      <Modal
        title="تفاصيل إنشاء الحساب"
        centered
        open={openVerifyPopup}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => { setOpenVerifyPopup(false); router.push("/auth/login"); }}
        width={500}
      >
        <OTPPopup setOpenVerifyPopup={setOpenVerifyPopup} emailValue={emailValue}/>
      </Modal>
    
    </div>
  );
};

export default FormComponent;
