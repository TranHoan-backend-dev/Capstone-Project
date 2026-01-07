"use client";

import React from "react";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import FilterButton from "@/components/ui/FilterButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomInput from "@/components/ui/custom/CustomInput";
import { RejectIcon, CheckApprovalIcon } from "@/config/chip-and-icon";

interface RestoreFilterProps {
  periodData: { label: string; value: string }[];
}

export const RestoreFilter = ({ periodData }: RestoreFilterProps) => {
  return (
    <GenericSearchFilter
      isCollapsible
      actions={
        <>
          <FilterActionButton
            className="bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40 mr-2"
            color="success"
            icon={<CheckApprovalIcon className="w-4 h-4" />}
            label="Lưu"
            onPress={() => {}}
          />
          <FilterActionButton
            className="bg-red-500 hover:bg-red-600 dark:shadow-md dark:shadow-danger/40 mr-2"
            color="danger"
            icon={<RejectIcon className="w-4 h-4" />}
            label="Hủy"
            onPress={() => {}}
          />
          <FilterButton />
        </>
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
