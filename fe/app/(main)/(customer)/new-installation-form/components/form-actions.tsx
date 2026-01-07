"use client";

import React from "react";
import CustomButton from "@/components/ui/custom/CustomButton";
import { DeleteIcon, DocumentCheckedIcon, SumIcon } from "@/config/chip-and-icon";

export const FormActions = () => {
  return (
    <div className="flex justify-between items-center pt-8 border-t border-gray-100 dark:border-divider">
      <div className="flex gap-3">
        <CustomButton
          className="bg-blue-600 h-10 px-6 font-bold text-[13px]"
          color="primary"
          startContent={<DocumentCheckedIcon className="w-5 h-5" />}
        >
          Tìm đơn
        </CustomButton>
        <CustomButton
          className="bg-[#10a345] text-white h-10 px-6 font-bold text-[13px]"
          color="success"
          startContent={<SumIcon className="w-5 h-5" />}
        >
          Lưu & Tạo mới
        </CustomButton>
      </div>
      <div className="flex gap-3">
        <CustomButton
          className="bg-gray-100 dark:bg-default-100 text-gray-700 dark:text-foreground font-bold px-6 shadow-none border border-gray-200 dark:border-divider h-9 shrink-0"
          radius="md"
          size="md"
          startContent={<DeleteIcon className="w-5 h-5" />}
        >
          Xóa các lựa chọn
        </CustomButton>
      </div>
    </div>
  );
};
