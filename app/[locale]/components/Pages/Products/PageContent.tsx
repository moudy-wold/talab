"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader";
import { Space, Table, Modal, Button, notification, Switch } from "antd";
import { ColumnsType } from "antd/es/table";
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
import { FaQuestion } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";

import dynamic from 'next/dynamic'
import AddToOffer from "./AddToOffer/AddToOffer";
import GlobalRating from "../../Global/GlobalRating/GlobalRating";
import Rating from "./Rating/Rating";
import Questions from "./Questions/Questions";


const EditOffer = dynamic(() => import('./EditOffer/EditOffer'), { ssr: false })


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
  const [openDeleteOffer, setOpenDeleteOffer] = useState(false);
  const [openReviews, setOpenReviews] = useState(false)
  const [product_average_rating, setProduct_Average_rating] = useState(0)
  const [product_reviews, setProduct_Reviews] = useState([])
  const [openQuestions, setOpenQuestions] = useState(false)
  const [product_questions, setProduct_questions] = useState([]);
  const [openVisits, setOpenVisits] = useState(false)
  const [product_Visits, setProduct_Visits] = useState("")

  const [openDates, setOpenDates] = useState(false);
  // const [dates, setDates] = useState<any>({ discount_price: 0, offer_start_date: "", offer_expiry_date: "" })
  const [product_id, setProduct_id] = useState("")
  // const [page, setPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([]);
  const [openEditOffer, setOpenEditOffer] = useState(false);
  const [itemForOffer, setItemForOffer] = useState<any>()


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
    // setPage(page + 1);
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
      align: "center",
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
      align: "center",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
      align: "center",
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
          <Switch defaultValue={record.is_in_offer == "1" ? true : false} onChange={() => { record.is_in_offer == "1" ? setOpenDeleteOffer(true) : setOpenDates(true); setProduct_id(record.id) }} />
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
      align: "center",
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
                setProduct_id(record.id)
                setOpenDelete(true);
              }}
            />
          </a>

          <a className="cursor-pointer p-1  border-gray-300 rounded-md " onClick={() => {
            setProduct_Average_rating(record.average_rating);
            setProduct_Reviews(record.reviews)
            setOpenReviews(true);
          }}>
            <Image src="/assets/svg/fullStar.svg" alt="star" width={17} height={17} className="" />
          </a>

          <a className="cursor-pointer p-1  border-gray-300 rounded-md " onClick={() => { setProduct_questions(record.questions); setOpenQuestions(true) }}>
            <FaQuestion />
          </a>

          <a className="cursor-pointer p-1  border-gray-300 rounded-md " onClick={() => { setProduct_Visits(record.visits_count); setOpenVisits(true) }}>
            <MdOutlineRemoveRedEye className="text-xl" />
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
    discount_price: +item.discount_price,
    average_rating: item.average_rating,
    reviews: item.reviews,
    questions: item.questions,
    visits_count: item.visits_count

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
    UpdateOfferProduct(product_id, "0", "", "", "")
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

      <div className="grid grid-cols-[40%_60%] lg:grid-cols-2 mb-2">
          <div className="flex items-center justify-center">
            <Button className="">
              <Link
                href={`/dashboard/products/create`}
                className="flex items-center justify-beetwen gap-1"
              >
                {t("add_product")} <CiCirclePlus className="mr-1" />
              </Link>
            </Button>
        </div>
        <div className="lg:p-4">
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

        {/* Start Add Product To Offer */}
        <Modal
          title={t("active_offer!!!")}
          open={openDates}
          onCancel={() => setOpenDates(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >
          <AddToOffer locale={locale} setOpenDates={setOpenDates} product_id={product_id} openDates={openDates} />
        </Modal>
        {/* End Add Product To Offer */}

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

        {/* Start Reviews Model */}
        <Modal
          title={t("the_rating")}
          open={openReviews}
          onCancel={() => setOpenReviews(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >
          {/* Start Rating */}
          <div className="mb-5">
            <GlobalRating average_rating={product_average_rating} />
          </div>
          {/* End Rating */}

          {/* Start Reviews */}
          <div className="max-h-[70wh] overflow-y-auto">
            <Rating locale={locale} product_id={product_id} reviews={product_reviews} store={false} />
          </div>
          {/* End Reviews */}

        </Modal>
        {/* End Reviews Model */}

        {/* Start Questions Model */}
        <Modal
          title={t("the_questions")}
          open={openQuestions}
          onCancel={() => setOpenQuestions(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >

          {/* Start questions */}
          <div className="max-h-[70wh] overflow-y-auto">
            <Questions locale={locale} product_id={product_id} questions={product_questions} />
          </div>
          {/* End questions */}
        </Modal>
        {/* End Questions Model */}

        {/* Start Visits Model */}
        <Modal
          title={t("product_visits")}
          open={openVisits}
          onCancel={() => setOpenVisits(false)}
          cancelText={t("close")}
          okButtonProps={{ style: { display: "none" } }}
        >
          <p className="p-2 border-2 border-gray-300 rounded-lg w-fit">{product_Visits}</p>
        </Modal>
        {/* End Visits Model */}

      </div>

    </div>
  )
}

export default ProductsList
