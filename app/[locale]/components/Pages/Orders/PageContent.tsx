"use client";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Space, Table, Modal, notification, Switch } from "antd";
import { useTranslation } from "@/app/i18n/client";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader"
import { OrderStatus } from "@/app/[locale]/utils/constant";
import { MdOutlineDoneOutline } from "react-icons/md";
import { GetAllOrder, UpdateQuantity } from "@/app/[locale]/api/order";

function OrdersList({ locale }: any) {
  const { t, i18n } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const [openUserDetails, setOpenUserDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([])

  // First Fetch
  useEffect(() => {
    const getData = async () => {
      const res = await GetAllOrder(1);
      // setCurrentPage(res.data.pagination.current_page);
      // setTotalItems(res.data.pagination.total)
      // setPageSize(res.data.pagination.per_page)
      console.log(res.data)
      setData(res.data.data)
    }
    getData()
  }, [])

  const handlePageChange = async (page: any) => {
    setIsLoading(true)
    console.log(page)
    try {
      const res = await GetAllOrder(page);
      setData(res.data.customers)
      setCurrentPage(res.data.pagination.current_page);
      setIsLoading(false)
      console.log(res.data)
    }
    catch (err: any) {
      console.log(err)
      notification.error({
        message: err.response.data.message
      })
      setIsLoading(false)
    }
  };

  const UpdateServiceStatus = async (order_id: string, status: string) => {
    setIsLoading(true);
    try {
      const res = await UpdateQuantity(order_id, status);
      notification.success({
        message: t("edited_successfulle")
      })
    }
    catch (err: any) {
      console.log(err)
      notification.error({
        message: err.response.data.message
      })
    }
  }

  //  Customers Table
  const columns: ColumnsType<any> = [
    {
      title: t("userName"),
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (_, record) => (<a href={`/user-profile/${record._id}`}>{record.userName}</a>),
    },
    {
      title: t("phoneNuber"),
      dataIndex: "phoneNuber",
      key: "phoneNuber",
    },
    {
      title: t("address"),
      dataIndex: "address",
      key: "address",
    },
    {
      title: t("total_price_of_product"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t("total_count_of_product"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("order_status"),
      dataIndex: "order_status",
      key: "order_status",
      width: '180px',
      render: (_, record) => (
        <Space size="middle">
          <select
            onChange={(e) => { UpdateServiceStatus(record._id, e.target.value); }}
            style={{ width: "100%" }}
            className="w-full border-2 border-gray-200 rounded-lg h-12"
          >
            {OrderStatus.map((item) => (
              <>
                {item.value == record.serviceStatus ?
                  <option value={item.value} key={item.id} selected>
                    {t(item.label)}
                  </option> :
                  <option value={item.value} key={item.id}>
                    {t(item.label)}
                  </option>}
              </>
            ))}
          </select>
          {record.serviceStatus == "done" && <MdOutlineDoneOutline className="text-[#5cb85c]" />}
        </Space>
      ),
    },
    {
      title: t("products"),
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {t("show")}
        </Space>
      ),
    },
  ];

  const customerDataToShow = data?.map((item: any) => ({
    id: item.id,
    userName: item.userName,
    phoneNumber: item.phoneNumber,
    address: item.address,
    price: item.price,
    quantity: item.quantity,
    order_status: item.order_status,
  }));

  return (
    <div>
      {isLoading && <Loader />}
      <div >
        <Table
          columns={columns}
          dataSource={customerDataToShow}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: totalItems,
            onChange: handlePageChange,
          }}
        />
      </div>
    </div>
  )
}

export default OrdersList
