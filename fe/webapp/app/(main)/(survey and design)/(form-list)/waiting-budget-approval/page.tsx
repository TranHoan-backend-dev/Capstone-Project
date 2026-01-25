import { Metadata } from "next";

import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Danh sách đơn chờ duyệt dự toán",
  description: "Danh sách đơn chờ duyệt dự toán",
  category: "Báo cáo",
};

const ReportWaitingList = () => {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Khảo sát thiết kế", href: "#" },
    { label: "Báo cáo", href: "#" },
    { label: "Danh sách đơn chờ duyệt dự toán", isCurrent: true },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbs} />
      <div className="pt-2">
        <FilterForm title="Danh sách đơn chờ duyệt dự toán" />

        <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
          <SearchToolbar />

          <ReportHeader
            dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
            title="DANH SÁCH ĐƠN TỪ CHỜ DUYỆT CHIẾT TÍNH KHU VỰC THÀNH PHỐ NAM ĐỊNH"
          />

          <DataTable
            columns={siteConfig.columnsWaitingBudgetApproval}
            data={[]}
          />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default ReportWaitingList;

