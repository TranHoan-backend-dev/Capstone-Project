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
import { columnsReviewedBudget } from "@/config/table-columns/report/report-column";
import { formatDate4 } from "@/utils/format";

// Format date: 2024-01-10T10:00 -> 10/01/2024
const formatDate = (dateString: string) => {
  if (!dateString) return "";

  try {
    const [datePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

// Format date + time: 2024-01-10T10:00 -> 10/01/2024 10:00
const formatDateTime = (dateString: string) => {
  if (!dateString) return "";

  try {
    const [datePart, timePart] = dateString.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return dateString;
  }
};

// Format status
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
    statusMap[status.estimate] ||
    status.estimate ||
    status.registration ||
    "Chưa xác định"
  );
};

// Format customer type
const formatCustomerType = (type: string) => {
  const typeMap: Record<string, string> = {
    FAMILY: "Hộ gia đình",
    ORGANIZATION: "Tổ chức",
    BUSINESS: "Doanh nghiệp",
  };
  return typeMap[type] || type;
};

// Format usage target
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
    registrationAt: item.registrationAt
      ? formatDate4(item.registrationAt)
      : "",
    scheduleSurveyAt: item.scheduleSurveyAt
      ? formatDate(item.scheduleSurveyAt)
      : "",
    citizenIdentificationProvideDate: item.citizenIdentificationProvideDate
      ? formatDate(item.citizenIdentificationProvideDate)
      : "",
    customerName: item.customerName || "Chưa có tên",
    phoneNumber: item.phoneNumber || "Chưa có",
    address: item.address || "Chưa có địa chỉ",
    customerTypeText: formatCustomerType(item.customerType),
    usageTargetText: formatUsageTarget(item.usageTarget),
    statusText: formatStatus(item.status),
  }));
};

const ReviewedBudgetListContent = () => {
  const [searchQueryApproved, setSearchQueryApproved] = useState("");
  const [searchQueryRejected, setSearchQueryRejected] = useState("");
  const [rawData, setRawData] = useState<{ approved: any[]; rejected: any[] }>({
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
        console.log("Raw API response:", res.data);
        setRawData(res.data.data || { approved: [], rejected: [] });
      } catch (error) {
        console.error("Failed to fetch reviewed budget forms:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Format dữ liệu cho approved và rejected
  const formattedData = useMemo(() => {
    return {
      approved: formatDataList(rawData.approved),
      rejected: formatDataList(rawData.rejected),
    };
  }, [rawData]);


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
            data={formattedData.approved}
            columns={columnsReviewedBudget}
            reportTitle="DANH SÁCH ĐƠN ĐÃ PHÊ DUYỆT DỰ TOÁN"
          />
          <ReportHeader title="DANH SÁCH ĐƠN ĐÃ PHÊ DUYỆT DỰ TOÁN" />
          <DataTable
            columns={columnsReviewedBudget}
            data={formattedData.approved}
            searchQuery={searchQueryApproved}
          />
        </div>

        {/* Rejected Section - chỉ hiển thị nếu có dữ liệu */}
        {formattedData.rejected.length > 0 && (
          <div className="mt-8 space-y-6 border border-gray-200 rounded-lg bg-white p-6 shadow-sm dark:border-none dark:bg-zinc-900 dark:shadow-2xl">
            <SearchToolbar
              onSearch={setSearchQueryRejected}
              data={formattedData.rejected}
              columns={columnsReviewedBudget}
              reportTitle="DANH SÁCH ĐƠN TỪ CHỐI DUYỆT DỰ TOÁN"
            />
            <ReportHeader title="DANH SÁCH ĐƠN TỪ CHỐI DUYỆT DỰ TOÁN" />
            <DataTable
              columns={columnsReviewedBudget}
              data={formattedData.rejected}
              searchQuery={searchQueryRejected}
            />
            <ReportFooter />
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewedBudgetListContent;
