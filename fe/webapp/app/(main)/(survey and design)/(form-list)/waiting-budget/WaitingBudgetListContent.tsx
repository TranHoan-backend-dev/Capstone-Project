"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";

import axiosBase from "@/lib/axios/axios-base";
import { DataTable } from "@/components/reports/DataTable";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { siteConfig } from "@/config/site";

const WaitingBudgetListContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosBase.get(
          "/api/construction/installation-forms/registration/pending",
        );
        setData(res.data.data.content || []);
      } catch (error) {
        console.error("Failed to fetch waiting budget forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Khảo sát thiết kế", href: "#" },
    { label: "Báo cáo", href: "#" },
    { label: "Danh sách đơn chờ lập dự toán", isCurrent: true },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />
      <div className="pt-2">
        <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
          <SearchToolbar
            onSearch={setSearchQuery}
            data={data}
            columns={siteConfig.columnsWaitingBudget}
            reportTitle="Danh sách đơn chờ lập dự toán"
          />

          <ReportHeader title="DANH SÁCH ĐƠN CHỜ LẬP DỰ TOÁN" />

          <DataTable
            columns={siteConfig.columnsWaitingBudget}
            data={data}
            searchQuery={searchQuery}
          />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default WaitingBudgetListContent;
