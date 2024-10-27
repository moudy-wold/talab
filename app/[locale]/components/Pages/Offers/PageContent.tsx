"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Space, Table, Modal, notification, Switch, } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";

import { CiEdit } from "react-icons/ci";
import { useTranslation } from "@/app/i18n/client";
import { GetAllOffresProducts, UpdateOfferProduct } from "@/app/[locale]/api/products";
import EditOffer from "../Products/EditOffer/EditOffer";
type Props = {
  locale: string,
}
function OffersPage({ locale }: Props) {
  const { t } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [openDeleteOffer, setOpenDeleteOffer] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([]);
  const [product_id, setProducyId] = useState("");
  const [itemForOffer, setItemForOffer] = useState<any>()
  const [openEditOffer, setOpenEditOffer] = useState(false);

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
    setIsLoading(true);
    try {
      console.log(page)
      const res = await GetAllOffresProducts(page);
      console.log(res.data.data)
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
      align: "center",
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
          <Switch defaultValue={record.is_in_offer == "1" ? true : false} onChange={() => { record.is_in_offer == "1" && setOpenDeleteOffer(true); setProducyId(record.id) }} />
          <div className="p-1 border-2 border-gray-300 cursor-pointer rounded-lg ">
            <CiEdit className="hover:scale-125 transtion-all duration-150 text-xl" onClick={() => { setItemForOffer(record); setOpenEditOffer(true); console.log(record) }} />
          </div>
        </Space>
      )
    },
    {
      title: t("offer_start_date"),
      dataIndex: "offer_start_date",
      key: "offer_start_date",
      align: "center",
    },
    {
      title: t("offer_expiry_date"),
      dataIndex: "offer_expiry_date",
      key: "offer_expiry_date",
      align: "center",
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      align: "center",
    },
    {
      title: t("discount_price"),
      dataIndex: "discount_price",
      key: "discount_price",
      align: "center",
    },
    {
      title: t("category"),
      align: "center",
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
    offer_start_date: moment(item.offer_start_date).locale("en").format("YYYY-MM-DD"),
    offer_expiry_date: moment(item.offer_expiry_date).locale("en").format("YYYY-MM-DD"),
    discount_price: +item.discount_price,
    price: item.price,
    category: `${item.category_main.name} / ${item.category_sub.name}`,
  }));


  const DeleteProductfromOffer = async () => {
    console.log(product_id)
    setIsLoading(true);
    setOpenDeleteOffer(false);
    UpdateOfferProduct(product_id, "0", "","", "")
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
        {/* Start ADd Product To Offer */}
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
        {/* End ADd Product To Offer */}

        {/* Start Edit OFfer */}
        <Modal
          title={t("edit_offer")}
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


export default OffersPage
