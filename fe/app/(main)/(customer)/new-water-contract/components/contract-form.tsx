"use client";
import React, { useRef } from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { RefreshIcon, SaveIcon, SearchIcon } from "@/components/ui/Icons";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Checkbox, Select, SelectItem } from "@heroui/react";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomButton from "@/app/(auth)/login/components/custom-button";

/* ===== DateInput dùng chung ===== */
const DateInput = ({ label }: { label: string }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const openCalendar = () => {
    if (inputRef.current && typeof inputRef.current.showPicker === "function") {
      try {
        inputRef.current.showPicker();
      } catch {}
    }
  };

  return (
    <div onClick={openCalendar} className="cursor-pointer">
      <CustomInput
        ref={inputRef}
        label={label}
        type="date"
        endContent={
          <CalendarDaysIcon className="w-4 h-4 text-gray-400 pointer-events-none" />
        }
        classNames={{
          input:
            "[&::-webkit-calendar-picker-indicator]:opacity-0 cursor-pointer",
        }}
      />
    </div>
  );
};



  export const ContractForm = () => {
  return (
    <GenericSearchFilter
      title="Hợp Đồng Cấp Nước Mới"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-10"
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
            className="w-[120px] h-9 bg-[#71717a] text-white"
            startContent={<RefreshIcon size={16} />}
          >
            Làm mới
          </CustomButton>
        </div>
      }
    >
      {/* A. THÔNG TIN ĐỊNH DANH */}
      <section className="space-y-4">
        <h3 className="text-base font-bold mb-4">A. THÔNG TIN ĐỊNH DANH</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Mã đơn" endContent={<SearchIcon size={18} />} />
          <CustomInput label="Tên khách hàng" />
          <CustomInput label="Người đại diện" />
          <CustomInput label="Chức vụ" />
        </div>
      </section>

      {/* B. ĐỊA CHỈ LẮP ĐẶT */}
      <section className="space-y-4">
        <h3 className="text-base font-bold mb-4">B. ĐỊA CHỈ LẮP ĐẶT</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số nhà" />
          <CustomInput label="Đường phố" endContent={<SearchIcon size={18} />} />
          <Select label="Thôn / Làng" variant="bordered">
            <SelectItem key="tl1">Chọn thôn/làng</SelectItem>
          </Select>
          <Select label="Tổ / Khu / Xóm" variant="bordered">
            <SelectItem key="t1">Chọn tổ/khu/xóm</SelectItem>
          </Select>
          <Select label="Phường/Xã" variant="bordered">
            <SelectItem key="p1">Chọn phường/xã</SelectItem>
          </Select>
        </div>
      </section>

      {/* C. THÔNG TIN CÁ NHÂN / PHÁP LÝ */}
      <section className="space-y-4">
        <h3 className="text-base font-bold mb-4">C. THÔNG TIN CÁ NHÂN / PHÁP LÝ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số CMND / CCCD" />
          <DateInput label="Ngày cấp" />
          <CustomInput label="Nơi cấp" />
          <CustomInput label="Điện thoại" />
          <CustomInput label="Mã hộ khẩu" />
          <CustomInput label="Mã số thuế (MST)" />
          <CustomInput label="Số hộ" type="number" defaultValue="1" />
          <CustomInput label="Số nhân khẩu" type="number" defaultValue="1" />
          <Select label="Mục đích sử dụng" variant="bordered" defaultSelectedKeys={["sh"]}>
            <SelectItem key="sh">SH - Sinh hoạt</SelectItem>
          </Select>
        </div>
      </section>

      {/* D. THÔNG TIN THANH TOÁN & HỢP ĐỒNG */}
      <section className="space-y-4">
        <h3 className="text-base font-bold mb-4">D. THÔNG TIN THANH TOÁN & HỢP ĐỒNG</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số hợp đồng" />
          <Select label="Loại hợp đồng" variant="bordered" defaultSelectedKeys={["gd"]}>
            <SelectItem key="gd">Gia đình</SelectItem>
          </Select>
          <Select label="Mã nguồn" variant="bordered">
            <SelectItem key="n1">Nhập mã nguồn</SelectItem>
          </Select>
          <Select label="Hạng mục" variant="bordered">
            <SelectItem key="h1">Nhập mã nguồn</SelectItem>
          </Select>
          <CustomInput label="Người ký hợp đồng" />
          <CustomInput label="Chức vụ" />
          <Select label="Hình thức thanh toán" variant="bordered" defaultSelectedKeys={["tn"]}>
            <SelectItem key="tn">Thu tại nhà</SelectItem>
          </Select>
          <CustomInput label="Số tài khoản" />
          <Select label="Ngân hàng" variant="bordered">
            <SelectItem key="vcb">Vietcombank</SelectItem>
          </Select>

          <DateInput label="Ngày làm hợp đồng" />
          <DateInput label="Ngày giao thi công" />

          <Select label="Chi nhánh" variant="bordered" defaultSelectedKeys={["nd"]}>
            <SelectItem key="nd">TP Nam Định</SelectItem>
          </Select>
        </div>
      </section>

      {/* E. PHẦN MỞ RỘNG */}
      <section className="space-y-4">
        <div className="flex items-center gap-4 border-b pb-2 mb-4">
          <h3 className="text-base font-bold">E. PHẦN MỞ RỘNG - XUẤT HÓA ĐƠN</h3>
          <Checkbox size="sm">Đổi thông tin xuất hóa đơn</Checkbox>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Tên xuất hóa đơn" />
          <CustomInput label="Địa chỉ xuất hóa đơn" />
          <div className="md:col-span-2">
            <CustomInput label="Nội dung" />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};