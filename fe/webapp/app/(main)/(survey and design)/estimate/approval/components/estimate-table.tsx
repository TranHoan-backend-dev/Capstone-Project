"use client";

import React, { useEffect, useState } from "react";
import { Button, Tooltip } from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  ApprovalIcon,
  GreenIconColor,
  EstimationIcon,
  BlueYellowIconColor,
  RejectIcon,
  RedIconColor,
  ViewIcon,
  TitleDarkColor,
  PencilIcon,
} from "@/config/chip-and-icon";
import { ESTIMATE_APPROVAL_COLUMN } from "@/config/table-columns";

export interface EstimateOrder {
  stt: string;
  id: number;
  code: string;
  designProfileName: string;
  phone: string;
  installationAddress: string;
  totalAmount: string;
  createdDate: string;
  creator: string;
  status: "pending" | "waiting_sign" | "signing" | "approved" | "rejected";
}

interface EstimateTableProps {
  data: EstimateOrder[];
  loading?: boolean;
  page: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onApproveAction?: (item: EstimateOrder) => void; // Make optional
  onRejectAction?: (item: EstimateOrder) => void; // Make optional
  onViewAction: (item: EstimateOrder) => void;
  onEstimateAction?: (item: EstimateOrder) => void; // Make optional
  onSignAction?: (item: EstimateOrder) => void;
  activeTab?: "pending" | "approved" | "signing";
  onCreateSignatureRequest?: (item: EstimateOrder) => void;
}

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
            {/* Only show Approve button if onApproveAction is provided */}
            {onApproveAction && (
              <Tooltip color="success" content="Duyệt dự toán">
                <ApprovalIcon
                  className={GreenIconColor}
                  onClick={() => onApproveAction(item)}
                />
              </Tooltip>
            )}

            {/* Only show Reject button if onRejectAction is provided */}
            {onRejectAction && (
              <Tooltip color="danger" content="Từ chối dự toán">
                <RejectIcon
                  className={RedIconColor}
                  onClick={() => onRejectAction(item)}
                />
              </Tooltip>
            )}

            {onCreateSignatureRequest && (
              <Tooltip color="primary" content="Tạo yêu cầu ký">
                <EstimationIcon
                  className={BlueYellowIconColor}
                  onClick={() => onCreateSignatureRequest(item)}
                />
              </Tooltip>
            )}
            {onSignAction && item.status === "approved" && (
              <Tooltip color="primary" content="Xem">
                <PencilIcon
                  className={BlueYellowIconColor}
                  onClick={() => onSignAction(item)}
                />
              </Tooltip>
            )}
            {/* Tạo yêu cầu ký button */}
            {/* {onCreateSignatureRequest && (
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => onCreateSignatureRequest(item)}
              >
                Tạo yêu cầu ký
              </Button>
            )} */}

            {/* Ký duyệt button - only show for signing status */}
            {/* {onSignAction && item.status === "approved" && (
              <Button
                size="sm"
                color="success"
                variant="flat"
                onPress={() => onSignAction(item)}
              >
                Ký duyệt
              </Button>
            )} */}
          </div>
        );
      default:
        // @ts-ignore
        return item[columnKey];
    }
  };

  return (
    <GenericDataTable
      columns={ESTIMATE_APPROVAL_COLUMN as any}
      data={data}
      isCollapsible
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: onPageChange,
        summary: `${totalItems}`,
      }}
      renderCellAction={renderCell}
      tableProps={{
        selectionMode: "none",
      }}
      title=""
      isLoading={loading}
      headerSummary={`${totalItems}`}
    />
  );
};
