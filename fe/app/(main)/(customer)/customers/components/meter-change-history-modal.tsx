"use client";

import React from "react";

import CustomModal from "@/components/ui/modal/CustomModal";

interface MeterChangeHistoryModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const MeterChangeHistoryModal = ({
  isOpen,
  onOpenChange,
}: MeterChangeHistoryModalProps) => {
  // Hardcoded mock data for the top section as per image
  const customerInfo = {
    code: "000123",
    name: "Nguyễn Song Hoàn",
    address: "2f9b YTĐ, Hoàng Diệu, Hoàng Diệu, Phường Nam Định",
  };

  return (
    <CustomModal
      isOpen={isOpen}
      title="Lịch sử thay đồng hồ khách hàng"
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-2 p-2">
        {[
          { label: "Mã khách hàng:", value: customerInfo.code },
          { label: "Tên khách hàng:", value: customerInfo.name },
          { label: "Địa chỉ:", value: customerInfo.address },
        ].map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <span className="font-bold text-sm">{item.label}</span>
            <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </CustomModal>
  );
};
