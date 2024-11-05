"use client";
import React, { useEffect, useState } from "react";
import type { ColumnsType } from "antd/es/table";
import { Space, Table, Modal, notification, } from "antd";
import { useTranslation } from "@/app/i18n/client";
import Loader from "@/app/[locale]/components/Global/Loader/LargeLoader/LargeLoader"
import { OrderStatus, ReturnStatus } from "@/app/[locale]/utils/constant";
import { MdOutlineDoneOutline } from "react-icons/md";
import { GetAllOrder, UpdateStatus } from "@/app/[locale]/api/order";
import OrderDataCards from "./OrderDataCards/OrderDataCards";
import UserOrders from "./Dynamic-User-Orders/UserOrders";

function OrdersList({ locale }: any) {
  const { t } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const [openOrderDetails, setOpenOrderDetails] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [data, setData] = useState([])
  const [index, setIndex] = useState(0);
  const [openUserOrders, setOpenUserOrders] = useState(false)
  const [user_Id, setUser_Id] = useState("")
  // First Fetch
  useEffect(() => {
    const getData = async () => {
      const res = await GetAllOrder(1);
      setCurrentPage(res.data.pagination.current_page);
      setTotalItems(res.data.pagination.total)
      setPageSize(res.data.pagination.per_page)
      console.log(res.data.data)
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
      console.log(res.data.data)
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
      await UpdateStatus(order_id, status);
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
    finally {
      setIsLoading(false);
    }
  }

  //  Customers Table
  const columns: ColumnsType<any> = [
    {
      title: t("userName"),
      dataIndex: "userName",
      key: "userName",
      sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (_, record) => (<span onClick={() => { setUser_Id(record.admin_id); setOpenUserOrders(true) }} className="flex items-center gap-1 cursor-pointer hover:text-[#006496] ">{record.order_status == "pending_cancellation" && <div className="bg-red-600 w-3 h-3 rounded-full p-1 border-2 border-red-600"></div>} {record.userName}</span>),
    },
    {
      title: t("phoneNumber"),
      dataIndex: "phoneNumber",
      key: "phoneNumber",
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
            onChange={(e) => { UpdateServiceStatus(record.id, e.target.value); }}
            style={{ width: "100%" }}
            className="w-full border-2 border-gray-200 rounded-lg h-12"
          >
            {record.order_status != "pending_cancellation" ?
              <>

                {OrderStatus.map((item) => (
                  <>
                    {item.value == record.order_status ?
                      <option value={item.value} key={item.id} selected>
                        {t(item.label)}
                      </option> :
                      <option value={item.value} key={item.id}>
                        {t(item.label)}
                      </option>}
                  </>
                ))}
              </> : <>
                {ReturnStatus.map((item: any) => (
                  <>
                    {item.value == record.order_status ?
                      <option value={item.value} key={item.id} selected>
                        {t(item.label)}
                      </option> :
                      <option value={item.value} key={item.id}>
                        {t(item.label)}
                      </option>}
                  </>
                ))}
              </>
            }
          </select>
          {record.order_status == "done" && <MdOutlineDoneOutline className="text-[#5cb85c]" />}
        </Space>
      ),
    },
    {
      title: t("products"),
      key: "action",
      render: (_, record) => (
        <Space size="middle" className="border-2 border-gray-300 rounded-lg p-2 text-lg cursor-pointer hover:scale-105 hover:text-[#006496] hover:border-[#006496] duration-150 transition-all" onClick={() => { setOpenOrderDetails(true); setIndex(record.index); }}>
          {t("show")}
        </Space>
      ),
    },
  ];

  const customerDataToShow = data?.map((item: any, index: number) => ({
    index: index,
    id: item.id,
    userName: item.user_name,
    phoneNumber: item.phone,
    address: item.address,
    price: item.total,
    quantity: item.quantity,
    order_status: item.status,
    admin_id: item.user_admin_id
  }));

  return (
    <div className="p-5">
      {isLoading && <Loader />}
      <div >
        <Table
          columns={columns}
          dataSource={customerDataToShow}
          scroll={{ x: 800 }}
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
          title={t("order_details")}
          centered
          open={openOrderDetails}
          onCancel={() => { setOpenOrderDetails(false) }}
          okButtonProps={{ style: { display: "none" } }}
          width={1000}
        >
          <OrderDataCards data={data[index]} locale={locale} />
        </Modal>

        <Modal
          title={t("user_orders")}
          centered
          open={openUserOrders}
          onCancel={() => { setOpenUserOrders(false) }}
          okButtonProps={{ style: { display: "none" } }}
          width={1000}
        >
          <UserOrders locale={locale} user_Id={user_Id} setOpenUserOrders={setOpenUserOrders} />
        </Modal>
      </div>
    </div>
  )
}

export default OrdersList
