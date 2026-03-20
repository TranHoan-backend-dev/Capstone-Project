"use client";

import { InformationCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Spinner } from "@heroui/react";

import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { PriceBox } from "@/components/popup-status/price-box";
import { NoteField } from "@/components/popup-status/note-field";
import { SettlementDetail } from "@/types";

interface SettlementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: SettlementDetail;
  loading?: boolean;
}

export const SettlementDetailModal = ({
  isOpen,
  onClose,
  data,
  loading = false,
}: SettlementDetailModalProps) => {
  if (!isOpen) return null;

  const formatCurrency = (value?: number | string) => {
    if (!value) return "0 VNĐ";
    if (typeof value === "string") return value;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin chiết tính" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner label="Đang tải thông tin..." />
              </div>
            ) : data ? (
              <>
                <InfoRow
                  label="Mã đơn đăng ký"
                  value={
                    <span className="text-blue-600 font-medium">
                      {data.address}
                    </span>
                  }
                />

                <InfoRow label="Địa chỉ lắp đặt" value={data.address} />

                <InfoRow
                  icon={
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  }
                  label="Ngày đăng ký"
                  value={formatDate(data.createDate)}
                />

                <InfoRow
                  label="Trạng thái"
                  value={
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md">
                      <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                      {data.status}
                    </span>
                  }
                />

                <div className="border-t border-gray-200 my-4" />

                <InfoRow
                  label="Người lập chiết tính"
                  value={data.creator || "Chưa cập nhật"}
                />
                <InfoRow
                  icon={
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  }
                  label="Ngày lập chiết tính"
                  value={formatDate(data.createDate)}
                />

                <InfoRow
                  label="Người duyệt chiết tính"
                  value={data.approver || "Chưa cập nhật"}
                />
                <InfoRow
                  icon={
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  }
                  label="Ngày duyệt chiết tính"
                  value={formatDate(data.approveDate)}
                />

                <div className="border-t border-gray-200 my-4" />

                <InfoRow
                  label="Tổng giá trị công trình"
                  value={
                    <PriceBox
                      text="Tổng giá trị"
                      value={formatCurrency(
                        data.totalPriceNumber || data.totalPrice,
                      )}
                    />
                  }
                />

                <InfoRow
                  label="Ghi chú"
                  value={<NoteField value={data.note || "Không có ghi chú"} />}
                />
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Không tìm thấy thông tin chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
