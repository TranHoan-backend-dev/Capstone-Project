"use client";

import { useState, useEffect, useMemo } from "react";
import { Spinner } from "@heroui/spinner";

import axiosBase from "@/lib/axios/axios-base";
import { DataTable } from "@/components/reports/DataTable";
import { ReportFooter } from "@/components/reports/ReportFooter";
import { ReportHeader } from "@/components/reports/ReportHeader";
import { SearchToolbar } from "@/components/reports/SearchToolbar";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { siteConfig } from "@/config/site";
import { columnsAssignedSurvay } from "@/config/table-columns/report/report-column";
import { formatDate4 } from "@/utils/format";

const formatStatus = (status: any) => {
  if (!status) return "Chưa xác định";

  const statusMap: Record<string, string> = {
    PENDING_FOR_APPROVAL: "Chờ duyệt",
    PROCESSING: "Đang xử lý",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    COMPLETED: "Hoàn thành",
  };

  return (
    statusMap[status.registration] ||
    statusMap[status.estimate] ||
    status.registration ||
    "Chưa xác định"
  );
};

const formatCustomerType = (type: string) => {
  const typeMap: Record<string, string> = {
    FAMILY: "Hộ gia đình",
    ORGANIZATION: "Tổ chức",
    BUSINESS: "Doanh nghiệp",
  };
  return typeMap[type] || type;
};

const formatUsageTarget = (target: string) => {
  const targetMap: Record<string, string> = {
    DOMESTIC: "Sinh hoạt",
    BUSINESS: "Kinh doanh",
    PRODUCTION: "Sản xuất",
  };
  return targetMap[target] || target;
};

const formatDataList = (rawData: any[]) => {
  if (!rawData || rawData.length === 0) return [];

  return rawData.map((item, index) => ({
    ...item,
    stt: index + 1,
    registrationAt: item.registrationAt ? formatDate4(item.registrationAt) : "",
    scheduleSurveyAt: item.scheduleSurveyAt
      ? formatDate4(item.scheduleSurveyAt)
      : "",
    citizenIdentificationProvideDate: item.citizenIdentificationProvideDate
      ? formatDate4(item.citizenIdentificationProvideDate)
      : "",
    customerName: item.customerName || "Chưa có tên",
    phoneNumber: item.phoneNumber || "Chưa có",
    address: item.address || "Chưa có địa chỉ",
    customerTypeText: formatCustomerType(item.customerType),
    usageTargetText: formatUsageTarget(item.usageTarget),
    statusText: formatStatus(item.status),
    handoverByFullName: item.handoverByFullName || "Chưa phân công",
  }));
};

const AssignedSurveyListContent = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [rawData, setRawData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosBase.get(
          "/api/construction/installation-forms/assigned",
        );
        console.log("Raw API response:", res.data);
        setRawData(res.data.data.content || []);
      } catch (error) {
        console.error("Failed to fetch assigned survey forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formattedData = useMemo(() => {
    return formatDataList(rawData);
  }, [rawData]);


  const breadcrumbs = [
    { label: "Trang chủ", href: "/home" },
    { label: "Khảo sát thiết kế", href: "#" },
    { label: "Báo cáo", href: "#" },
    { label: "Danh sách đơn đã phân công khảo sát", isCurrent: true },
  ];

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner label="Đang tải danh sách phân công..." />
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
            columns={columnsAssignedSurvay}
            reportTitle="Danh sách đơn đã phân công khảo sát"
          />

          <ReportHeader title="DANH SÁCH ĐƠN ĐÃ PHÂN CÔNG KHẢO SÁT" />

          <DataTable
            columns={columnsAssignedSurvay}
            data={formattedData}
            searchQuery={searchQuery}
          />

          <ReportFooter />
        </div>
      </div>
    </>
  );
};

export default AssignedSurveyListContent;
