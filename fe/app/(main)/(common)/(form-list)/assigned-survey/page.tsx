import { DataTable } from "@/components/reports/DataTable";
import { FilterForm } from "@/components/reports/FilterForm";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { siteConfig } from "@/config/site";

const AssignedSurveyList = () => {
  return (
    <>
      <FilterForm title="Danh sách đơn đã phân công khảo sát" showSurveyStaff />

      <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <SearchToolbar />

        <ReportHeader
          title="DANH SÁCH ĐÃ PHÂN CÔNG KHẢO SÁT CHI NHÁNH THÀNH PHỐ NAM ĐỊNH"
          dateRange="Từ ngày 07/12/2025 đến ngày 07/12/2025"
        />

        <DataTable columns={siteConfig.columnsAssignedSurvay} data={[]} />

        <ReportFooter />
      </div>
    </>
  );
};

export default AssignedSurveyList;
