"use client";

import React from "react";
import { Divider } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { TitleDarkColor } from "@/config/chip-and-icon";

export const AddressInfo = () => {
  return (
    <div>
      <div className="space-y-6 pb-6 border-b border-gray-100 dark:border-divider">
        <h2
          className={`text-sm font-bold text-blue-600 ${TitleDarkColor} uppercase tracking-wider`}
        >
          Địa chỉ & vị trí chi tiết
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomInput label="Số nhà" />
        <SearchInputWithButton label="Đường phố" />
        {[
          {
            label: "Thôn / Làng",
            items: [
              {
                label: "Chọn thôn / làng",
                value: "",
              },
            ],
          },
          {
            label: "Tổ, khu, xóm",
            items: [
              {
                label: "Chọn tổ/khu/xóm",
                value: "",
              },
            ],
          },
          {
            label: "Phường (xã)",
            items: [
              {
                label: "Chọn phường/xã",
                value: "",
              },
            ],
          },
          {
            label: "Chi nhánh",
            items: [
              {
                label: "TP Nam Định",
                value: "",
              },
            ],
          },
        ].map((item, idx) => (
          <CustomSelect label={item.label} key={idx} options={item.items} />
        ))}

        <div className="md:col-span-3">
          <CustomInput label="Điểm đấu nối, khối thủy" />
        </div>
      </div>
      <Divider className="mt-6 mb-6" />
    </div>
  );
};
