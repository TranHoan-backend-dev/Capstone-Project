"use client";

import React, { useEffect, useState } from "react";
import { Tooltip, Spinner, Chip } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { PencilIcon } from "@/config/chip-and-icon";
import { authFetch } from "@/utils/authFetch";
import { useProfile } from "@/hooks/useLogin";
import {
  BackendConstructionData,
  PendingConstructionItem,
  PendingTableProps,
} from "@/types";
import AssignConstructionPopup from "./assign-construction-popup";
import CustomButton from "@/components/ui/custom/CustomButton";
import { PENDING_TABLE_COLUMNS } from "@/config/table-columns";
import { getStatusColor, getStatusText } from "@/utils/statusHelper";
import { CallToast } from "@/components/ui/CallToast";

export const PendingTable = ({
  filters,
  refreshTrigger = 0,
  onSuccess,
}: PendingTableProps) => {
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const [data, setData] = useState<BackendConstructionData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "desc",
  });

  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    formCode: string;
    formNumber: string;
    contractId: string;
    id: string;
  } | null>(null);

  const pageSize = 10;

  const canView = hasRole([
    "construction_department_head",
    "construction_department_staff",
  ]);

  const canAssign = hasRole("construction_department_head");

  useEffect(() => {
    if (canView) {
      fetchData();
    }
  }, [page, sort, refreshTrigger, filters, canView]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
      });

      if (filters?.keyword) {
        params.append("keyword", filters.keyword);
      }
      if (filters?.fromDate) {
        params.append("fromDate", filters.fromDate);
      }
      if (filters?.toDate) {
        params.append("toDate", filters.toDate);
      }

      params.append("isApproved", "false");

      const res = await authFetch(`/api/construction/constructions?${params}`);

      if (!res.ok) {
        console.error("Fetch failed", res.status);
        CallToast({
          title: "Lỗi",
          message: "Không thể tải danh sách đơn chờ thi công",
          color: "danger",
        });
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
        return;
      }

      const json = await res.json();
      const pageData = json?.data;
      const items = pageData?.content ?? [];
      setTotalItems(pageData?.page?.totalElements ?? 0);
      setTotalPages(pageData?.page?.totalPages ?? 1);

      const mapped = items.map(
        (item: BackendConstructionData, index: number) => {
          const constructionStatus =
            item.installationForm?.status?.construction;
          return {
            id: item.id,
            stt: (page - 1) * pageSize + index + 1,
            formCode: item.installationForm?.formCode || "",
            formNumber: item.installationForm?.formNumber || "",
            contractId: item.contractId || "",
            customerName:
              item.installationForm?.customerName || "Chưa có thông tin",
            phoneNumber: item.installationForm?.phoneNumber || "",
            address: item.installationForm?.address || "",
            constructedByFullName:
              item.installationForm?.constructedByFullName || "Chưa phân công",
            createdAt: formatDate(item.createdAt),
            registrationAt: formatDate(item.installationForm?.registrationAt),
            scheduleSurveyAt: formatDate(
              item.installationForm?.scheduleSurveyAt,
            ),
            isApproved: item.isApproved,
            rawStatus: constructionStatus,
            statusText: getStatusText(constructionStatus),
            statusColor: getStatusColor(constructionStatus),
          };
        },
      );

      setData(mapped);
    } catch (e) {
      console.error("Error fetching data:", e);
      CallToast({
        title: "Lỗi",
        message: "Có lỗi xảy ra khi tải dữ liệu",
        color: "danger",
      });
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const handleAssign = (item: PendingConstructionItem) => {
    setSelectedOrder({
      id: item.id,
      formCode: item.formCode,
      formNumber: item.formNumber,
      contractId: item.contractId,
    });
    setShowAssignPopup(true);
  };

  const handleAssignSuccess = () => {
    fetchData();
    if (onSuccess) {
      onSuccess();
    }
    CallToast({
      title: "Thành công",
      message: "Giao thi công thành công",
      color: "success",
    });
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-blue-600">{item.stt}</span>;

      case "formCode":
        return (
          <span className="font-semibold text-blue-600">{item.formCode}</span>
        );

      case "contractId":
        return <span className="text-gray-700">{item.contractId || "--"}</span>;

      case "customerName":
        return <span className="font-medium">{item.customerName}</span>;

      case "phoneNumber":
        return <span>{item.phoneNumber || "--"}</span>;

      case "address":
        return (
          <span className="max-w-[200px] truncate block" title={item.address}>
            {item.address || "--"}
          </span>
        );

      case "constructedByFullName":
        return (
          <span
            className={
              item.constructedByFullName === "Chưa phân công"
                ? "text-orange-500"
                : "text-green-600"
            }
          >
            {item.constructedByFullName}
          </span>
        );

      case "status":
        return (
          <Chip color={item.statusColor} variant="flat" size="sm">
            {item.statusText}
          </Chip>
        );

      case "actions":
        if (!canAssign) return null;

        if (item.rawStatus !== "PENDING_FOR_APPROVAL") {
          return (
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">Không thể giao</span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Giao thi công" closeDelay={0}>
              <CustomButton
                isIconOnly
                className="bg-transparent text-primary-500 data-[hover=true]:bg-primary-50"
                size="lg"
                variant="light"
                onPress={() => handleAssign(item)}
              >
                <PencilIcon className="w-5 h-5" />
              </CustomButton>
            </Tooltip>
          </div>
        );

      default:
        return (item as any)[columnKey] || "--";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <GenericDataTable
        title="Danh sách đơn chờ giao thi công"
        columns={PENDING_TABLE_COLUMNS}
        data={data}
        isCollapsible
        headerSummary={`${totalItems}`}
        renderCellAction={renderCell}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
      />

      {showAssignPopup && selectedOrder && (
        <AssignConstructionPopup
          isOpen={showAssignPopup}
          onClose={() => {
            setShowAssignPopup(false);
            setSelectedOrder(null);
          }}
          onSuccess={handleAssignSuccess}
          id={selectedOrder.id}
          formCode={selectedOrder.formCode}
          formNumber={selectedOrder.formNumber}
          contractId={selectedOrder.contractId}
        />
      )}
    </>
  );
};
