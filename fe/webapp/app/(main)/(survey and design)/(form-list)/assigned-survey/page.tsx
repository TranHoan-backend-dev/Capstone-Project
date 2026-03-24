"use client";

import { useState, useMemo } from "react";

import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { siteConfig } from "@/config/site";
import { generateMockDataAssignedSurvey } from "@/lib/mockData";

const AssignedSurveyList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const mockData = useMemo(() => generateMockDataAssignedSurvey(20), []);

  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Khảo sát thiết kế", href: "#" },
    { label: "Báo cáo", href: "#" },
    { label: "Danh sách đơn đã phân công khảo sát", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />
      <div className="pt-2">
        {/* <FilterForm showSurveyStaff title="Danh sách đơn đã phân công khảo sát" /> */}

        <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
          <SearchToolbar
            onSearch={setSearchQuery}
            data={mockData}
            columns={siteConfig.columnsAssignedSurvay}
            reportTitle="Danh sách đơn đã phân công khảo sát"
          />

          <ReportHeader
            dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
            title="DANH SÁCH ĐÃ PHÂN CÔNG KHẢO SÁT CHI NHÁNH THÀNH PHỐ NAM ĐỊNH"
          />

          <DataTable columns={siteConfig.columnsAssignedSurvay} data={mockData} searchQuery={searchQuery} />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default AssignedSurveyList;

