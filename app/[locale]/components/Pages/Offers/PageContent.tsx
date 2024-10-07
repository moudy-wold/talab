"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Space, Table, Modal, Button, notification, Switch, DatePicker, DatePickerProps } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import ImagesSlider from "../../Global/ImagesSlider/ImagesSlider";
import SearchProducts from "../../Global/Search/SearchProducts/SearchProducts";
import { DeleteProduct, GetAllOffresProducts, GetAllProduct } from "@/app/[locale]/api/products";
type Props = {
  locale: string,
}
function OffersPage({ locale }: Props) {
  const { t } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [openDeleteOffer, setOpenDeleteOffer] = useState(false);
  const [openDates, setOpenDates] = useState(false);
  const [dates, setDates] = useState<any>({ offer_start_date: "", offer_expiry_date: "" })

  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([]);
  const [id, setId] = useState("");

  const getData = async () => {
    try {
      const res = await GetAllOffresProducts(1);
      setCurrentPage(res.data.pagination.current_page);
      setTotalItems(res.data.pagination.total);
      setPageSize(res.data.pagination.per_page);
      console.log(res.data.data);
      setData(res.data.data)
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
      render: (_, record) => (
        <Space size="middle">
          <span
            className="border-2 border-gray-400 rounded-xl p-1 hover:bg-gray-100 block text-xs lg:text-xl text-center !w-[150px] !h-[150px]">
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
      title: t("is_in_offer"),
      dataIndex: "is_in_offer",
      key: "is_in_offer",
      render: (_, record) => (
        <Space size="middle">
          <Switch defaultValue={record.is_in_offer == "1" ? true : false} onChange={() => { record.is_in_offer == "1" ? setOpenDeleteOffer(true) : setOpenDates(true) }} />
        </Space>
      )
    },
    {
      title: t("offer_start_date"),
      dataIndex: "offer_start_date",
      key: "offer_start_date",
    },
    {
      title: t("offer_expiry_date"),
      dataIndex: "offer_expiry_date",
      key: "offer_expiry_date",
    },
    {
      title: t("category"),
      dataIndex: "category",
      key: "category",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },

  ];

  const tableData = data?.map((item: any) => ({
    id: item._id,
    images: item.images,
    name: item.name,
    is_in_offer: item.is_on_offer,
    offer_start_date: moment(item.offer_start_date,).locale("en").format("DD/MM/YYYY"),
    offer_expiry_date: moment(item.offer_expiry_date,).locale("en").format("DD/MM/YYYY"),
    category: `${item.category_main.name} / ${item.category_sub.name}`,
    createdDate: moment(item.createdAt).locale("en").format("DD/MM/YYYY"),
  }));

  const hideModalAndDeleteItem = () => {
    setIsLoading(true);
    setOpenDeleteOffer(false);
    DeleteProduct(id)
      .then((res) => {
        if (res.status) {
          notification.success({
            message: t("product_has_been_successfully_deleted"),
          });
        }
        setOpenDeleteOffer(false);
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
  const hideModalAndSetOffer = async () => {
    console.log("as")
  }

  const onChange_datePicker: DatePickerProps['onChange'] = (date, dateString) => {
    setDates(dateString);
  };
  return (
    <div>
      {isLoading && <Loader />}

      <div className="mt-10">
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
      </div>
      <div>
        <Modal
          title={t("delete_offer!!!")}
          open={openDeleteOffer}
          onOk={hideModalAndDeleteItem}
          onCancel={() => setOpenDeleteOffer(false)}
          okText={t("confirm")}
          cancelText={t("close")}
          okButtonProps={{ style: { backgroundColor: "#4096ff" } }}
        >
          <p>{t("you_sure_want_delete_product_from_offer")}</p>
        </Modal>
        <Modal
          title={t("delete_offer!!!")}
          open={openDates}
          onOk={hideModalAndSetOffer}
          onCancel={() => setOpenDates(false)}
          okText={t("confirm")}
          cancelText={t("close")}
          okButtonProps={{ style: { backgroundColor: "#4096ff" } }}
        >
          <div className="flex items-center gap-5 ">
            {/* Start Start Date */}
            <div>
              <p className="">{t("offer_start_date")}</p>
              <DatePicker onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_start_date: option })) }} className={``} />
            </div>
            {/* End Start Date */}

            {/* Start End Date */}
            <div>
              <p className="">{t("offer_expiry_date")}</p>
              <DatePicker onChange={(value, option) => { setDates((prev: any) => ({ ...prev, offer_expiry_date: option })) }} className={``} />
            </div>
            {/* End End Date */}
          </div>
        </Modal>
      </div>
    </div>
  )
}


export default OffersPage
