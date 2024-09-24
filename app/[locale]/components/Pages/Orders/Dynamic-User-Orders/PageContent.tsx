"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { CategoriesList, OrderStatus } from "@/app/[locale]/utils/constant";
import type { ColumnsType } from "antd/es/table";

import { Space, Table, Modal, notification, Switch } from "antd";
import { MdOutlineDoneOutline } from "react-icons/md";
type Props = {
  locale: string;
  data: any;
  openUserDetails: boolean;
  setOpenUserDetails: any;
};

function Dynamic_User_Orders(props: Props) {
  const { t, i18n } = useTranslation(props.locale, "common");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };
  // Edit Order Status
  const onFinish = async (orderId: string, status: string) => {
    setIsLoading(true);

    // EditeStatusServiceById(serviceId, customerId, status)
    //   .then((res) => {
    //     if (res.status) {
    //       notification.success({
    //         message: "تم التعديل بنجاح"
    //       });
    //       setOpenActiveService(true);
    //     }
    //     router.refresh();
    //   })
    //   .catch((err) => {
    //     notification.error({
    //       message: err.response.data.message
    //     });
    //   })
    //   .finally(() => {
    //     setIsLoading(false);
    //   });
  };

  const columns: ColumnsType<any> = [
    {
      title: t("order_no"),
      dataIndex: "order_no",
      key: "order_no",
      // sorter: (a, b) => a.userName.localeCompare(b.userName),
      // render: (_, record) => (
      //   <span>{record.order_no}</span>
      // )
    },
    {
      title: t("price"),
      dataIndex: "price",
      key: "price",
    },
    {
      title: t("quantity"),
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: t("order_status"),
      dataIndex: "order_status",
      key: "order_status",
      // sorter: (a, b) => a.userName.localeCompare(b.userName),
      render: (_, record) => (
        <Space size="middle">
          <select
            onChange={(e) => {
              onFinish(record.id, e.target.value);
            }}
            style={{ width: "100%" }}
            className="w-full border-2 border-gray-200 rounded-lg h-12"
          >
            {OrderStatus.map((item: any, index: number) => {
              return (
                <>
                  {item.value == record.orderStatus ? (
                    <option value={item.value} key={item.id} selected>
                      {item.label}
                    </option>
                  ) : (
                    <option value={item.value} key={index}>
                      {item.label}
                    </option>
                  )}
                </>
              );
            })}
          </select>
          {record.serviceStatus == "delivered" && (
            <MdOutlineDoneOutline className="text-[#5cb85c]" />
          )}
        </Space>
      ),
    },
    {
      title: t("products"),
      key: "action",
      render: (_, record) => <Space size="middle">{t("show")}</Space>,
    },
  ];

  const dataToShow = props?.data?.map((order: any) => ({
    order_no: order.id,
    orderStatus: order.orderStatus,
    price: order.price,
    quantity: order.quantity,
    products: order.products,
  }));

  return (
    <div className="w-[350px] mx-10">
      <Modal
        title={t("user_info")}
        open={props?.openUserDetails}
        onOk={() => props?.setOpenUserDetails(false)}
        onCancel={() => props?.setOpenUserDetails(false)}
        okText="موافق"
        cancelText={t("close")}
        okButtonProps={{ style: { display: "none" } }}
      >
        <div className="">
          <div className="flex items-center justify-between gap-4">
            <p className="">nameasdsa </p>
            <p className="">58486476847684 </p>
          </div>
          <div className="">
            <p className="">addres sdif iaHFSDIOHF SDF SD F</p>
          </div>
        </div>
        <div className="mt-3">
          <Table columns={columns} dataSource={dataToShow} />
        </div>
      </Modal>
    </div>
  );
}

export default Dynamic_User_Orders;
