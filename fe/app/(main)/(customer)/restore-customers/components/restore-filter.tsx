"use client";

import React from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomInput from "@/components/ui/custom/CustomInput";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Button} from "@heroui/react";


interface RestoreFilterProps {
  periodData: { label: string; value: string }[];
}

export const RestoreFilter = ({ periodData }: RestoreFilterProps) => {
  return (
    <GenericSearchFilter
      isCollapsible
      actions={
          <Button
              className="bg-gray-100 dark:bg-default-100 text-gray-700 dark:text-foreground font-bold px-6 shadow-none border border-gray-200 dark:border-divider h-9 shrink-0 hover:bg-gray-200 dark:hover:bg-default-200"
              startContent={<TrashIcon className="w-5 h-5" />}
              size="md"
              radius="md"
              onPress={() => { }}
          >
              Xóa các lựa chọn
          </Button>
      }
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title="Khôi Phục Khách Hàng Hủy"
    >
      <InputField label="Mã KH" />
      <InputField label="Tên khách hàng" />
      <InputField label="Số Điện Thoại" />
      <InputField label="Địa Chỉ" />
      <InputField label="Lý Do Khôi Phục" />
      <div className="space-y-1 lg:col-span-2">
        <CustomSelect
          className="font-bold"
          defaultSelectedKeys={["T8/2025"]}
          label="Kỳ Khôi Phục"
          options={periodData.map((item) => ({
            label: item.label,
            value: item.value,
          }))}
        />
      </div>
    </GenericSearchFilter>
  );
};

export const InputField = ({ label }: { label: string }) => {
  return (
    <div className="space-y-1 lg:col-span-2">
      <CustomInput className="font-bold" label={label} />
    </div>
  );
};
