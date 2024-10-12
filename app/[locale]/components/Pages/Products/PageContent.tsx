"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Form, Space, Table, Modal, Button, notification, Switch, DatePicker, Input } from "antd";
import { useForm } from "antd/es/form/Form";
import { ColumnsType } from "antd/es/table";
import dayjs from 'dayjs';
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import ImagesSlider from "../../Global/ImagesSlider/ImagesSlider";
import SearchProducts from "../../Global/Search/SearchProducts/SearchProducts";
import { DeleteProduct, GetAllProduct, UpdateOfferProduct } from "@/app/[locale]/api/products";
import { useTranslation } from "@/app/i18n/client";

import dynamic from 'next/dynamic'


const EditOffer = dynamic(() => import('./EditOffer/EditOffer'), { ssr: false })

type FieldType = {
  discount_price: string;
  is_on_offer: boolean;
  offer_start_date: string;
  offer_expiry_date: string;
};

type Props = {
  locale: string,
}

function ProductsList({ locale }: Props) {
  const { t } = useTranslation(locale, "common");
  const [form] = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [openImages, setOpenImages] = useState(false);
  const [images, setImages] = useState([]);
  const [openDeleteOffer, setOpenDeleteOffer] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const [dates, setDates] = useState<any>({ discount_price: 0, offer_start_date: "", offer_expiry_date: "" })
  const [product_id, setProducyId] = useState("")
  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([]);
  const [openEditOffer, setOpenEditOffer] = useState(false);
  const [itemForOffer, setItemForOffer] = useState<any>()
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  const getData = async () => {
    try {
      const res = await GetAllProduct(1);
      setCurrentPage(res.data.pagination.current_page);
      setTotalItems(res.data.pagination.total);
      setPageSize(res.data.pagination.per_page);
      setData(res.data.data)
      console.log(res.data.data)
    } catch (err) {
      console.log(err)
    }
  }

  // First Fetch
  useEffect(() => {
    getData()
  }, [])

  const handlePageChange = async (page: any) => {
    setPage(page + 1);
    setIsLoading(true);
    try {
      console.log(page)
      const res = await GetAllProduct(page);
      console.log(res.data.data)
      setData(res.data.customers);
      setCurrentPage(res.data.pagination.current_page);
      setData(res.data.data)
      setIsLoading(false);

    } catch (err: any) {
      setIsLoading(false);
      console.log(err)
      notification.error({
        message: err.response.data.message,
      });
    }
  };

  const columns: ColumnsType<any> = [
    {
      title: t("product_name"),
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: t("product_images"),
      dataIndex: "images",
      key: "images",
      align:"center",
      render: (_, record) => (
        <Space size="middle">
          <span
            className="border-2 border-gray-400 rounded-xl p-1 hover:bg-gray-100 block text-xs lg:text-xl text-center !w-[150px] !h-[150px]"
            onClick={() => {
              setImages(record.images);
              setOpenImages(true);
            }}
          >
            <Image
              src={record?.images[0]}
              height={150}
              width={150}
              alt={"record.images[0]"}
              className="rounded-xl !w-[150px] !h-[130px]"
            />
          </span>
        </Space>
      ),
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      align:"center",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align:"center",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      align:"center",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("is_in_offer"),
      dataIndex: "is_in_offer",
      key: "is_in_offer",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space size="middle">
          <Switch defaultValue={record.is_in_offer == "1" ? true : false} onChange={() => { record.is_in_offer == "1" ? setOpenDeleteOffer(true) : setOpenDates(true); setProducyId(record.id) }} />
          <div className="p-1 border-2 border-gray-300 cursor-pointer rounded-lg ">
            <CiEdit className="hover:scale-125 transtion-all duration-150 text-xl" onClick={() => { setItemForOffer(record); setOpenEditOffer(true); console.log(record) }} />
          </div>
        </Space>
      )
    },
    {
      title: t("date_added"),
      dataIndex: "createdDate",
      key: "createdDate",
      align:"center",
    },
    {
      title: t("actions"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a href={`/dashboard/products/edit/${record.id}`}>
            <CiEdit />
          </a>
          <a>
            <RiDeleteBinLine
              onClick={() => {
                setProducyId(record.id)
                setOpenDelete(true);
              }}
            />
          </a>
        </Space>
      ),
    },
  ];

  const tableData = data?.map((item: any) => ({
    id: item._id,
    images: item.images,
    name: item.name,
    category: `${item.category_main.name} / ${item.category_sub.name}`,
    quantity: item.quantity,
    price: item.price,
    is_in_offer: item.is_on_offer,
    createdDate: moment(item.createdAt).locale("en").format("YYYY-MM-DD"),
    offer_start_date: moment(item.offer_start_date).locale("en").format("YYYY-MM-DD"),
    offer_expiry_date: moment(item.offer_expiry_date).locale("en").format("YYYY-MM-DD"),
    discount_price: +item.discount_price
  }));

  const hideModalAndDeleteItem = () => {
    setIsLoading(true);
    setOpenDelete(false);
    DeleteProduct(product_id)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t("product_has_been_successfully_deleted"),
          });
        }
        setOpenDelete(false);
        setIsLoading(false);
        router.refresh();
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
        notification.error({
          message: err.response.data.message,
        });
      });
  };

  const DeleteProductfromOffer = async () => {
    setIsLoading(true);
    setOpenDeleteOffer(false);
    UpdateOfferProduct(product_id, "0", dates.discount_price, dates.offer_start_date, dates.offer_expiry_date)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t("delete_product_from_offer"),
          });
        }
        setIsLoading(false);
        router.refresh();
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
        notification.error({
          message: err.response.data.message
        });
      });
  }

  const onFinish = async () => {
    setIsLoading(true);
    setOpenDates(false);
    UpdateOfferProduct(product_id, "1", dates.discount_price, dates.offer_start_date, dates.offer_expiry_date)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t("added_product_to_offer_successfully"),
          });
        }
        setIsLoading(false);
        router.refresh();
      })
      .catch((err) => {
        console.log(err)
        setIsLoading(false);
        notification.error({
          message: err.response.data.message
        });
      });
  }

  return (
    <div>
      {isLoading && <Loader />}

      <div className="grid grid-cols-[50%_50%] mb-2">
        <div className="flex items-center">
          <Button className="">
            <Link
              href={`/dashboard/products/create`}
              className="flex items-center justify-beetwen gap-1"
            >
              {t("add_product")} <CiCirclePlus className="mr-1" />
            </Link>
          </Button>
        </div>
        <div className="p-4">
          <SearchProducts locale={locale} />
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1400 }}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalItems,
          onChange: handlePageChange,
        }}
      />

      <div>
        <Modal
          title={t("delete_product!!!")}
          open={openDelete}
          onOk={hideModalAndDeleteItem}
          onCancel={() => setOpenDelete(false)}
          okText={t("confirm")}
          cancelText={t("close")}
          okButtonProps={{ style: { backgroundColor: "#4096ff" } }}
        >
          <p>{t("you_sure_want_delete_product")}</p>
        </Modal>

        <Modal
          title={t("images")}
          centered
          width={1000}
          open={openImages}
          onOk={() => setOpenImages(false)}
          onCancel={() => setOpenImages(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { backgroundColor: "#4096ff" } }}
        >
          <Swiper navigation={true} modules={[Navigation]}>
            {images?.map((item: any) => (
              <SwiperSlide key={item.fileTitle} className="text-center">
                <ImagesSlider image={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Modal>
      </div>

      <div>
        {/* Start Delete Item From Offer */}
        <Modal
          title={t("delete_offer!!!")}
          open={openDeleteOffer}
          onOk={DeleteProductfromOffer}
          onCancel={() => setOpenDeleteOffer(false)}
          okText={t("confirm")}
          cancelText={t("close")}
          okButtonProps={{ style: { backgroundColor: "#4096ff" } }}
        >
          <p>{t("you_sure_want_delete_product_from_offer")}</p>
        </Modal>
        {/* ENd Delete Item From Offer */}

        {/* Start Add Prodcr To Offer */}
        <Modal
          title={t("active_offer!!!")}
          open={openDates}
          onCancel={() => setOpenDates(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >
          <Form
            form={form}
            name="discount-price"
            initialValues={{ remember: true }}
            autoComplete="off"
            layout="vertical"
            onFinish={onFinish}
          >
            <div className="flex items-center gap-5 mt-5 mb-1 ">
              {/* Start Discount Price */}
              <div>
                <Form.Item<FieldType>
                  name="discount_price"
                  label={<span className="text-sm  md:text-base">{t("discount_price")}</span>}
                  rules={[{ required: openDates, message: t("please_enter_discount_price") }]}

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
                  rules={[{ required: openDates, message: t("please_enter_start_date") }]}

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
                  rules={[{ required: openDates, message: t("please_enter_end_date") }]}

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

        </Modal>
        {/* End Add Prodcr To Offer */}

        {/* Start Edit OFfer */}
        <Modal
          title={t("active_offer!!!")}
          open={openEditOffer}
          onCancel={() => setOpenEditOffer(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >
          <EditOffer locale={locale} data={itemForOffer} openEditOffer={openEditOffer} setOpenEditOffer={setOpenEditOffer} product_id={product_id} />
        </Modal>
        {/* End Edit OFfer */}
      </div>

    </div>
  )
}

export default ProductsList
