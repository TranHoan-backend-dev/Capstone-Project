"use client";

import { SearchIcon, RestoreIcon, AddNewIcon } from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";

export const FormActions = () => {
  return (
    <div className="flex justify-end gap-3">
      <CustomButton color="primary" startContent={<SearchIcon className="w-4 h-4" />}>
        Tìm
      </CustomButton>

      <CustomButton color="success" startContent={<AddNewIcon className="w-4 h-4" />}>
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
