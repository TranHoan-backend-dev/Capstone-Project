"use client";

import { useState, useEffect, useMemo } from "react";
import { Spinner } from "@heroui/spinner";

import axiosBase from "@/lib/axios/axios-base";
import { DataTable } from "@/components/reports/DataTable";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { columnsWaitingBudget } from "@/config/table-columns/report/report-column";
import { formatDate4 } from "@/utils/format";
import { useProfile } from "@/hooks/useLogin";

const formatData = (rawData: any[]) => {
  return rawData.map((item, index) => ({
    ...item,
    stt: index + 1,
    registrationAt: formatDate4(item.registrationAt),
    scheduleSurveyAt: formatDate4(item.scheduleSurveyAt),
    customerName: item.customerName || "Chưa có tên",
    phoneNumber: item.phoneNumber || "Chưa có",
    address: item.address || "Chưa có địa chỉ",
    creatorFullName: item.creatorFullName || "Chưa có tên",
  }));
};

const WaitingBudgetListContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rawData, setRawData] = useState([]);
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
          "/api/construction/installation-forms/registration/pending",
        );
        const content = res.data.data.content || [];
        setRawData(content);
      } catch (error) {
        console.error("Failed to fetch waiting budget forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedData = useMemo(() => {
    return formatData(rawData);
  }, [rawData]);

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
            data={formattedData}
            columns={columnsWaitingBudget}
            reportTitle="Danh sách đơn chờ lập dự toán"
          />

          <ReportHeader title="DANH SÁCH ĐƠN CHỜ LẬP DỰ TOÁN" />

          <DataTable
            columns={columnsWaitingBudget}
            data={formattedData}
            searchQuery={searchQuery}
          />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default WaitingBudgetListContent;
