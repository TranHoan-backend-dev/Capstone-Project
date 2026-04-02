"use client";

import React, { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { PriceBox } from "@/components/popup-status/price-box";
import { NoteField } from "@/components/popup-status/note-field";
import { numberToVietnamese } from "@/utils/numberToVietnamese";
import { Chip } from "@heroui/react";

export const statusLabelMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  WAITING_FOR_SIGNATURE: "Chờ ký duyệt",
  PARTIALLY_SIGNED: "Đang ký",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

export const statusColorMap: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  PENDING: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-600",
  },
  PROCESSING: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-600",
  },
  WAITING_FOR_SIGNATURE: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-600",
  },
  PARTIALLY_SIGNED: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-600",
  },
  APPROVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-600",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-600",
  },
};

export const EstimateDetailModal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;
  const [creatorName, setCreatorName] = useState("Đang tải...");

  useEffect(() => {
    const fetchCreator = async () => {
      if (!data?.creator) return;

      try {
        const res = await fetch(`/api/auth/employees/${data.creator}/name`);
        const json = await res.json();

        const emp = json?.data;

        setCreatorName(emp);
      } catch (err) {
        setCreatorName("Không lấy được");
      }
    };

    fetchCreator();
  }, [data?.creatorId]);

  const statusColors = statusColorMap[data.status] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-600",
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin dự toán" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <InfoRow
              label="Mã đơn đăng ký"
              value={
                <span className="text-black-600 font-medium">{data.code}</span>
              }
            />

            <InfoRow label="Địa chỉ lắp đặt" value={data.address} />

            <InfoRow label="Ngày đăng ký" value={data.registerDate} />

            <InfoRow
              label="Trạng thái"
              value={
                <Chip
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${statusColors.bg} ${statusColors.text} rounded-md`}
                >
                  <span
                    className={`w-1.5 h-1.5 ${statusColors.dot} rounded-full`}
                  />
                  {statusLabelMap[data.status] ?? data.status}
                </Chip>
              }
            />

            <div className="border-t border-gray-200 my-4" />

            <InfoRow label="Người lập chiết tính" value={creatorName} />
            <InfoRow label="Ngày lập chiết tính" value={data.createDate} />

            <div className="border-t border-gray-200 my-4" />

            <InfoRow
              label="Tổng giá trị công trình"
              value={
                <PriceBox
                  text={numberToVietnamese(data.totalPrice) + " đồng"}
                  value={data.totalPrice}
                />
              }
            />

            <InfoRow label="Ghi chú" value={<NoteField value={data.note} />} />
          </div>
        </div>
      </div>
    </>
  );
};
