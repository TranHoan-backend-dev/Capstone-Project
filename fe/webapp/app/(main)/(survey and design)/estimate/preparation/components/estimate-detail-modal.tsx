"use client";

import React, { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";

import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { PriceBox } from "@/components/popup-status/price-box";
import { NoteField } from "@/components/popup-status/note-field";
import { numberToVietnamese } from "@/utils/numberToVietnamese";
export const statusLabelMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  WAITING_FOR_SIGNATURE: "Chờ ký duyệt",
  PARTIALLY_SIGNED: "Đang ký",
  APPROVED: "Đã ký duyệt",
  REJECTED: "Bị từ chối",
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
            <InfoRow
              label="Mã đơn đăng ký"
              value={
                <span className="text-blue-600 font-medium">{data.code}</span>
              }
            />

            <InfoRow label="Địa chỉ lắp đặt" value={data.address} />

            <InfoRow
              icon={<InformationCircleIcon className="w-4 h-4 text-gray-400" />}
              label="Ngày đăng ký"
              value={data.registerDate}
            />

            <InfoRow
              label="Trạng thái"
              value={
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 rounded-md">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  {statusLabelMap[data.status] ?? data.status}
                </span>
              }
            />

            <div className="border-t border-gray-200 my-4" />

            <InfoRow label="Người lập chiết tính" value={creatorName} />
            <InfoRow
              icon={<InformationCircleIcon className="w-4 h-4 text-gray-400" />}
              label="Ngày lập chiết tính"
              value={data.createDate}
            />

            {/* <InfoRow
              icon={<InformationCircleIcon className="w-4 h-4 text-gray-400" />}
              label="Ngày duyệt chiết tính"
              value={data.approveDate}
            /> */}

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
