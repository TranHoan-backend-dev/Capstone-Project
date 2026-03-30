"use client";

import React, { useEffect, useState } from "react";
import { Tooltip, Spinner, Chip } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { authFetch } from "@/utils/authFetch";
import { useProfile } from "@/hooks/useLogin";
import {
  FilterPendingConstructionRequest,
  PendingConstructionItem,
} from "@/types";
import AssignConstructionPopup from "./assign-construction-popup";
import CustomButton from "@/components/ui/custom/CustomButton";

interface PendingTableProps {
  filters?: FilterPendingConstructionRequest;
  refreshTrigger?: number;
  onSuccess?: () => void;
}

interface BackendConstructionData {
  id: string;
  contractId: string;
  formCode: string;
  formNumber: string;
  createdAt: string;
  isApproved: string;
}

export const PendingTable = ({
  filters,
  refreshTrigger = 0,
  onSuccess,
}: PendingTableProps) => {
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const [data, setData] = useState<PendingConstructionItem[]>([]);
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

  // Giữ nguyên columns như cũ
  const columns = [
    { key: "stt", label: "STT" },
    { key: "contractId", label: "Số hợp đồng" },
    { key: "formCode", label: "Mã đơn" },
    { key: "status", label: "Trạng thái" },
    { key: "actions", label: "Hành động", align: "center" as const },
  ];

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

      // Add filters if needed
      if (filters) {
        // Add filter params here if needed
      }

      params.append("isApproved", "false");

      const res = await authFetch(`/api/construction/constructions?${params}`);

      if (!res.ok) {
        console.error("Fetch failed", res.status);
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
        return;
      }

      const json = await res.json();

      let items: BackendConstructionData[] = [];
      let totalElements = 0;
      let totalPagesCount = 1;

      // Handle different response structures
      if (json?.data?.content && Array.isArray(json.data.content)) {
        items = json.data.content;
        totalElements = json.data.page?.totalElements || 0;
        totalPagesCount = json.data.page?.totalPages || 1;
      } else if (Array.isArray(json)) {
        items = json;
        totalElements = items.length;
        totalPagesCount = Math.ceil(totalElements / pageSize);
      } else if (json?.data && Array.isArray(json.data)) {
        items = json.data;
        totalElements = items.length;
        totalPagesCount = Math.ceil(totalElements / pageSize);
      } else if (json?.content && Array.isArray(json.content)) {
        items = json.content;
        totalElements = json.totalElements || items.length;
        totalPagesCount = json.totalPages || 1;
      }

      setTotalItems(totalElements);
      setTotalPages(totalPagesCount);

      // Map the data with proper fields
      const mapped = items.map(
        (item: BackendConstructionData, index: number) => ({
          id: item.id,
          stt: (page - 1) * pageSize + index + 1,
          formCode: item.formCode,
          formNumber: item.formNumber,
          contractId: item.contractId || "",
          customerName: (item as any).customerName || "Chưa có thông tin",
          customerId: (item as any).customerId,
          createdAt: formatDate(item.createdAt),
          isApproved: item.isApproved,
          status: item.isApproved === "false" ? "Chờ xử lý" : "Đã duyệt",
        }),
      );

      setData(mapped);
    } catch (e) {
      console.error("Error fetching data:", e);
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
  };

  const renderCell = (item: PendingConstructionItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-blue-600">{item.stt}</span>;

      case "formCode":
        return (
          <span className="font-semibold text-blue-600">{item.formCode}</span>
        );

      case "contractId":
        return <span className="text-gray-700">{item.contractId || "--"}</span>;

      case "actions":
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
                <CheckApprovalIcon className="w-5 h-5" />
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
        columns={columns}
        data={data}
        isCollapsible
        headerSummary={`${data.length} / ${totalItems}`}
        renderCellAction={renderCell}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length} / ${totalItems}`,
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
          formCode={selectedOrder.formCode}
          formNumber={selectedOrder.formNumber}
          contractId={selectedOrder.contractId}
        />
      )}
    </>
  );
};
