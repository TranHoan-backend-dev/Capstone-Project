import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { siteConfig } from "@/config/site";

const CustomerCallList = () => {
  return (
    <>
      <FilterForm title="Danh sách khách hàng gọi điện" />

      <div className="mt-4 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
        <SearchToolbar />

        <ReportHeader
          title="DANH SÁCH KHÁCH HÀNG ĐÃ GỌI ĐIỆN KHU VỰC THÀNH PHỐ NAM ĐỊNH"
          dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
        />

        <DataTable columns={siteConfig.columnsCustomerCall} data={[]} />

        <ReportFooter />
      </div>
    </>
  );
};

export default CustomerCallList;
