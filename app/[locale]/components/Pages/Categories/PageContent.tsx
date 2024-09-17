"use client";
import React, { useEffect, useState } from "react";
import { useTranslation } from "@/app/i18n/client";
import { CategoriesList } from "@/app/[locale]/utils/constant";
import type { ColumnsType } from "antd/es/table";

import { Space, Table, Modal, notification, Switch} from "antd";

function PageContent({ locale }: any) {
  const { t, i18n } = useTranslation(locale, "common");
  const [isLoading, setIsLoading] = useState(false);

  const onChange = (checked: boolean) => {
    console.log(`switch to ${checked}`);
  };

  const columns: ColumnsType<any> = [
    {
      title: t("category_name"),
      dataIndex: "category_name",
      key: "category_name",
      sorter: (a, b) => a.category_name.localeCompare(b.category_name),
      render: (_, record) => (
        <a href={`/category/${record.category_name}`}>{record.category_name}</a>
      )
    },
    {
      title: "الإجرائات",
      key: "action",
      render: (_, record) => <Space size="middle">
        <Switch defaultChecked onChange={onChange} />
      </Space>
    }
  ];

  const customerDataToShow = CategoriesList?.map((item: any) => ({
    id: item.id,
    category_name: item.value
  }));

 
  return (
    <div className="w-[350px] mx-10">
      <Table
        columns={columns}
        dataSource={customerDataToShow}        
        
      />
    </div>
  );
}

export default PageContent;
