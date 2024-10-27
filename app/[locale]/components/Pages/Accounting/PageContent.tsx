"use client"
import React, {  useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { Table, notification } from "antd";
import { ColumnsType } from "antd/es/table";
import moment from "moment";
import { GetAllOffresProducts } from "@/app/[locale]/api/products";
import Loader from "../../Global/Loader/Loader";


function PageContent({ locale }: any) {
  const { t } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(56);
  const [totalItems, setTotalItems] = useState(0);

  const data = [
    {
      id: "asd",
      from_date: "01/01/2024",
      to_date: "01/07/2024",
      number_of_requests_per_week: 50,
      sales_of_the_week: 1000,
      percentage: "5%",
      net_receivables: 950,
      status: ["in_waiting", "done"]
    },
    {
      id: "asd",
      from_date: "01/01/2024",
      to_date: "01/07/2024",
      number_of_requests_per_week: 50,
      sales_of_the_week: 1000,
      percentage: "5%",
      net_receivables: 950,
      status: ["in_waiting", "done"]
    }, {
      id: "asd",
      from_date: "01/01/2024",
      to_date: "01/07/2024",
      number_of_requests_per_week: 50,
      sales_of_the_week: 1000,
      percentage: "5%",
      net_receivables: 950,
      status: ["in_waiting", "done"]
    }


  ]

  const columns: ColumnsType<any> = [
    {
      title: t("date"),
      dataIndex: "from_date",
      key: "from_date",
      render: (_, record) => (
        <span className="flex items-center gap-1 cursor-pointer hover:text-[#006496] ">
          {record.from_date}
          <br />
          {record.to_date}
        </span>
      ),

    },
    {
      title: t("number_of_requests_per_week"),
      dataIndex: "number_of_requests_per_week",
      key: "number_of_requests_per_week",
      align: "center",
    },
    {
      title: t("sales_of_the_week"),
      dataIndex: "sales_of_the_week",
      key: "sales_of_the_week",
      align: "center",
    },
    {
      title: t("percentage"),
      dataIndex: "percentage",
      key: "percentage",
      align: "center",
    },
    {
      title: t("net_receivables"),
      dataIndex: "net_receivables",
      key: "net_receivables",
      align: "center",
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      align: "center",
    },

  ];

  const tableData = data?.map((item: any) => ({
    id: item.id,
    from_date: moment(item.from_date).locale("en").format("YYYY-MM-DD"),
    to_date: moment(item.to_date).locale("en").format("YYYY-MM-DD"),
    number_of_requests_per_week: item.number_of_requests_per_week,
    sales_of_the_week: item.sales_of_the_week,
    percentage: item.percentage,
    net_receivables: item.net_receivables,
    status: item.status
  }));

  const handlePageChange = async (page: any) => {
    setIsLoading(true);
    try {
      console.log(page)
      const res = await GetAllOffresProducts(page);
      console.log(res.data.data)
      setCurrentPage(res.data.pagination.current_page);
      // setData(res.data.data)
      setIsLoading(false);

    } catch (err: any) {
      setIsLoading(false);
      console.log(err)
      notification.error({
        message: err.response.data.message,
      });
    }
  };

  return (
    <div className="">
      {isLoading && <Loader />}
      <Table
        columns={columns}
        dataSource={tableData}
        scroll={{ x: 1000 }}
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

export default PageContent
