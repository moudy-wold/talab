"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DatePicker, Form, Input, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import { useTranslation } from "@/app/i18n/client";
import dayjs from 'dayjs';
import moment from "moment";
import { UpdateOfferProduct } from "@/app/[locale]/api/products";
import Loader from "../../../Global/Loader/LargeLoader/LargeLoader";

type FieldType = {
    discount_price: string;
    is_on_offer: boolean;
    offer_start_date: string;
    offer_expiry_date: string;
};

// type Props = {
//     locale: string;
// }
function EditOffer(props: any) {
    const { t } = useTranslation(props.locale, "common");
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const [dates, setDates] = useState<any>({ discount_price: 0, offer_start_date: "", offer_expiry_date: "" })
    const disabledDate = (current: any) => {
        return current && current < dayjs().startOf('day');
    };
    useEffect(() => {
        console.log(props.data)
        if (props.data) {
            form.setFieldValue('offer_start_date', moment(props?.data?.offer_start_date, 'YYYY-MM-DD'));
            form.setFieldValue('offer_expiry_date', moment(props?.data?.offer_expiry_date, 'YYYY-MM-DD'));
            form.setFieldValue('discount_price', +props?.data?.discount_price);

            setDates((prev: any) => ({ ...prev, discount_price: +props?.data?.discount_price }))
            setDates((prev: any) => ({ ...prev, offer_start_date: props?.data?.offer_start_date }))
            setDates((prev: any) => ({ ...prev, offer_expiry_date: props?.data?.offer_expiry_date }))
        }
    }, [props]);



    const onFinish = async () => {
        setIsLoading(true);
        console.log(dates)
        UpdateOfferProduct(props.data.id, "1", dates.discount_price, dates.offer_start_date, dates.offer_expiry_date)
            .then((res) => {
                if (res.status) {
                    notification.success({
                        message: t("edited_product_to_offer_successfully"),
                    });
                }
                setIsLoading(false);
                props.setOpenEditOffer(false);
                router.refresh();
            })
            .catch((err) => {
                // console.log(err)
                setIsLoading(false);
                notification.error({
                    message: err.response.data.message
                });
            });
    }

    return (
        <div className="">
            {isLoading && <Loader />}
            <Form
                form={form}
                name="edit-discount-price"
                initialValues={{ remember: true }}
                autoComplete="off"
                layout="vertical"
                onFinish={onFinish}
            >
                <div className="flex items-center gap-5 mt-5 mb-1 ">
                    {/* Start Discount Price */}
                    <div className=" ">
                        <Form.Item<FieldType>
                            name="discount_price"
                            label={<span className="text-sm  md:text-base !h-10  flex items-center ">{t("discount_price")}</span>}
                            rules={[{ required: props.openEditOffer, message: t("please_enter_discount_price") }]}

                        >
                            <Input placeholder={t("discount_price")} className="!rounded-[8px] !py-[6px]" onChange={(e) => { setDates((prev: any) => ({ ...prev, discount_price: +e.target.value })) }} />
                        </Form.Item>
                    </div>
                    {/* End Discount Price */}

                    {/* Start Start Date */}
                    <div className="w-1/2 ">
                        <Form.Item<FieldType>
                            name="offer_start_date"
                            label={<span className="text-sm  md:text-base">{t("offer_start_date")}</span>}
                            rules={[{ required: props.openEditOffer, message: t("please_enter_start_date") }]}
                        >
                            <DatePicker disabledDate={disabledDate} onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_start_date: option })) }} className={`w-full`} />
                        </Form.Item>
                    </div>
                    {/* End Start Date */}

                    {/* Start End Date */}
                    <div className="w-1/2">
                        <Form.Item<FieldType>
                            name="offer_expiry_date"
                            label={<span className="text-sm  md:text-base">{t("offer_expiry_date")}</span>}
                            rules={[{ required: props.openEditOffer, message: t("please_enter_end_date") }]}
                        >
                            <DatePicker disabledDate={disabledDate} onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_expiry_date: option })) }} className={`w-full`} />
                        </Form.Item>
                    </div>
                    {/* End End Date */}


                </div>
                <div className="flex items-center justify-end mt-4">
                    <button
                        type="submit"
                        className=" border-[1px] border-[#006496] rounded-lg text-base w-16  py-1 flex items-center justify-center  text-[#006496] bg-white transition-all hover:bg-[#006496] hover:text-white"
                    >
                        {t("confirm")}
                    </button>
                </div>
            </Form>


        </div>
    )
}


export default EditOffer;