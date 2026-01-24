"use client";

import CustomButton from "@/components/ui/custom/CustomButton";
import {
  SearchIcon,
  RestoreIcon,
  SumIcon,
} from "@/config/chip-and-icon";

export const FormActions = () => {
  return (
    <div className="flex justify-end gap-3">
      <CustomButton
        color="primary"
        startContent={<SearchIcon className="text-white" />}
      >
        Tìm
      </CustomButton>

      <CustomButton
        className="bg-[#10a345] text-white h-10 px-6 font-bold text-[13px]"
        color="success"
        startContent={<SumIcon className="w-5 h-5" />}
      >
        Lưu thay đổi
      </CustomButton>

      <CustomButton
        className="
          bg-gray-500 
          text-white
          hover:bg-gray-300
          dark:bg-default-200
          dark:hover:bg-default-300
        "
        startContent={<RestoreIcon className="w-4 h-4" />}
      >
        Làm mới bộ lọc
      </CustomButton>
    </div>
  );
};
