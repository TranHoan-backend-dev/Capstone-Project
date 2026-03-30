// components/construction/pending-table.tsx
"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { CancelIcon, CheckApprovalIcon, PencilIcon } from "@/config/chip-and-icon";
import { PENDING_CONSTRUCTION } from "@/config/table-columns/construction/pending-construction-column";
import { authFetch } from "@/utils/authFetch";
import {
  FilterPendingConstructionRequest,
  PendingConstructionItem,
  PendingConstructionResponse,
} from "@/types";
import AssignConstructionPopup from "./assign-construction-popup";
import CustomButton from "@/components/ui/custom/CustomButton";

interface PendingTableProps {
  filters?: FilterPendingConstructionRequest;
  refreshTrigger?: number;
  onSuccess?: () => void;
}

export const PendingTable = ({
  filters,
  refreshTrigger = 0,
  onSuccess,
}: PendingTableProps) => {
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

  // State cho popup giao thi công
  const [showAssignPopup, setShowAssignPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<{
    formCode: string;
    formNumber: string;
    customerName: string;
    customerId?: string;
  } | null>(null);

  const pageSize = 10;

  useEffect(() => {
    fetchData();
  }, [page, sort, refreshTrigger]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
        // sort: `${sort.field},${sort.direction}`,
      });

      const res = await authFetch(`/api/construction/constructions?${params}`);

      if (!res.ok) {
        console.error("Fetch failed", res.status);
        return;
      }

      const json = await res.json();
      const pageData = json?.data;
      const items = pageData?.content ?? [];
      setTotalItems(pageData?.page.totalElements ?? 0);
      setTotalPages(pageData?.page.totalPages ?? 1);

      const mapped = items.map(
        (item: PendingConstructionResponse, index: number) => ({
          id: item.formCode,
          stt: (page - 1) * pageSize + index + 1,
          formCode: item.formCode,
          formNumber: item.formNumber,
          customerName: item.customerName,
          phoneNumber: item.phoneNumber,
          handoverByFullName: item.handoverByFullName,
          address: item.address,
          scheduleSurveyAt: item.scheduleSurveyAt,
          status: item.status.construction,
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

  const handleAssign = (item: PendingConstructionItem) => {
    setSelectedOrder({
      formCode: item.formCode,
      formNumber: item.formNumber,
      customerName: item.customerName,
      // constructionId: item.id,
      customerId: (item as any).customerId,
    });
    setShowAssignPopup(true);
  };

  const handleAssignSuccess = () => {
    // Refresh danh sách sau khi giao thành công
    fetchData();
    if (onSuccess) {
      onSuccess();
    }
  };

  const actionItems = [
    {
      content: "Giao thi công",
      icon: CheckApprovalIcon,
      color: "primary" as const,
      className: "text-blue-600 hover:bg-blue-50",
      onClick: (item: PendingConstructionItem) => handleAssign(item),
    },
  ];

  const renderCell = (item: PendingConstructionItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-blue-600">{item.stt}</span>;

      case "formNumber":
        return <span className="font-semibold">{item.formNumber}</span>;

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip closeDelay={0} color="primary" content="Giao thi công">
                <CustomButton
                  isIconOnly
                  className="bg-transparent text-primary-500 data-[hover=true]:bg-primary-50"
                  size="lg"
                  variant="light"
                  onPress={() => action.onClick(item)}
                >
                  <PencilIcon className="w-5 h-5" />
                </CustomButton>
              </Tooltip>
              // <Tooltip
              //   key={idx}
              //   content={action.content}
              //   closeDelay={0}
              //   color={action.color}
              // >
              //   <Button
              //     isIconOnly
              //     variant="light"
              //     size="sm"
              //     className={`${action.className} rounded-lg`}
              //     onPress={() => action.onClick(item)}
              //   >
              //     <action.icon className="w-5 h-5" />
              //   </Button>
              // </Tooltip>
            ))}
          </div>
        );

      default:
        return (item as any)[columnKey];
    }
  };

  return (
    <>
      <GenericDataTable
        title="Danh sách đơn chờ giao thi công"
        columns={PENDING_CONSTRUCTION}
        data={data}
        isCollapsible
        headerSummary={`${data.length}`}
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
          formCode={selectedOrder.formCode}
          formNumber={selectedOrder.formNumber}
          customerName={selectedOrder.customerName}
          customerId={selectedOrder.customerId}
        />
      )}
    </>
  );
};
