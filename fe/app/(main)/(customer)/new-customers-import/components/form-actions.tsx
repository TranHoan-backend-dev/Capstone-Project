"use client";

import { Button } from "@heroui/react";

import { RestoreIcon, AddNewIcon } from "@/config/chip-and-icon";

export const FormActions = () => {
  return (
    <div className="flex justify-end gap-3">
      <Button
        color="success"
        className="text-white"
        startContent={<AddNewIcon className="w-4 h-4" />}
      >
        Lưu
      </Button>

      <Button
        className="
          bg-gray-500 
          text-white
          hover:bg-gray-300
          dark:bg-default-200
          dark:hover:bg-default-300
        "
        startContent={<RestoreIcon className="w-4 h-4" />}
      >
        Làm mới
      </Button>
    </div>
  );
};
