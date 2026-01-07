"use client";

import React from "react";
import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { NoteField } from "@/components/popup-status/note-field";
import { InformationIcon } from "@/config/chip-and-icon";

export const DesignProcessingModal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin đơn đăng ký" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <InfoRow
              label="Mã đơn đăng ký"
              value={
                <span className="text-blue-600 font-medium">{data.code}</span>
              }
            />

            <InfoRow label="Địa chỉ lắp đặt" value={data.address} />

            <InfoRow
              icon={<InformationIcon className="w-4 h-4 text-gray-400" />}
              label="Ngày đăng ký"
              value={data.registerDate}
            />

            <InfoRow
              label="Trạng thái"
              value={
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-70 rounded-md">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                  {data.status}
                </span>
              }
            />

            <InfoRow label="Ghi chú" value={<NoteField value={data.note} />} />
          </div>
        </div>
      </div>
    </>
  );
};
