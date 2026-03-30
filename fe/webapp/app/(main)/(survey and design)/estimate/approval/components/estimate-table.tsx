"use client";

import React from "react";
import { Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  ApprovalIcon,
  GreenIconColor,
  EstimationIcon,
  BlueYellowIconColor,
  RejectIcon,
  RedIconColor,
  TitleDarkColor,
  PencilIcon,
} from "@/config/chip-and-icon";
import { ESTIMATE_APPROVAL_COLUMN } from "@/config/table-columns";
import { EstimateOrder, EstimateTableProps } from "@/types";
export const EstimateTable = ({
  data,
  loading = false,
  page,
  totalPages,
  totalItems,
  onPageChange,
  onApproveAction,
  onRejectAction,
  onViewAction,
  onEstimateAction,
  onSignAction,
  onCreateSignatureRequest,
  currentUserRole,
}: EstimateTableProps) => {
  const renderCell = (item: EstimateOrder, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;
      case "code":
        return (
          <span
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 cursor-pointer ${TitleDarkColor}`}
            onClick={(e) => {
              if (e.ctrlKey || e.metaKey) {
                onEstimateAction?.(item);
              } else {
                onEstimateAction?.(item);
              }
            }}
          >
            {item.code}
          </span>
        );
      case "designProfileName":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {item.designProfileName}
            </span>
          </div>
        );
      case "totalAmount":
        return (
          <span className="text-primary font-bold">{item.totalAmount}</span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {onApproveAction && item.status === "processing" && (
              <Tooltip color="success" content="Duyệt dự toán">
                <ApprovalIcon
                  className={GreenIconColor}
                  onClick={() => onApproveAction(item)}
                />
              </Tooltip>
            )}

            {onRejectAction && item.status === "processing" && (
              <Tooltip color="danger" content="Từ chối dự toán">
                <RejectIcon
                  className={RedIconColor}
                  onClick={() => onRejectAction(item)}
                />
              </Tooltip>
            )}

            {onCreateSignatureRequest && currentUserRole === "survey_staff" && (
              <Tooltip color="primary" content="Tạo yêu cầu ký">
                <EstimationIcon
                  className={BlueYellowIconColor}
                  onClick={() => onCreateSignatureRequest(item)}
                />
              </Tooltip>
            )}
            {onSignAction && item.status === "approved" && (
              <Tooltip color="primary" content="Kí duyệt">
                <PencilIcon
                  className={BlueYellowIconColor}
                  onClick={() => onSignAction(item)}
                />
              </Tooltip>
            )}
          </div>
        );
      default:
        // @ts-ignore
        return item[columnKey];
    }
  };

  return (
    <GenericDataTable
      title=""
      isLoading={loading}
      headerSummary={`${totalItems}`}
      columns={ESTIMATE_APPROVAL_COLUMN as any}
      data={data}
      isCollapsible
      renderCellAction={renderCell}
      tableProps={{
        selectionMode: "none",
      }}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: onPageChange,
        summary: `${data.length}`,
      }}
    />
  );
};
