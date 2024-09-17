"use client";
import React, { useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
  notification
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { CategoriesList } from "@/app/[locale]/utils/constant";

type FieldType = {
  product_name: string;
  category: string;
  quality: string;
  suitable_devices: string;
  images: any;
  currency: string;
  price: string;
  quantity: string;
  discount: string;
  description: string;
  details: {};
  offers: boolean;
};
function CreateProduct({ locale }: any) {
  const { t, i18n } = useTranslation(locale, "common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();
  const [details, setDetails] = useState([{ title: "", content: "" }]);

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const onFinish = ({
    product_name,
    category,
    quality,
    suitable_devices,
    images,
    currency,
    price,
    quantity,
    description,
    discount,
    offers
  }: FieldType) => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("product_name", product_name);
    formData.append("category", category);
    formData.append("quality", quality);
    formData.append("suitable_devices", suitable_devices);
    for (let i = 0; i < images.length; i++) {
      formData.append("images[]", images[i].originFileObj!);
    }
    formData.append("details", JSON.stringify(details));

    formData.append("currency", currency);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("discount", discount);
    // formData.append('offers', "tr");

    // AddService(formData)
    //   .then((res) => {
    //     if (res.status) {
    //       form.resetFields();
    //       setOpenPrint(true)
    //       notification.success({
    //         message: "تم الإضافة  بنجاح"
    //       });
    //       // router.back();

    //     }
    //   })
    //   .catch((err) => {
    //     notification.error({
    //       message: err.response.data.message
    //     });
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const addDetailField = () => {
    setDetails([...details, { title: "", content: "" }]);
  };

  const handleDetailChange = (index: number, field: string, value: string) => {
    const newDetails: any = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
    console.log(newDetails);
  };

  const handleDeleteItemFromDetails = (detail: any) => {
    let newArr = details.filter((item: any) => item.title !== detail.title);
    setDetails(newArr);
  };

  return (
    <div className="">
      <Form
        form={form}
        name="blog-create"
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
        onFinish={onFinish}
        className="lg:grid  lg:grid-cols-2 gap-4"
      >
        {/* Start Producy Name */}
        <Form.Item<FieldType>
          name="product_name"
          label={<span className="text-sm  md:text-base">{t("product_name")}</span>}
          rules={[{ required: true, message: t("please_enter_product_name") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End Producy Name */}

    {/* Start images */}
    <Form.Item<FieldType>
          name="images"
          label={<span className="text-sm md:text-base">{t("product_images")}</span>}
          rules={[{ required: true, message: t("please_enter_photos") }]}
          valuePropName="fileList"
          getValueFromEvent={(e: any) => {
            if (Array.isArray(e)) {
              return e;
            }
            return e?.fileList;
          }}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            className="w-full"
          >
            <Button
              className="w-full h-12 justify-between text-sm md:text-xl"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f6f6f6"
              }}
            >
              <p>  350px * 350px </p>
              <Image
                src="/assets/svg/imageUplaod.svg"
                alt="asd"
                width="24"
                height="24"
              />
            </Button>
          </Upload>
        </Form.Item>
        {/* Start images */}
        {/* Start Category */}
        <Form.Item<FieldType>
          name="category"
          label={<span className="text-sm  md:text-base"> {t("cateory")}</span>}
          rules={[{ required: true, message: t("please_selecte_category") }]}
        >
          <select
            style={{ width: "100%" }}
            className="w-full border-2 border-gray-200 rounded-lg h-12"
          >
            <option disabled value="" key="1">
             {t("please_select")}
            </option>
            {CategoriesList.map((item) => (
              <option value={item.value} key={item.id}>
                {item.value}
              </option>
            ))}
          </select>
        </Form.Item>
        {/* End Category */}

        {/* Start quality */}
        <Form.Item<FieldType>
          name="quality"
          label={<span className="text-sm  md:text-base"> {t("quality_level")}</span>}
          rules={[{ required: true, message: t("please_enter_quality_level") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End quality */}

        {/* Start suitable_devices */}
        <Form.Item<FieldType>
          name="suitable_devices"
          label={<span className="text-sm  md:text-base">{t("devices_that_accept_this_part")}</span>}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End suitable_devices */}

    

        {/* Start price */}
        <Form.Item<FieldType>
          name="price"
          label={<span className="text-sm  md:text-base">{t("price")}</span>}
          rules={[{ required: true, message: t("please_enter_price") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End price */}

        {/* Start currency */}
        <Form.Item<FieldType>
          name="currency"
          label={<span className="text-sm  md:text-base">{t("currency")}</span>}
          rules={[{ required: true, message: t("please_enter_currency") }]}

        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End currency */}

        {/* Start quantity */}
        <Form.Item<FieldType>
          name="quantity"
          label={<span className="text-sm  md:text-base">{t("quantity")}</span>}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End quantity */}

        {/* Start description */}
        <Form.Item<FieldType>
          name="description"
          label={<span className="text-sm  md:text-base">{t("description")}</span>}
          className=""
        >
          <Input.TextArea className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End description */}

       

        {/* Start discount */}
        <Form.Item<FieldType>
          name="discount"
          label={<span className="text-sm  md:text-base">{t("discount_if_there_is")}</span>}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End discount */}

        {/* Start offers */}
        <Form.Item<FieldType>
          name="offers"
          label={<span className="text-sm  md:text-base">{t("is_it_included_in_the_list_of_offers")}</span>}
          className="col-span-2"
        >
          <Switch defaultChecked onChange={onChange} />;
        </Form.Item>
        {/* End offers */}
 {/* Start Details */}
 {details.map((detail, index) => {
          return (
            <div
              key={index}
              className="border-2 border-gray-300 rounded-xl p-2"
            >
              <Form.Item
                label={`${t("feature_title")} ${index + 1}`}
                rules={[{ required: false, message: t("please_enter_the_address") }]}
              >
                <Input
                  value={detail.title}
                  onChange={(e) =>
                    handleDetailChange(index, "title", e.target.value)
                  }
                  className="!rounded-[8px] !py-3"
                />
              </Form.Item>
              <Form.Item
                label={`${t("feature_content")} ${index + 1}`}
                rules={[{ required: false, message: t("please_enter_content") }]}
              >
                <Input
                  value={detail.content}
                  onChange={(e) =>
                    handleDetailChange(index, "content", e.target.value)
                  }
                  className="!rounded-[8px] !py-3"
                />
              </Form.Item>
              <div className="px-1">
                <MdDelete
                  onClick={() => {
                    handleDeleteItemFromDetails(detail);
                  }}
                  className="text-xl hover:text-red-400 hover:scale-110 cursor-pointer transition-all duration-150"
                />
              </div>
            </div>
          );
        })}
        {/* End Details */}
        <div className=" col-span-2">
          <button
            type="submit"
            className="rounded-full w-28 py-2 flex items-center justify-center text-base lg:text-xl text-white bg-[#006496] transition-all hover:bg-white hover:text-[#006496] hover:translate-y-1"
          >
            {t("add")}
          </button>
        </div>
      </Form>
    </div>
  );
}

export default CreateProduct;
