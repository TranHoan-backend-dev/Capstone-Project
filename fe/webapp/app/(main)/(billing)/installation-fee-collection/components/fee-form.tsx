"use client";

import { Checkbox } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { RefreshIcon, SaveIcon, SearchIcon } from "@/components/ui/Icons";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomButton from "@/components/ui/custom/CustomButton";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";

export const FeeForm = () => {
  return (
    <GenericSearchFilter
      title="Thông tin phiếu thu"
      icon={<SearchIcon size={18} />}
      gridClassName="grid grid-cols-1 md:grid-cols-3 gap-8"
      isCollapsible={false}
      actions={
        <div className="flex justify-end gap-3">
          <CustomButton
            color="success"
            className="w-[120px] h-9 text-white"
            startContent={<SaveIcon size={16} />}
          >
            Lưu
          </CustomButton>

          <CustomButton
            color="primary"
            className="w-[120px] h-9"
            startContent={<RefreshIcon size={16} />}
          >
            Làm mới
          </CustomButton>
        </div>
      }
    >
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Thông tin khách hàng</h3>
        <SearchInputWithButton label="Mã đơn" isRequired />
        <CustomInput label="Tên khách hàng" isRequired />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Thông tin địa chỉ</h3>
        <CustomInput label="Số nhà" />
        <CustomInput label="Thôn/Làng" />
        <CustomInput label="Đường phố" />
        <div className="grid grid-cols-2 gap-2">
          <CustomSelect
            label="Phường"
            options={[
              {
                label: "Chọn phường",
                value: "p1",
              },
            ]}
          />
          <CustomSelect
            label="Tổ / Khu / Xóm"
            options={[
              {
                label: "Chọn tổ/khu",
                value: "t1",
              },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Thông tin thu tiền</h3>
        <CustomDatePicker label="Ngày thu" isRequired />
        <CustomInput label="Số phiếu thu" />
        <CustomSelect
          label="Hình thức thanh toán"
          options={[
            {
              label: "Chuyển khoản",
              value: "ck",
            },
            {
              label: "Tiền mặt",
              value: "tm",
            },
          ]}
          isRequired
        />
        <Checkbox size="sm" color="primary">
          Đã thu tiền
        </Checkbox>
      </div>
    </GenericSearchFilter>
  );
};
