"use client";
import { useEffect, useState } from "react";
import Loader from "@/app/[locale]/components/Global/Loader/Loader";
import { Button, Form, Input, notification, Select, Upload } from "antd";
import axios from "axios";
import useSwr from 'swr';
import { useForm } from "antd/es/form/Form";
import { EditInfo, GetInfo } from "@/app/[locale]/api/info";
import { useTranslation } from "@/app/i18n/client";
import { useRouter } from "next/navigation";
import FetchImageAsFile from "../../Global/FetchImageAsFile/FetchImageAsFile";
import Image from "next/image";
import { GetMainCategories } from "@/app/[locale]/api/categories";

type Props = {
  locale: string;
};


type FieldType = {
  userName: string;
  phoneNumber: string;
  avatar: any;
  address: any;
  city: string;
  district: string,
  neighborhoods: string,
  sokak_no: string,
  building_no: string,
  dukkan_no: string;
  flat_no?: string;
  district_istanbul: string;
  cities: string;
  categories: any;
  areas_covered: any;
};


const PageContent = ({ locale }: Props) => {
  const { t } = useTranslation(locale, "common")
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [getData, setGetData] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<any>([])
  const AllOption = 'all';
  const [form] = useForm();

  const [istDistrict, setIstDistrict] = useState<any>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isAllDistrictsSelected, setIsAllDistrictsSelected] = useState(false);
  const [cities, setCities] = useState<any>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [isAllCitiesSelected, setIsAllCitiesSelected] = useState(false);

  const [categories, setCategories] = useState<any>([])
  const [dynamicDistrict, setDynamicDistrict] = useState<any>();
  const [neighborhoodss, setNeighborhoods] = useState()
  const { data: infoData } = useSwr(
    `/talab`,
    () => GetInfo()
  );
  // Handle select change
  const handleChangeIstanbulDistrict = (value: string[]) => {
    if (value.includes(AllOption)) {
      setSelectedDistricts([AllOption]);
      setIsAllDistrictsSelected(true);
    } else {
      setSelectedDistricts(value);
      setIsAllDistrictsSelected(false);
    }
  };
  // Fetch Categories 
  const getCategories = async () => {
    try {
      const res = await GetMainCategories();
      const newCategories = res.data.data.map((item: any) => {
        return ({
          label: item.name,
          value: item.id,
        })
      });
      setCategories(newCategories);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch Cities
  const getCities = async () => {
    const url = "https://turkiyeapi.dev/api/v1/provinces?fields=name";
    try {
      const res = await axios.get(url);
      const updatedCities = res?.data?.data?.map((item: any) => {
        return {
          label: item.name,
          value: item.name,
        }
      });
      setCities(updatedCities);
    }

    catch (err: any) {
      console.log(err);
    };

  }

  // Fetch  districts
  const GetDistricts = async () => {
    const url = "https://turkiyeapi.dev/api/v1/provinces?name=istanbul";

    try {
      const res = await axios.get(url);
      const districts = res?.data?.data[0]?.districts.map((item: any) => ({
        label: item.name,
        value: item.name,
      }));
      setIstDistrict(districts);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const data = infoData?.data;

    if (!isLoading && data) {

      if (!getData) {
        // تحميل المناطق
        getCategories()
        GetDistricts();
        getCities()
      };
      setGetData(true)

      // إعداد البيانات بعد تحميل الخيارات
      console.log(data?.data)
      form.setFieldValue('userName', data?.data?.userName);
      form.setFieldValue('phoneNumber', data?.data?.phoneNumber);
      form.setFieldValue('avatar', [{
        uid: '-1',
        name: 'avatar',
        status: 'done',
        url: data?.data?.avatar,
      }]);
      const Address = JSON.parse(data?.data?.address)
      form.setFieldValue('city', Address.city);
      form.setFieldValue('district', Address.district);
      form.setFieldValue('neighborhoods', Address.neighborhoods);
      form.setFieldValue('sokak_no', Address.sokak_no);
      form.setFieldValue('building_no', Address.building_no);
      form.setFieldValue('dukkan_no', Address.dukkan_no);
      form.setFieldValue('flat_no', Address.flat_no);

      if (data?.data?.areas_covered[0]?.city[0]?.city === "all" && data?.data?.areas_covered[0]?.city[0]?.districts[0] === "all") {
        setSelectedDistricts([AllOption]); // في حالة تحديد جميع المناطق
        setIsAllDistrictsSelected(true);
        setSelectedCities([AllOption])
        setIsAllCitiesSelected(true)
      } else {
        const districts = data.data.areas_covered[0].city[0].districts;
        const filteredCities = data.data.areas_covered[0].city.filter((city: any) => city.city !== "istanbul");
        const updatedCities = filteredCities?.map((item: any) => {
          return {
            label: item.city,
            value: item.city,
          }
        });
        setSelectedCities(updatedCities)
        setSelectedDistricts(districts); // إعداد المناطق المحددة
      }

      const newCategories = data?.data?.categories.map((item: any) => ({
        label: item.name,
        value: item.id,
      }));

      setSelectedCategories(newCategories)

      form.setFieldsValue({ categories: selectedCategories });
      form.setFieldsValue({ district_istanbul: selectedDistricts });
      form.setFieldsValue({ cities: selectedCities });

    }
  }, [infoData, getData]);

  const districtsWithAll = [
    { label: 'Select All', value: AllOption },
    ...istDistrict.map((item: any) => ({ ...item, disabled: isAllDistrictsSelected, })),
  ];

  const citiesWithAll = [
    { label: 'Select All', value: AllOption },
    ...cities.map((item: any) => ({ ...item, disabled: item.value == 'İstanbul' ? true : isAllCitiesSelected })),
  ];
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

  const handleChangeCities = (value: string[]) => {
    if (value.includes(AllOption)) {
      setSelectedCities([AllOption]);
      setIsAllCitiesSelected(true);

    } else {
      setSelectedCities(value);
      setIsAllCitiesSelected(false);
    }
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


  const handleChangeCategories = (value: string[]) => {
    setSelectedCategories(value)
  };

  const onFinish = async ({
    userName,
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
    // console.log(areas_covered)
    formdata.append("userName", userName);
    formdata.append("address", JSON.stringify(Address));

    //  start image fixed  ****************************
    const imageFiles = await Promise.all(
      avatar.map(async (file: any) => {
        if (file.url) {
          return await FetchImageAsFile(file.url, file.url.split('/').pop() || 'image.jpg');
        }
        return file.originFileObj;
      })
    );
    imageFiles.forEach((file: any) => {
      formdata.append('avatar', file);
    });

    formdata.append("_method", "patch");
    // End Fixed Code *************

    formdata.append("categories", JSON.stringify(selectedCategories));
    formdata.append("areas_covered", JSON.stringify(areas_covered));
    EditInfo(formdata)
      .then((res) => {
        if (res?.data?.message == "the user exists already") {
          notification.error({
            message: res?.data?.message,
          });
        } else {
          notification.success({
            message: t("edited_success"),
          });
          router.refresh()
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

  const handleFinishFailed = (errorInfo: any) => {
    form.scrollToField(errorInfo.errorFields[0].name, {
      behavior: 'smooth',
      block: 'center',
    });
  };

  return (
    <div className="px-3">
      {isLoading && <Loader />}
      <Form
        form={form}
        name="register-form"
        onFinish={onFinish}
        onFinishFailed={handleFinishFailed}
        autoComplete="off"
        className="grid lg:grid-cols-2 gap-5"
      >

        {/* Start name */}
        <Form.Item<FieldType>
          name="userName"
          label={<span className="block text-sm md:text-base">{t("userName")}</span>}
          rules={[{ required: true, message: t("please_enter_name") }]}
          labelCol={{ span: 24 }}
        >
          <Input
            placeholder={t("name")}
            className="!rounded-[2px] !py-3 "
          />
        </Form.Item>
        {/* End name */}

        {/* Start phoneNumber */}
        <Form.Item<FieldType>
          name="phoneNumber"
          label={<span className="block text-sm md:text-base">{t("phoneNumber")}</span>}
          rules={[{ required: false, message: t("please_enter_phoneNumber") }]}
          labelCol={{ span: 24 }}

        >
          <Input
            disabled
            placeholder={t("phoneNumber")}
            className="!rounded-[2px] !py-3 "
          />
        </Form.Item>
        {/* End phoneNumber */}

        {/* Start Image */}
        <Form.Item<FieldType>
          name="avatar"
          label={<span className="text-sm md:text-base">{t("profile_image")}</span>}
          rules={[{ required: true, message: t("please_enter_image") }]}
          labelCol={{ span: 24 }}
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
              rules={[{ required: true, message: t("please_enter_neighborhoods") },]}
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
          labelCol={{ span: 24 }}
        >
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder={t("select_categories")}
            onChange={handleChangeCategories}
            value={selectedCategories}
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
          labelCol={{ span: 24 }}
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
          labelCol={{ span: 24 }}
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

        {/* Start Submit Register */}
        <div className="col-span-2">
          <button
            type="submit"
            className=" rounded-full py-2 md:pb-3 px-5 md:px-8 text-lg md:text-xl border-2 border-[#006496] bg-[#006496] text-white hover:text-[#006496] hover:bg-white transition-all duration-200"
          >
            {t("edit")}
          </button>
        </div>
        {/* End Submit Register */}



      </Form>

    </div>
  );
};


export default PageContent;
