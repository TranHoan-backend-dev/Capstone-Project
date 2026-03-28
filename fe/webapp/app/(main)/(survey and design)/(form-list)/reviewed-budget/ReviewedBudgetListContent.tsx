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

const ReviewedBudgetListContent = () => {
  const [searchQueryApproved, setSearchQueryApproved] = useState("");
  const [searchQueryRejected, setSearchQueryRejected] = useState("");
  const [data, setData] = useState<{ approved: any[]; rejected: any[] }>({
    approved: [],
    rejected: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosBase.get(
          "/api/construction/installation-forms/reviewed",
        );
        setData(res.data.data || { approved: [], rejected: [] });
      } catch (error) {
        console.error("Failed to fetch reviewed budget forms:", error);
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
    { label: "Danh sách đơn đã phê duyệt dự toán", isCurrent: true },
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
        {/* Approved Section */}
        <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
          <SearchToolbar
            onSearch={setSearchQueryApproved}
            data={data.approved}
            columns={siteConfig.columnsReviewedBudget}
            reportTitle="DANH SÁCH ĐƠN ĐÃ PHÊ DUYỆT DỰ TOÁN"
          />
          <ReportHeader title="DANH SÁCH ĐƠN ĐÃ PHÊ DUYỆT DỰ TOÁN" />
          <DataTable
            columns={siteConfig.columnsReviewedBudget}
            data={data.approved}
            searchQuery={searchQueryApproved}
          />
        </div>

        {/* Rejected Section */}
        <div className="mt-8 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl border-t-red-500">
          <SearchToolbar
            onSearch={setSearchQueryRejected}
            data={data.rejected}
            columns={siteConfig.columnsReviewedBudget}
            reportTitle="DANH SÁCH ĐƠN TỪ CHỐI DUYỆT DỰ TOÁN"
          />
          <ReportHeader title="DANH SÁCH ĐƠN TỪ CHỐI DUYỆT DỰ TOÁN" />
          <DataTable
            columns={siteConfig.columnsReviewedBudget}
            data={data.rejected}
            searchQuery={searchQueryRejected}
          />
          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default ReviewedBudgetListContent;
