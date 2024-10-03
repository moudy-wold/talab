"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { Checkbox, Form, Input, notification, Modal, Button, Upload, Select, Space } from "antd";
import type { SelectProps } from 'antd';
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
  avatar: any;
  accept: boolean;
  rePassword: string;
  district: string;
  cities: string;
  categories: any;
  recaptcha: boolean;
  areas_covered: any;
};

const FormComponent = ({ locale }: Props) => {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const [openVerifyPopup, setOpenVerifyPopup] = useState<boolean>(false);
  const [capched, setCapched] = useState<string | null>();
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

  const handleChangeCategories = (value: string[]) => {
    setSlectedCategories((prev: any) => [...prev, value])
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
      // let newCity = { "all": [] }
      // setAreasCovered((prevAreasCovered: any) =>
      //   prevAreasCovered.map((area: any) =>
      //     area.country === "turkey" ? { ...area, city: newCity } : area
      //   )
      // );
    } else {
      setSelectedCities(value);
      setIsAllCitiesSelected(false);
      // let newCity: any = {};
      // value.map((val: any) => {
      //   newCity = {
      //     ...newCity,
      //     [val]: "all"
      //   };
      // });
      // setAreasCovered((prevAreasCovered: any) =>
      //   prevAreasCovered.map((area: any) =>
      //     area.country === "turkey" ? { ...area, city: newCity } : area
      //   )
      // );
    }
  };

  const districtsWithAll = [
    { label: 'Select All', value: AllOption },
    ...istDistrict.map((item: any) => ({ ...item, disabled: isAllDistrictsSelected })),
  ];

  const citiesWithAll = [
    { label: 'Select All', value: AllOption },
    ...cities.map((item: any) => ({ ...item, disabled: isAllCitiesSelected })),
  ];

  const GetCiteisAndDistricts = async () => {
    const url = "https://turkiyeapi.dev/api/v1/";

    axios.get(`${url}provinces?fields=name`)
      .then((res) => {
        res?.data?.data?.forEach((item: any) => {
          let obj = { label: item.name, value: item.name }
          setCities((prev: any) => [...prev, obj])
        })
      })
      .catch((err: any) => {
        console.log(err)
      })

    axios.get(`${url}provinces?name=istanbul`)
      .then((res) => {
        res?.data?.data[0].districts.forEach((item: any) => {
          let obj = { label: item.name, value: item.name }
          setIstDistrict((prev: any) => [...prev, obj])
        })

      })
      .catch((err: any) => {
        console.log(err)
      })


  }


  const onFinish = ({
    password,
    email,
    userName,
    phoneNumber,
    address,
    avatar,
    accept,
  }: FieldType) => {
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
    console.log(areas_covered)
    // setIsLoading(true);
    const formdata: any = new FormData();

    formdata.append("userName", userName);
    formdata.append("password", password);
    formdata.append("phoneNumber", phoneNumber);
    formdata.append("address", address);
    formdata.append("email", email);
    for (let i = 0; i < avatar.length; i++) {
      formdata.append("avatar", avatar[i].originFileObj!);
    }
    formdata.append("categories[]", selectedCategories);
    formdata.append("areas_covered[]", JSON.stringify(areas_covered));

    // for (var pair of formdata.entries()) {
    //   console.log(pair[0] + ', ' + pair[1]);
    // }
    Register(formdata)
      .then((res) => {
        if (res?.data?.message == "the user exists already") {
          notification.error({
            message: res?.data?.message,
          });
        } else {
          notification.error({
            message: t("register_success"),
          });

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
      <Form name="register-form" onFinish={onFinish} autoComplete="off">

        {/* Start name */}
        <Form.Item<FieldType>
          name="userName"
          rules={[{ required: false, message: t("please_enter_name") }]}
        >
          <Input
            placeholder={t("name")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
          />
        </Form.Item>
        {/* End name */}

        {/* Start Image */}
        <Form.Item<FieldType>
          name="avatar"
          label={
            <span className="text-sm md:text-base">{t("profile_image")}</span>
          }
          rules={[{ required: false, message: t("please_enter_image") }]}
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
          rules={[{ required: false, message: t("please_enter_phoneNumber") }]}
        >
          <Input
            placeholder={t("phone_number")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
          />
        </Form.Item>
        {/* End Phone */}

        {/* Start Email */}
        <Form.Item<FieldType>
          name="email"
          rules={[
            {
              required: false,
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
        {/* End Email*/}

        {/* Start Password */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Form.Item<FieldType>
            name="password"
            rules={[
              { required: false, message: t("please_enter_password") },
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
              { required: false, message: t("please_confirm_your_password") },
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
        {/*End Password */}

        {/* Start address */}
        <Form.Item<FieldType>
          name="address"
          rules={[
            { required: false, message: t("please_enter_address") },
          ]}
        >
          <Input
            placeholder={t("primary_business_address")}
            className="!rounded-[2px] !py-3 placeholder:!text-[#646464]"
          />
        </Form.Item>
        {/* End address*/}

        {/* Start Categories */}
        <Form.Item<FieldType>
          name="categories"
          label={
            <span className="text-sm md:text-base">{t("categories")}</span>
          }
          rules={[
            { required: false, message: t("please_enter_address") },
          ]}
        >
          <Space style={{ width: '100%' }} direction="vertical">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder={t("Please select")}
              onChange={handleChangeCategories}
              options={categories}
            />
          </Space>
        </Form.Item>
        {/* End Categories */}

        {/* Start Areas Covered */}

        {/* Start Istanbul District */}
        <Form.Item<FieldType>
          name="district"
          label={
            <span className="text-sm md:text-base block w-full">{t("areas_covred_istanbul")}</span>
          }
          rules={[
            { required: false, message: t("please_enter_address") },
          ]}
        >
          <Space style={{ width: '100%' }} direction="vertical">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder={t("Please select")}
              onChange={handleChangeIstanbulDistrict}
              value={selectedDistricts}
              options={districtsWithAll}
            />
          </Space>
        </Form.Item>
        {/* End Istanbul District */}

        {/* Start cities */}
        <Form.Item<FieldType>
          name="cities"
          label={
            <span className="text-sm md:text-base block w-full">{t("areas_covred_turkey")}</span>
          }
          rules={[
            { required: false, message: t("please_enter_address") },
          ]}
        >
          <Space style={{ width: '100%' }} direction="vertical">
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder={t("Please select")}
              onChange={handleChangeCities}
              value={selectedCities}
              options={citiesWithAll}
            />
          </Space>
        </Form.Item>
        {/* End cities */}

        {/* End Areas Covered */}

        {/* Start accept */}
        <Form.Item<FieldType>
          name="accept"
          valuePropName="checked"
          rules={[
            { required: false, message: t("please_agree_to_terms_and_conditions") },
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
        {/* End accept */}

        {/* Start recaptcha*/}
        <Form.Item<FieldType>
          name="recaptcha"
          rules={[
            { required: false, message: t("please_confirm_that_you_are_not_robot") },
          ]}
        >
          {/* <ReCAPTCHA sitekey={process.env.SITE_KEY!} onChange={setCapched} /> */}
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
