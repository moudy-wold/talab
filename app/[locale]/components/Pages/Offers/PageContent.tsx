"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Space, Table, Modal, Button, notification, Switch } from "antd";
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
  const [openDelete, setOpenDelete] = useState(false);
  const [openImages, setOpenImages] = useState(false);
  const [images, setImages] = useState([]);

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
      title: t("is_in_offer"),
      dataIndex: "is_in_offer",
      key: "is_in_offer",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (_, record) => (
        <Space size="middle">
          <Switch defaultValue={record.is_in_offer == "1" ? true : false} disabled />
        </Space>
      )
    },
    {
      title: t("date_added"),
      dataIndex: "createdDate",
      key: "createdDate",
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
                setId(record.id)
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
    description: item.description,
    is_in_offer: item.is_on_offer,
    createdDate: moment(item.createdAt).locale("en").format("DD/MM/YYYY"),
  }));

  const hideModalAndDeleteItem = () => {
    setIsLoading(true);
    setOpenDelete(false);
    DeleteProduct(id)
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
  )
}


export default OffersPage
