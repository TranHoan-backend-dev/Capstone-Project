"use client";

import CustomButton from "@/components/ui/custom/CustomButton";

import {
    SearchIcon,
    RestoreIcon,
    AddNewIcon,
    BlueYellowIconColor,
    WhiteIconColor,
} from "@/config/chip-and-icon";

export const FormActions = () => {
  return (
    <div className="flex justify-end gap-3">
      <CustomButton color="primary" startContent={<SearchIcon className={BlueYellowIconColor} />}>
        Tìm
      </CustomButton>

      <CustomButton color="success" startContent={<AddNewIcon className={WhiteIconColor} />}>
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
