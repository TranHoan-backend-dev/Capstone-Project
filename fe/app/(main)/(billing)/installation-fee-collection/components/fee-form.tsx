"use client";

import { Checkbox } from "@heroui/react";

import CustomInput from "@/components/ui/custom/CustomInput";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import {
  CalendarIcon,
  RefreshIcon,
  SaveIcon,
  SearchIcon,
} from "@/components/ui/Icons";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomButton from "@/components/ui/custom/CustomButton";

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
        <CustomInput
          label="Mã đơn"
          placeholder="Nhập mã đơn"
          endContent={<SearchIcon size={18} className="text-blue-500" />}
          isRequired
        />
        <CustomInput
          label="Tên khách hàng"
          placeholder="Nhập tên khách hàng"
          isRequired
        />
      </div>

      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Thông tin địa chỉ</h3>
        <CustomInput label="Số nhà" placeholder="Nhập số nhà" />
        <CustomInput label="Thôn/Làng" placeholder="Nhập đường phố" />
        <CustomInput label="Đường phố" placeholder="Nhập đường phố" />
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
        <CustomInput
          label="Ngày thu"
          type="date"
          endContent={<CalendarIcon size={18} />}
          isRequired
        />
        <CustomInput label="Số phiếu thu" placeholder="Nhập số phiếu thu" />
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
