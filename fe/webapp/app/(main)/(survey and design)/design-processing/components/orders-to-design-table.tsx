"use client";

import React, { useState } from "react";
import { Chip, Link, Skeleton, Tooltip } from "@heroui/react";
import NextLink from "next/link";

import { DesignProcessingModal } from "./design-processing-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  ApprovalIcon,
  GreenIconColor,
  DarkGreenChip,
  DarkPurpleChip,
  DarkRedChip,
  DarkGrayChip,
  TitleDarkColor,
  RejectIcon,
  DeleteIcon,
  ProfileIcon,
  RedIconColor,
  BlueYellowIconColor,
} from "@/config/chip-and-icon";
import { DesignProcessingItem, StatusDetailData } from "@/types";
import { DESIGN_PROCESSING_COLUMN } from "@/config/table-columns";
import { authFetch } from "@/utils/authFetch";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Button,
} from "@heroui/react";

interface OrdersToDesignTableProps {
  data: DesignProcessingItem[];
  onApprove?: (item: DesignProcessingItem) => void;
}

const statusMap = {
  paid: {
    label: "Đã thanh toán",
    color: "success",
    bg: DarkGreenChip,
  },
  processing: {
    label: "Đang xử lý",
    color: "default",
    bg: DarkPurpleChip,
  },
  pending_restore: {
    label: "Chờ khôi phục",
    color: "success",
    bg: DarkGreenChip,
  },
  rejected: {
    label: "Từ chối",
    color: "danger",
    bg: DarkRedChip,
  },
  none: {
    label: "Không có",
    color: "default",
    bg: DarkGrayChip,
  },
} as const;

export const OrdersToDesignTable = ({
  data,
  onApprove,
}: OrdersToDesignTableProps) => {
  const [selectedDesign, setSelectedDesign] =
    useState<DesignProcessingItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const [approveItem, setApproveItem] = useState<DesignProcessingItem | null>(
    null,
  );
  const [rejectItem, setRejectItem] = useState<DesignProcessingItem | null>(
    null,
  );
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  const mapDesignToModalData = (
    item: DesignProcessingItem,
  ): StatusDetailData => ({
    code: item.formNumber,
    address: item.address,
    registerDate: item.registrationAt,
    status: statusMap[item.status]?.label ?? "Không xác định",
    creator: "",
    createDate: "",
    approver: "",
    approveDate: "",
    totalPrice: "",
    note: "",
  });

  const handleStatusClick = (item: DesignProcessingItem) => {
    setSelectedDesign(item);
    setIsModalOpen(true);
  };

  const handleApproveConfirm = async () => {
    if (!approveItem) return;

    try {
      const res = await authFetch(
        "/api/construction/installation-forms/approve",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formNumber: approveItem.formNumber,
            formCode: approveItem.id,
            status: true,
          }),
        },
      );

      const json = await res.json();

      if (res.ok) {
        onApprove?.(approveItem);
        setIsApproveModalOpen(false);
        setApproveItem(null);
      } else {
        alert(json.message || "Duyệt đơn thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  const handleRejectConfirm = async () => {
    if (!approveItem) return;

    try {
      const res = await authFetch(
        "/api/construction/installation-forms/approve",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formNumber: approveItem.formNumber,
            formCode: approveItem.id,
            status: false,
          }),
        },
      );

      const json = await res.json();

      if (res.ok) {
        onApprove?.(approveItem);
        setIsRejectModalOpen(false);
        setRejectItem(null);
      } else {
        alert(json.message || "Duyệt đơn thất bại");
      }
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra");
    }
  };

  const renderCell = (item: DesignProcessingItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );

      case "code":
        if (!item.formNumber) {
          return <Skeleton className="h-4 w-24 rounded-lg" />;
        }
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href="#"
          >
            {item.formNumber}
          </Link>
        );

      case "customerName":
        if (!item.customerName) {
          return <Skeleton className="h-4 w-24 rounded-lg" />;
        }

        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );

      case "status":
        if (!item.status) {
          return <Skeleton className="h-4 w-24 rounded-lg" />;
        }
        const config = statusMap[item.status] ?? statusMap.none;

        return (
          <button
            className="hover:opacity-80 transition-opacity focus:outline-none"
            onClick={() => handleStatusClick(item)}
          >
            <Chip
              className={`font-bold ${config.bg}`}
              color={config.color}
              size="sm"
              variant="flat"
            >
              {config.label}
            </Chip>
          </button>
        );

      case "activities":
        return (
          <div className="flex justify-center gap-3">
            <Tooltip color="success" content="Duyệt">
              <ApprovalIcon
                className={GreenIconColor}
                onClick={() => {
                  setApproveItem(item);
                  setIsApproveModalOpen(true);
                }}
              />
            </Tooltip>
            <Tooltip color="danger" content="Từ chối">
              <RejectIcon
                className={RedIconColor}
                onClick={() => {
                  setApproveItem(item);
                  setIsRejectModalOpen(true);
                }}
              />
            </Tooltip>
          </div>
        );

      default:
        return item[columnKey as keyof DesignProcessingItem];
    }
  };

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={DESIGN_PROCESSING_COLUMN}
        data={data}
        title="Danh sách đơn chờ thiết kế"
        headerSummary={`${data.length}`}
        renderCellAction={renderCell}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
      />

      <DesignProcessingModal
        data={selectedDesign ? mapDesignToModalData(selectedDesign) : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Xác nhận duyệt</ModalHeader>

          <ModalBody>
            Bạn có chắc chắn muốn duyệt đơn <b>{approveItem?.formNumber}</b>{" "}
            không?
          </ModalBody>

          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setIsApproveModalOpen(false)}
            >
              Hủy
            </Button>

            <Button color="success" onPress={handleApproveConfirm}>
              Đồng ý
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
      >
        <ModalContent>
          <ModalHeader>Xác nhận từ chối</ModalHeader>

          <ModalBody>
            Bạn có chắc chắn muốn từ chối đơn <b>{approveItem?.formNumber}</b>{" "}
            không?
          </ModalBody>

          <ModalFooter>
            <Button variant="light" onPress={() => setIsRejectModalOpen(false)}>
              Hủy
            </Button>

            <Button color="success" onPress={handleRejectConfirm}>
              Đồng ý
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
