"use client";

import { Textarea } from "@heroui/react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";

export const ConstructionProcessor = () => {
  return (
    <GenericSearchFilter
      title="Xử lý Đơn Chờ Thi Công"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-8"
      isCollapsible
      actions={<></>}
    >
      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Bộ lọc tìm kiếm
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInputWithButton label="Từ khóa" />
            <CustomInput label="Từ ngày" type="date" />
            <CustomInput label="Đến ngày" type="date" />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Thông tin duyệt đơn
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <CustomInput label="Ngày duyệt đơn" type="date" />
          <CustomSelect
            label="Đội trưởng thi công"
            options={[
              {
                label: "Chọn đội trưởng...",
                value: "1",
              },
            ]}
          />
          <CustomSelect
            label="Đơn vị thi công"
            options={[
              {
                label: "Chọn đơn vị...",
                value: "1",
              },
            ]}
          />
        </div>
        <Textarea
          label="Nội dung"
          placeholder="Nhập nội dung"
          variant="bordered"
        />
      </section>
    </GenericSearchFilter>
  );
};
