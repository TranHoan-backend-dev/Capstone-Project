import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { siteConfig } from "@/config/site";

const ReportWaitingList = () => {
  return (
    <main className="mx-auto max-w-7xl space-y-6 p-6">
      <FilterForm title="Danh sách đơn chờ duyệt dự toán" />

      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <SearchToolbar />

        <ReportHeader
          title="DANH SÁCH ĐƠN TỪ CHỜ DUYỆT CHIẾT TÍNH KHU VỰC THÀNH PHỐ NAM ĐỊNH"
          dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
        />

        <DataTable columns={siteConfig.columnsReportWaiting} data={[]} />

        <ReportFooter />
      </div>
    </main>
  );
};

export default ReportWaitingList;
