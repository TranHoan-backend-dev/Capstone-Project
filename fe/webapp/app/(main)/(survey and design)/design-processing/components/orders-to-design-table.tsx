"use client";

import React, { useState } from "react";
import { Chip, Tooltip } from "@heroui/react";

import { DesignProcessingModal } from "./design-processing-modal";
import { InstallationFormDetailPopup } from "../../assigning-survey/components/installation-form-detail-popup";

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
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";

interface OrdersToDesignTableProps {
  data: DesignProcessingItem[];
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
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
  page,
  totalPages,
  totalElements,
  onPageChange,
  onApprove,
}: OrdersToDesignTableProps) => {
  const [selectedDesign, setSelectedDesign] =
    useState<DesignProcessingItem | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailPopup, setDetailPopup] = useState<{
    isOpen: boolean;
    formCode: string;
    formNumber: string;
  }>({ isOpen: false, formCode: "", formNumber: "" });
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

  const handleOpenDetailPopup = (item: DesignProcessingItem) => {
    setDetailPopup({
      isOpen: true,
      formCode: item.id,
      formNumber: item.formNumber,
    });
  };

  const handleApproveConfirm = async () => {
    if (!approveItem) return;

    try {
      const res = await authFetch(
        "/api/construction/installation-forms/approve",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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

        CallToast({
          title: "Thành công",
          message: "Duyệt đơn thành công",
          color: "success",
        });
      } else {
        CallToast({
          title: "Lỗi",
          message: json.message || "Duyệt đơn thất bại",
          color: "danger",
        });
      }
    } catch (error: any) {
      console.error(error);
      CallToast({
        title: "Lỗi",
        message: error.message || "Có lỗi xảy ra",
        color: "danger",
      });
    }
  };

  const handleRejectConfirm = async () => {
    if (!approveItem) return;

    try {
      const res = await authFetch(
        "/api/construction/installation-forms/approve",
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
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

        CallToast({
          title: "Thành công",
          message: "Từ chối đơn thành công",
          color: "success",
        });
      } else {
        CallToast({
          title: "Lỗi",
          message: json.message || "Từ chối đơn thất bại",
          color: "danger",
        });
      }
    } catch (error: any) {
      console.error(error);
      CallToast({
        title: "Lỗi",
        message: error.message || "Có lỗi xảy ra",
        color: "danger",
      });
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
        }
        return (
          // <button
          //   onClick={() => handleOpenDetailPopup(item)}
          //   className={`font-bold text-blue-600 hover:underline hover:text-blue-800 cursor-pointer ${TitleDarkColor}`}
          // >
          //   {item.formNumber}
          // </button>
          <span className="font-medium text-black dark:text-white">
            {item.formNumber}
          </span>
        );

      case "customerName":
        if (!item.customerName) {
        }

        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );

      case "status":
        if (!item.status) {
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
          onChange: onPageChange,
          summary: `${totalElements}`,
        }}
      />

      <DesignProcessingModal
        data={selectedDesign ? mapDesignToModalData(selectedDesign) : undefined}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <InstallationFormDetailPopup
        isOpen={detailPopup.isOpen}
        onClose={() => setDetailPopup({ isOpen: false, formCode: "", formNumber: "" })}
        formCode={detailPopup.formCode}
        formNumber={detailPopup.formNumber}
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
            <CustomButton
              variant="light"
              onPress={() => setIsApproveModalOpen(false)}
            >
              Hủy
            </CustomButton>

            <CustomButton
              color="success"
              onPress={handleApproveConfirm}
              className="text-white"
              startContent={<ApprovalIcon className="w-4 h-4" />}
            >
              Đồng ý
            </CustomButton>
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
            <CustomButton
              variant="light"
              onPress={() => setIsRejectModalOpen(false)}
            >
              Hủy
            </CustomButton>

            <CustomButton
              color="success"
              onPress={handleRejectConfirm}
              className="text-white"
              startContent={<ApprovalIcon className="w-4 h-4" />}
            >
              Đồng ý
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
