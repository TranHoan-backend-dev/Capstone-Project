import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { siteConfig } from "@/config/site";

const ReportContractList = () => {
  return (
    <>
      <FilterForm title="Danh sách đơn chuyển lập hợp đồng" />

      <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
        <SearchToolbar />

        <ReportHeader
          dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
          title="DANH SÁCH ĐƠN CHỜ LẬP HỢP ĐỒNG KHU VỰC THÀNH PHỐ NAM ĐỊNH"
        />

        <DataTable columns={siteConfig.columnsReportContract} data={[]} />

        <ReportFooter />
      </div>
    </>
  );
};

export default ReportContractList;
