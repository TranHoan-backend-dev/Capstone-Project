"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from "@heroui/react";

import { InstallationFormDetailPopup } from "../../assigning-survey/components/installation-form-detail-popup";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DeleteIcon,
  ProfileIcon,
  RejectIcon,
  RedIconColor,
  BlueYellowIconColor,
  TitleDarkColor,
  ApprovalIcon,
} from "@/config/chip-and-icon";
import { PROCESSED_DESIGN_COLUMN } from "@/config/table-columns";
import { DesignProcessingItem } from "@/types";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import CustomButton from "@/components/ui/custom/CustomButton";

interface ProcessedDesignsTableProps {
  data: any[];
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onReject?: (item: any) => void;
}
export const ProcessedDesignsTable = ({
  data,page,totalPages,totalElements,onPageChange,
  onReject,
}: ProcessedDesignsTableProps) => {
  const [approveItem, setApproveItem] = useState<DesignProcessingItem | null>(
    null,
  );
  const [rejectItem, setRejectItem] = useState<DesignProcessingItem | null>(
    null,
  );
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [detailPopup, setDetailPopup] = useState<{
    isOpen: boolean;
    formCode: string;
    formNumber: string;
  }>({ isOpen: false, formCode: "", formNumber: "" });

  const handleOpenDetailPopup = (item: DesignProcessingItem) => {
    setDetailPopup({
      isOpen: true,
      formCode: item.id,
      formNumber: item.formNumber,
    });
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
        onReject?.(approveItem);
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
      case "code":
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
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "activities":
        return (
          <div className="flex justify-center items-center gap-5">
            <Tooltip color="danger" content="Từ chối">
              <RejectIcon
                className={RedIconColor}
                onClick={() => {
                  setApproveItem(item);
                  setIsRejectModalOpen(true);
                }}
              />
            </Tooltip>
            {/* <Tooltip color="danger" content="Xóa">
              <DeleteIcon className={RedIconColor} />
            </Tooltip> */}
          </div>
        );
      // case "docs":
      //   return (
      //     <div className="flex justify-center">
      //       <ProfileIcon className={BlueYellowIconColor} />
      //     </div>
      //   );
      case "no":
        return (
          <span className="font-medium text-black dark:text-white">
            {data.indexOf(item) + 1}
          </span>
        );
      default:
        return item[columnKey as keyof DesignProcessingItem];
    }
  };

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={PROCESSED_DESIGN_COLUMN}
        data={data}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: onPageChange,
          summary: `${totalElements}`,
        }}
        renderCellAction={renderCell}
        title="Danh sách đơn đang xử lý thiết kế"
      />
      <InstallationFormDetailPopup
        isOpen={detailPopup.isOpen}
        onClose={() => setDetailPopup({ isOpen: false, formCode: "", formNumber: "" })}
        formCode={detailPopup.formCode}
        formNumber={detailPopup.formNumber}
      />
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

            <CustomButton color="success" onPress={handleRejectConfirm} className="text-white" startContent={<ApprovalIcon className="w-4 h-4" />}>
              Đồng ý
            </CustomButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
