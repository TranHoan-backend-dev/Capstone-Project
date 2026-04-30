"use client";

import { useState, useEffect } from "react";
import { Spinner } from "@heroui/spinner";

import axiosBase from "@/lib/axios/axios-base";
import { DataTable } from "@/components/reports/DataTable";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { columnsWaitingBudgetApproval } from "@/config/table-columns";
import { useProfile } from "@/hooks/useLogin";

const WaitingBudgetApprovalContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView = isITStaff || isCompanyLeader;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosBase.get(
          "/api/construction/installation-forms/estimate/pending",
        );
        setData(res.data.data.content || []);
      } catch (error) {
        console.error("Failed to fetch pending approval budget forms:", error);
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
    { label: "Danh sách hồ sơ chờ duyệt dự toán", isCurrent: true },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Đang tải dữ liệu dự toán..." />
      </div>
    );
  }
  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
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
            columns={columnsWaitingBudgetApproval}
            reportTitle="Danh sách đơn chờ duyệt dự toán"
          />

          <ReportHeader title="DANH SÁCH ĐƠN CHỜ DUYỆT DỰ TOÁN" />

          <DataTable
            columns={columnsWaitingBudgetApproval}
            data={data}
            searchQuery={searchQuery}
          />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default WaitingBudgetApprovalContent;
