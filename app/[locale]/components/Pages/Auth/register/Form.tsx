"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { Checkbox, Form, Input, notification, Modal, Button, Upload, Select } from "antd";
import Link from "next/link";
import { Register } from "@/app/[locale]/api/auth";
import { useRouter } from "next/navigation";
import OTPPopup from "@/app/[locale]/components/Global/OTPPopup/OTPPopup";
import ReCAPTCHA from "react-google-recaptcha";
import { useTranslation } from "@/app/i18n/client";
import Image from "next/image";
import axios from "axios";
import { GetMainCategories } from "@/app/[locale]/api/categories";

type Props = {
  locale: string;
}

type FieldType = {
  userName: string;
  phoneNumber: string;
  email: string;
  password: string;
  address: any;
  city: string;
  district: string,
  neighborhoods: string,
  sokak_no: string,
  building_no: string,
  dukkan_no: string;
  flat_no?: string;
  avatar: any;
  accept: boolean;
  rePassword: string;
  district_istanbul: string;
  cities: string;
  categories: any;
  recaptcha: boolean;
  areas_covered: any;
};

const FormComponent = ({ locale }: Props) => {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  // const [capched, setCapched] = useState<string | null>();
  const { push } = useRouter();
  const [getData, setGetData] = useState(false);
  const [selectedCategories, setSlectedCategories] = useState<any>([])
  const AllOption = 'all';

  const [istDistrict, setIstDistrict] = useState<any>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isAllDistrictsSelected, setIsAllDistrictsSelected] = useState(false);

  const [cities, setCities] = useState<any>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [isAllCitiesSelected, setIsAllCitiesSelected] = useState(false);

  const [categories, setCategories] = useState<any>([])
  const [dynamicDistrict, setDynamicDistrict] = useState<any>();
  const [neighborhoodss, setNeighborhoods] = useState()
  const [form] = Form.useForm();
  const handleChangeCategories = (value: string[]) => {
    setSlectedCategories(value)
  };

  const handleChangeIstanbulDistrict = (value: string[]) => {
    if (value.includes(AllOption)) {
      setSelectedDistricts([AllOption]);
      setIsAllDistrictsSelected(true);
    } else {
      setSelectedDistricts(value);
      setIsAllDistrictsSelected(false);
    }
  };

  const handleChangeCities = (value: string[]) => {
    if (value.includes(AllOption)) {
      setSelectedCities([AllOption]);
      setIsAllCitiesSelected(true);
    } else {
      setSelectedCities(value);
      setIsAllCitiesSelected(false);
    }
  };

  const districtsWithAll = [
    { label: 'Select All', value: AllOption },
    ...istDistrict.map((item: any) => ({ ...item, disabled: isAllDistrictsSelected })),
  ];

  const citiesWithAll = [
    { label: 'Select All', value: AllOption },
    ...cities.map((item: any) => ({ ...item, disabled: item.value == 'İstanbul' ? true : isAllCitiesSelected })),
  ];

  const GetCiteisAndDistricts = async () => {
    const url = "https://turkiyeapi.dev/api/v1/";

    // const updatedCities = res?.data?.data?.filter((item: any) => item.name !== `İstanbul`)
    //   .map((item: any) => {
    //     return { 
    //       label: item.name, 
    //       value: item.name,
    //     };
    //   });
    // setCities(updatedCities);



    axios.get(`${url}provinces?fields=name`)
      .then((res) => {
        const updatedCities = res?.data?.data?.map((item: any) => {
          return {
            label: item.name,
            value: item.name,
          }
        });
        setCities(updatedCities);
      })
      .catch((err: any) => {
        console.log(err);
      });

    axios.get(`${url}provinces?name=istanbul`)
      .then((res) => {
        res?.data?.data[0].districts.forEach((item: any) => {
          const obj = { label: item.name, value: item.name }
          setIstDistrict((prev: any) => [...prev, obj])
        })

      })
      .catch((err: any) => {
        console.log(err)
      })


  }

  const onChangeCity = async (value: any) => {
    const distrObj: any = []
    const url = `https://turkiyeapi.dev/api/v1/provinces?name=${value}`
    axios.get(url)
      .then((res: any) => {
        res?.data?.data[0]?.districts.map((item: any) => {
          const obj = { label: item.name, value: item.name, id: item.id }
          distrObj.push(obj)
        })
        setDynamicDistrict(distrObj)
      })
      .catch((err: any) => {
        console.log(err)
      })
  };

  const onChangeDistrict = async (value: any, option: any) => {
    const neighborhoodsObj: any = []

    const url = `https://turkiyeapi.dev/api/v1/districts/${option?.id}`

    axios.get(url)
      .then((res: any) => {
        res?.data?.data?.neighborhoods?.map((item: any) => {
          const obj = { label: item.name, value: item.name, id: item.id }
          neighborhoodsObj.push(obj)
        })
        setNeighborhoods(neighborhoodsObj)
      })
      .catch((err: any) => {
        console.log(err)
      })
  };

  const onFinish = ({
    password,
    email,
    userName,
    phoneNumber,
    avatar,
    city,
    district,
    neighborhoods,
    sokak_no,
    building_no,
    dukkan_no,
    flat_no,
  }: FieldType) => {
    setIsLoading(true);
    let areas_covered: any = [{ country: "turkey", city: { "": [] } }]
    if (isAllDistrictsSelected && isAllCitiesSelected) {
      areas_covered = [{ country: "turkey", city: { all: ["all"] } }]

    } else if (isAllDistrictsSelected && !isAllCitiesSelected) {
      areas_covered = [{ country: "turkey", city: { istanbul: ["all"] } }]
      selectedCities.map((val: any) => {
        areas_covered[0].city = {
          ...areas_covered[0].city,
          [val]: ["all"]
        };

      });
    } else if (!isAllDistrictsSelected && isAllCitiesSelected) {
      areas_covered = [{ country: "turkey", city: { istanbul: [] } }]
      selectedDistricts.map((item) => {
        areas_covered[0].city.istanbul.push(item)
      });
      cities.map((val: any) => {
        areas_covered[0].city = {
          ...areas_covered[0].city,
          [val.value]: ["all"]
        };
      });

    } else if (!isAllDistrictsSelected && !isAllCitiesSelected) {
      areas_covered = [{ country: "turkey", city: { istanbul: [] } }]
      selectedDistricts.map((item) => {
        areas_covered[0].city.istanbul.push(item)
      });
      selectedCities.map((val: any) => {
        areas_covered[0].city = {
          ...areas_covered[0].city,
          [val]: ["all"]
        };
      });
    }

    const Address = { city: city, district: district, neighborhoods: neighborhoods, sokak_no: sokak_no, building_no: building_no, dukkan_no: dukkan_no, flat_no: flat_no }
    const formdata: any = new FormData();
    formdata.append("userName", userName);
    formdata.append("password", password);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("address", JSON.stringify(Address));
    formdata.append("email", email);
    for (let i = 0; i < avatar.length; i++) {
      formdata.append("avatar", avatar[i].originFileObj!);
    }
    formdata.append("categories", JSON.stringify(selectedCategories));
    formdata.append("areas_covered", JSON.stringify(areas_covered));
    
    Register(formdata)
      .then((res) => {
        if (res?.data?.message == "the user exists already") {
          notification.error({
            message: res?.data?.message,
          });
        } else {
          notification.success({
            message: t("register_success"),
          });
          push("/auth/login")
        }
      })
      .catch((err: any) => {
        console.log(err);
        notification.error({
          message: err.response.data.message,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleFinishFailed = (errorInfo:any) => {
    form.scrollToField(errorInfo.errorFields[0].name, {
      behavior: 'smooth',
      block: 'center',
    });
  };

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await GetMainCategories();

        const newCategories = res.data.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setCategories(newCategories);
      } catch (err) {
        console.log(err);
      }
    };

    const getCitiesAndDistricts = async () => {
      try {
        await GetCiteisAndDistricts();
      } catch (err) {
        console.log(err);
      }
    };

    if (!getData) {
      getCategories();
      getCitiesAndDistricts();
      setGetData(true);
    }
  }, [getData]);

  return (
    <div>
      {isLoading && <Loader />}
      <Form
        name="register-form"
        onFinish={onFinish}
        autoComplete="off"
        onFinishFailed={handleFinishFailed}
      >

        {/* Start name */}
        <Form.Item<FieldType>
          name="userName"
          label={<span className="text-sm md:text-base">{t("userName")}</span>}
          rules={[{ required: true, message: t("please_enter_name") }]}
        >
          <Input
            placeholder={t("name")}
            className="!rounded-[2px] !py-3 "
          />
        </Form.Item>
        {/* End name */}

        {/* Start Image */}
        <Form.Item<FieldType>
          name="avatar"
          label={<span className="text-sm md:text-base">{t("profile_image")}</span>}
          rules={[{ required: true, message: t("please_enter_image") }]}
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
            maxCount={1}
            beforeUpload={() => false}
            className="w-full"
          >
            <Button
              className="w-full h-12 justify-between text-sm md:text-xl"
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#f6f6f6",
              }}
            >
              <p> {t("attach_photo_size")}  200px * 200px </p>
              <Image src="/assets/ImgUpdateIcon.svg" alt="sasd" width={24} height={24} className="" />

            </Button>
          </Upload>
        </Form.Item>
        {/* End Image */}

        {/* Start Phone */}
        <Form.Item<FieldType>
          name="phoneNumber"
          label={<span className="text-sm md:text-base">{t("phoneNumber")}</span>}
          rules={[{ required: true, message: t("please_enter_phoneNumber") }]}
        >
          <Input
            placeholder={t("phone_number")}
            className="!rounded-[2px] !py-3 "
          />
        </Form.Item>
        {/* End Phone */}

        {/* Start Email */}
        <Form.Item<FieldType>
          name="email"
          label={<span className="text-sm md:text-base">{t("email")}</span>}
          rules={[{ required: true, type: "email", message: t("please_enter_email"), },]}
        >
          <Input
            placeholder={t("email")}
            className="!rounded-[2px] !py-3 "
          />
        </Form.Item>
        {/* End Email*/}

        {/* Start Password */}
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
              className="!rounded-[2px] !py-3 "
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
                className="!rounded-[2px]    !py-3 "
              />
            </div>
          </Form.Item>
        </div>
        {/*End Password */}

        {/* Start address */}
        <div className="">
          <p className="mb-5">{t("primary_business_address")} :</p>

          <div className="grid grid-cols-3 gap-2">

            {/* Start City */}
            <Form.Item<FieldType>
              name="city"
              rules={[{ required: true, message: t("please_enter_city") }]}
            >

              <Select
                showSearch
                placeholder={t("enter_city")}
                optionFilterProp="label"
                onChange={(e) => onChangeCity(e)}
                options={cities}
              />
            </Form.Item>
            {/* End City */}

            {/* Start District */}
            <Form.Item<FieldType>
              name="district"
              rules={[{ required: true, message: t("please_enter_district") }]}
            >
              <Select
                showSearch
                placeholder={t("enter_district")}
                optionFilterProp="label"
                onChange={(value, option) => onChangeDistrict(value, option)}
                options={dynamicDistrict}
              />
            </Form.Item>
            {/* End District */}

            {/* Start neighborhoods */}
            <Form.Item<FieldType>
              name="neighborhoods"
              rules={[
                { required: true, message: t("please_enter_neighborhoods") },
              ]}
            >
              <Select
                placeholder={t("select_neighborhoods")}
                optionFilterProp="label"
                options={neighborhoodss}
              />
            </Form.Item>
            {/* End District */}
          </div>

          <div className="grid grid-cols-4 gap-2">
            {/* Start Sokak */}
            <Form.Item<FieldType>
              name="sokak_no"
              rules={[{ required: true, message: t("please_enter_sokak_no") }]}
            >
              <Input
                placeholder={t("sokak_no")}
                className="!rounded-[7px] !py-2 "
              />
            </Form.Item>
            {/* End Sokak */}

            {/* Start Building_no */}
            <Form.Item<FieldType>
              name="building_no"
              rules={[{ required: true, message: t("please_enter_building_no") }]}
            >
              <Input
                placeholder={t("building_no")}
                className="!rounded-[7px] !py-2 "
              />
            </Form.Item>
            {/* End Building_no */}

            {/* Start Dukkan_no */}
            <Form.Item<FieldType>
              name="dukkan_no"
              rules={[{ required: true, message: t("please_enter_dukkan_no") }]}
            >
              <Input
                placeholder={t("dukkan_no")}
                className="!rounded-[7px] !py-2 "
              />
            </Form.Item>
            {/* end Dukkan_no */}

            {/* Start Flat */}
            <Form.Item<FieldType>
              name="flat_no"
              rules={[{ required: false, message: t("please_enter_flat") }]}
            >
              <Input
                placeholder={t("flat")}
                className="!rounded-[7px] !py-2 "
              />
            </Form.Item>
            {/* End Flat */}

            {/* Start  */}
          </div>
        </div>
        {/* End address*/}

        {/* Start Categories */}
        <Form.Item<FieldType>
          name="categories"
          label={<span className="text-sm md:text-base">{t("categories")}</span>}
          rules={[{ required: true, message: t("please_enter_categories") }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={t("select_categories")}
            onChange={handleChangeCategories}
            options={categories}
          />
        </Form.Item>
        {/* End Categories */}

        {/* Start Areas Covered */}

        {/* Start Istanbul District */}
        <Form.Item<FieldType>
          name="district_istanbul"
          label={<span className="text-sm md:text-base block w-full">{t("areas_covred_istanbul")}</span>}
          rules={[{ required: true, message: t("please_enter_areas_covred_istanbul") }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={t("select_areas_covred_istanbul")}
            onChange={handleChangeIstanbulDistrict}
            value={selectedDistricts}
            options={districtsWithAll}
          />
        </Form.Item>
        {/* End Istanbul District */}

        {/* Start cities */}
        <Form.Item<FieldType>
          name="cities"
          label={<span className="text-sm md:text-base block w-full">{t("areas_covred_turkey")}</span>}
          rules={[{ required: false, message: t("please_enter_areas_covred_turkey") }]}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={t("select_areas_covred_turkey")}
            onChange={handleChangeCities}
            value={selectedCities}
            options={citiesWithAll}
          />
        </Form.Item>
        {/* End cities */}

        {/* End Areas Covered */}

        {/* Start accept */}
        <Form.Item<FieldType>
          name="accept"
          valuePropName="checked"
          rules={[{ required: true, message: t("please_agree_to_terms_and_conditions") },]}
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
        {/* End accept */}

        {/* Start recaptcha*/}
        <Form.Item<FieldType>
          name="recaptcha"
          rules={[{ required: false, message: t("please_confirm_that_you_are_not_robot") },]}
        >
          {/* <ReCAPTCHA sitekey={process.env.SITE_KEY!} onChange={setCapched} /> */}
          <ReCAPTCHA sitekey={process.env.SITE_KEY!} />
        </Form.Item>
        {/*End  recaptcha*/}

        {/* Start Submit Register */}
        <div className="flex flex-wrap gap-5 items-center justify-center">
          <button
            type="submit"
            className=" rounded-full py-2 md:pb-3 px-5 md:px-10 text-lg md:text-xl border-2 border-[#006496] bg-[#006496] text-white hover:text-[#006496] hover:bg-white transition-all duration-200"
          >
            {t("register_onsite")}
          </button>
        </div>
        {/* End Submit Register */}

        {/* Start Login */}
        <div className="flex items-center w-fit mr-auto mt-8">
          <span> {t("do_you_have_account")}</span>
          <Link href="/auth/login" className="text-[#006496] underline">
            {" "}
            {t("login")}
          </Link>
        </div>
        {/* End Login */}

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
