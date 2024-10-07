"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Switch,
  Upload,
  notification,
  DatePickerProps,
  DatePicker
} from "antd";
import { useForm } from "antd/es/form/Form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import { CategoriesList, Currencies } from "@/app/[locale]/utils/constant";
import { GetMainCategories, GetSubCategories } from "@/app/[locale]/api/categories";
import { GetProductById, EditProductById } from "@/app/[locale]/api/products";
import LargeLoader from "../../../Global/Loader/LargeLoader/LargeLoader";
import FetchImageAsFile from "../../../Global/FetchImageAsFile/FetchImageAsFile";
import useSwr from 'swr';
import moment from "moment";
import dayjs from 'dayjs';


type FieldType = {
  product_name: string;
  category: string;
  quality: string;
  images: any;
  brand: any;
  currency: string;
  main_categories: string;
  sub_categories: string;
  price: string;
  quantity: string;
  discount_price: string;
  description: string;
  is_on_offer: boolean;
  compatible_models: any;
  details: {};
  offer_expiry_date: string;
};

type Props = {
  locale: string;
  id: string;

}
function EditProduct({ locale, id }: Props) {
  const { t, i18n } = useTranslation(locale, "common");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [form] = useForm();
  const [details, setDetails] = useState([{}]);
  const [compatible_models, setCompatible_models] = useState<any>([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory_id, setSubCategory_id] = useState("");
  const [is_offer, setIs_offer] = useState(false);
  const [loading_cate, setLoading_cate] = useState(false)
  const [dates, setDates] = useState<any>({ offer_start_date: "", offer_expiry_date: "" })
  const [getData, setGetData] = useState(true);
  const { data: ProductData, isLoading: EditLoading } = useSwr(
    `/talab/products/${id}`,
    () => GetProductById(id)
  );
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };
  useEffect(() => {
    const data = ProductData?.data;

    if (data) {
      if (getData) {
        console.log(data.data)

        data?.data?.details.map((item: any) => {
          setDetails(prevDetails => [...prevDetails, { title: item.title, content: item.content }]);
        });
        details.shift();

        // Object.entries(data?.data?.details).map(([key, value]) => {
        //   return form.setFieldValue(key, value);
        // });

        data?.data?.compatible_models.map((item: any) => {
          setCompatible_models((prev: any) => [...prev, item])
        })

        form.setFieldValue('product_name', data?.data?.name);
        form.setFieldValue('main_categories', data?.data?.category_main.name);
        form.setFieldValue('sub_categories', data?.data?.category_sub.name);
        form.setFieldValue(
          'images',
          data.data.images.map((image: any) => ({
            uid: String(image),
            name: image,
            status: 'done',
            url: image,
          }))
        );
        form.setFieldValue('quantity', data?.data?.quantity);
        form.setFieldValue('price', data?.data?.price);
        form.setFieldValue('brand', data?.data?.brand);
        form.setFieldValue('description', data?.data?.description);
        form.setFieldValue('is_on_offer', data?.data?.is_on_offer == 1 ? true : false);
        form.setFieldValue('offer_start_date', moment(data?.data?.offer_start_date, 'YYYY-MM-DD HH:mm:ss'));
        form.setFieldValue('offer_expiry_date', moment(data?.data?.offer_expiry_date, 'YYYY-MM-DD HH:mm:ss'));
        form.setFieldValue('discount_price', +data?.data?.discount_price);



        let sub = data?.data?.category_main?.children.map((item: any) => ({ label: item.name, value: item.id }))
        setSubCategories(sub)

        setSubCategory_id(data?.data?.category_sub?.id);

        setIs_offer(data?.data?.is_on_offer == 1 ? true : false)
        setGetData(false);
      }
    }
  }, [ProductData]);

  const Get_main_categories = async () => {
    try {
      const res = await GetMainCategories();
      let sub = res.data.data.map((item: any) => ({ label: item.name, value: item.id }))
      setMainCategories(sub)
    } catch (err: any) {
      console.log(err)
    }
  }

  const onChange_main_categories = async (value: string, option: any) => {
    setLoading_cate(true)
    try {
      const res = await GetSubCategories(option.value)
      let cate = res.data.data.map((item: any) => ({ label: item.name, value: item.id }))
      setLoading_cate(false)
      setSubCategories(cate)
    }
    catch (err: any) {
      console.log(err)
      setLoading_cate(false)
    }
  }

 

  const onFinish = async ({
    product_name,
    images,
    quantity,
    price,
    quality,
    brand,
    description,
    discount_price,
    is_on_offer,
    currency,
  }: FieldType) => {
    setIsLoading(true);

    const formData: any = new FormData();
    let filteredDetails = details.filter((item: any) => item.title !== '');
    let filteredModles = compatible_models.filter((item: any) => item !== '');


    formData.append("name", product_name);
    formData.append("categoryId", subCategory_id);
    formData.append("quantity", quantity);
    formData.append("price", price);
    formData.append("brand", brand)
    formData.append("description", description)
    formData.append("quality", quality);

    //  start image fixed  ****************************
    const imageFiles = await Promise.all(
      images.map(async (file: any) => {
        if (file.url) {
          return await FetchImageAsFile(file.url, file.url.split('/').pop() || 'image.jpg');
        }
        return file.originFileObj;
      })
    );

    imageFiles.forEach((file: any) => {
      formData.append('images[]', file);
    });

    formData.append("_method", "put");
    // End Fixed Code *************

    formData.append('is_on_offer', is_on_offer ? "1" : "0");
    if (is_on_offer) {
      formData.append("discount_price", discount_price);
      formData.append('offer_start_date', dates.offer_start_date);
      formData.append('offer_expiry_date', dates.offer_expiry_date);
    }
    formData.append("currency", currency);
    formData.append("compatible_models", JSON.stringify(filteredModles));
    formData.append("details", JSON.stringify(filteredDetails));


    EditProductById(id, formData)
      .then((res) => {
        if (res.status) {
          form.resetFields();
          notification.success({
            message: t("edit_successfully")
          });
          router.back();
        }
      })
      .catch((err) => {
        console.log(err)
        notification.error({
          message: err.response.data.message
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Start Details
  const addDetailField = () => {
    setDetails([...details, { title: "", content: "" }]);

  };

  const handleDetailChange = (index: number, field: string, value: string) => {
    const newDetails: any = [...details];
    newDetails[index][field] = value;
    setDetails(newDetails);
  };


  const handleDeleteItemFromDetails = (detail: any) => {
    let newArr = details.filter((item: any) => item.title !== detail.title);
    setDetails(newArr)
  }

  // End Details

  // Start compatible_models
  const addModelField = () => {
    setCompatible_models([...compatible_models, ""]);
  };

  const handleModelChange = (index: number, value: string) => {
    // setCompatible_models((prev: any) => [...prev, value]); 
    const newModel: any = [...compatible_models];
    newModel[index] = value;
    setCompatible_models(newModel);
  };

  const handleDeleteItemFromModel = (detail: any) => {
    let newArr = compatible_models.filter((item: any) => item !== detail);
    setCompatible_models(newArr);
  };
  // End compatible_models

  useEffect(() => {
    Get_main_categories()
  }, []);

  return (
    <div className="">
      {isLoading && <LargeLoader />}
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
              <p>{t("attach_photo_size")}  350px * 350px </p>
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

        {/* Start Main Category */}
        <Form.Item<FieldType>
          name="main_categories"
          label={<span className="text-sm  md:text-base">{t("main_category")}</span>}
          rules={[{ required: true, message: t("please_enter_main_category") }]}
        >
          <Select
            showSearch
            placeholder={t("select_main_category")}
            optionFilterProp="label"
            onChange={(value, option) => onChange_main_categories(value, option)}
            options={mainCategories}
            className="!h-12"
          />
        </Form.Item>
        {/* End Main  Category */}

        {/* Start Sub Category */}
        <Form.Item<FieldType>
          name="sub_categories"
          label={<span className="text-sm  md:text-base">{t("sub_category")}</span>}
          rules={[{ required: true, message: t("please_enter_sub_category") }]}
        >
          <Select
            showSearch
            placeholder={t("select_sub_category")}
            optionFilterProp="label"
            onChange={(value, option: any) => { setSubCategory_id(option?.value) }}
            options={subCategories}
            loading={loading_cate}
            className="!h-12"
          />
        </Form.Item>
        {/* End Sub Category */}

        {/* Start quality */}
        <Form.Item<FieldType>
          name="quality"
          label={<span className="text-sm  md:text-base"> {t("quality_level")}</span>}
          rules={[{ required: true, message: t("please_enter_quality_level") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End quality */}

        {/* Start price */}
        <Form.Item<FieldType>
          name="price"
          label={<span className="text-sm  md:text-base">{t("price")}</span>}
          rules={[{ required: true, message: t("please_enter_price") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End price */}

        {/* Start brand */}
        <Form.Item<FieldType>
          name="brand"
          label={<span className="text-sm  md:text-base">{t("brand")}</span>}
          rules={[{ required: true, message: t("please_enter_brand") }]}
        >
          <Input className="!rounded-[8px] !py-3" />
        </Form.Item>
        {/* End brand */}

        {/* Start currency */}
        <Form.Item<FieldType>
          name="currency"
          label={<span className="text-sm  md:text-base">{t("currency")}</span>}
          rules={[{ required: true, message: t("please_select_currency") }]}
        >
          <Select
            placeholder={t("select_currency")}
            optionFilterProp="label"
            // onChange={(value, option: any) => { setSubCategory_id(option?.value) }}
            options={Currencies}
            className="!h-12"
          />
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

        {/* Start offers On Of */}
        <Form.Item<FieldType>
          name="is_on_offer"
          label={<span className="text-sm  md:text-base">{t("is_it_included_in_the_list_of_offers")}</span>}
        >
          <Switch onChange={() => { setIs_offer(!is_offer) }} />
        </Form.Item>
        {/* End offers On Of*/}

        {/* Start Offer Details */}
        {is_offer &&
          <div className="col-span-2 flex gap-8 items-center ">
            {/* Start discount */}
            <Form.Item<FieldType>
              name="discount_price"
              label={<span className="text-sm  md:text-base">{t("discount_price")}</span>}
              className="w-1/2"
            >
              <Input className="!rounded-[8px] !py-3" />
            </Form.Item>
            {/* End discount */}
            {/* Start Start Date */}
            <div className="w-1/2 ">
              <Form.Item<FieldType>
                name="offer_start_date"
                label={<span className="text-sm  md:text-base">{t("offer_start_date")}</span>}
                rules={[{ required: is_offer, message: t("please_enter_start_date") }]}
              >
                <DatePicker disabledDate={disabledDate} onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_start_date: option })) }} className={`w-full !h-12`} />
              </Form.Item>
            </div>
            {/* End Start Date */}
            {/* Start Date For Offer */}
            <Form.Item<FieldType>
              name="offer_expiry_date"
              label={<span className="text-sm  md:text-base">{t("offer_start_date")}</span>}
              rules={[{ required: false, message: t("please_enter_start_date") }]}
              className={` w-1/2`}
            >
              <DatePicker disabledDate={disabledDate} onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_start_date: option })) }} className={`w-full !h-12`} />
            </Form.Item>

            {/* End Date For Offer */}
          </div>
        }
        {/* End Offer Details */}



        {/* Start compatible_models */}
        <div className="col-span-2">
          <p className="mt-8 mb-3 col-span-2">{t("suitable_devices_for_this_product")} </p>
          <div className="col-span-2 grid grid-cols-4 gap-5">
            {compatible_models.map((model: string, index: number) => {
              return (
                <div
                  key={index}
                  className="p-2 pb-0 border-2 border-gray-300 rounded-lg  "
                >
                  <Form.Item
                    rules={[{ required: true, message: t("please_enter_content") }]}
                    className=""
                  >
                    <div className="px-1 flex items-center justify-between">
                      <p>{`${t("device")} ${index + 1}`}</p>
                      <MdDelete
                        onClick={() => {
                          handleDeleteItemFromModel(model);
                        }}
                        className="text-xl hover:text-red-400 hover:scale-110 cursor-pointer transition-all duration-150"
                      />
                    </div>

                    <Input
                      value={model}
                      onChange={(e) =>
                        handleModelChange(index, e.target.value)
                      }
                      placeholder={t(`compatible_with_any_device`)}
                      className="!rounded-[8px] !py-3 mt-1"
                    />
                  </Form.Item>
                </div>
              );
            })}

            <div className="w-full flex items-center ">
              <Button className="w-full h-12" onClick={addModelField}>
                {t("add_new_device")}
              </Button>

            </div>
          </div>
        </div>
        {/* End compatible_models */}


        {/* Start Details */}
        <div className="col-span-2">
          <p className="mt-8 ">{t("product_details")} </p>
          <div className="col-span-2 grid grid-cols-4 gap-5">
            {
              details.map((detail: any, index: number) => {
                return (
                  <div key={index} className="border-2 border-gray-300 rounded-xl p-2 my-3">
                    <Form.Item
                      label={`${t("feature_title")} ${index + 1}`}
                      rules={[{ required: false, message: t("please_enter_title") }]}
                    >
                      <Input
                        value={detail.title}
                        onChange={(e) => handleDetailChange(index, "title", e.target.value)}
                        className="!rounded-[8px] !py-3"
                      />
                    </Form.Item>
                    <Form.Item
                      label={`${t("feature_content")} ${index + 1}`}
                      rules={[{ required: false, message: t("please_enter_content") }]}
                    >
                      <Input
                        value={detail.content}
                        onChange={(e) => handleDetailChange(index, "content", e.target.value)}
                        className="!rounded-[8px] !py-3"
                      />
                    </Form.Item>
                    <div className="px-1 my-3">

                      <MdDelete
                        onClick={() => { handleDeleteItemFromDetails(detail) }}
                        className="text-xl hover:text-red-400 hover:scale-110 cursor-pointer transition-all duration-150" />

                    </div>
                  </div>
                );
              })
            }

            <div className="w-full flex items-center ">
              <Button className="w-full h-12" onClick={addDetailField}>
                {t("add_new_feature")}
              </Button>

            </div>
          </div>
        </div>
        {/* End Details */}
        <div className=" col-span-2">
          <button
            type="submit"
            className="my-10 border-2 border-[#006496] rounded-full w-28 py-2 flex items-center justify-center text-base lg:text-xl text-white bg-[#006496] transition-all hover:bg-white hover:text-[#006496]"
          >
            {t("edit")}
          </button>
        </div>
      </Form>
    </div>
  );
}


export default EditProduct;
