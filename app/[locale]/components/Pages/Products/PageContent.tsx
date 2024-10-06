"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Space, Table, Modal, Button, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { CiCirclePlus, CiEdit } from "react-icons/ci";
import { RiDeleteBinLine } from "react-icons/ri";
import { useTranslation } from "@/app/i18n/client";
import ImagesSlider from "../../Global/ImagesSlider/ImagesSlider";
import SearchProducts from "../../Global/Search/SearchProducts/SearchProducts";
type Props = {
  locale: string,
}
function ProductsList({ locale }: Props) {
  const { t } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [openDelete, setOpenDelete] = useState(false);
  const [openImages, setOpenImages] = useState(false);
  const [images, setImages] = useState([]);

  const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([
    {
      id: "asd",
      product_name: "product_name",
      images: ["/assets/1009571293.webp"],
      createdDate:"2024/05/19",
      main_category: "main1",
      sub_category: "sub1",
      description:"asdasd",
      quantity: 5,
      in_offer: true
    }, {
      id: "asd",
      product_name: "product_name",
      images: ["/assets/1009571293.webp"],
      createdDate:"2024/05/19",
      main_category: "main1",
      sub_category: "sub1",
      description:"asdasd",
      quantity: 5,
      in_offer: true
    }, {
      id: "asd",
      product_name: "product_name",
      images: ["/assets/1009571293.webp"],
      createdDate:"2024/05/19",
      main_category: "main1",
      sub_category: "sub1",
      description:"asdasd",
      quantity: 5,
      in_offer: true
    },
  ]);


  const handlePageChange = async (page: any) => {
    // setPage(page + 1);
    // setIsLoading(true);
    // try {
    //   const res = await GetProductsByCategory(categoryId, page + 10);
    //   setData(res.data.data);
    //   setCurrentPage(page);
    //   setIsLoading(true);
    // } catch (err: any) {
    //   notification.error({
    //     message: err.response.data.error.message,
    //   });
    //   setIsLoading(true);
    // }
  };
  
  const columns: ColumnsType<any> = [
    {
      title: t("product_name"),
      dataIndex: "name",
      key: "name",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      title: t("product_image"),
      width: 250,
      dataIndex: "images",
      key: "images",
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
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",      
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("description"),
      dataIndex: "description",
      key: "description",      
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("date_added"),
      width: 250,
      dataIndex: "createdDate",
      key: "createdDate",
    },
    {
      title: t("actions"),
      width: 250,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a href={`/admin/products/edit/${record.id}`}>
            <CiEdit />
          </a>
          <a>
            <RiDeleteBinLine
              onClick={() => {
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
    name: item.product_name,
    category:`${item.main_category}/${item.sub_category}`,
    quantity:item.quantity,
    description: item.description,
    createdDate: moment(item.createdAt).locale("en").format("DD/MM/YYYY"),
  }));
  return (
    <div>
      {isLoading && <Loader />}

      <div className="grid grid-cols-[50%_50%] mb-2">
        <div className="flex items-center">
          <Button className="">
            <Link
              href={`/dashboard/products/create`}
              className="flex items-center justify-beetwen"
            >
              {t("add_product")} <CiCirclePlus className="mr-1" />
            </Link>
          </Button>
        </div>
        <div className="p-4">
          <SearchProducts locale={locale} />
        </div>
      </div>

      <Table columns={columns} dataSource={tableData} scroll={{ x: 1400 }} />

      <div>
        <Modal
          title={t("delete_product!!!")}
          open={openDelete}
          // onOk={hideModalAndDeleteItem}
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
    </div>
  )
}

export default ProductsList
