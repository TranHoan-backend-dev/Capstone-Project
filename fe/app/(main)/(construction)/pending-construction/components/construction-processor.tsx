"use client";
import CustomButton from "@/components/ui/CustomButton";
import CustomInput from "@/components/ui/CustomInput";
import { CalendarIcon, CheckIcon, SearchIcon, XMarkIcon } from "@/components/ui/Icons";
import { Select, SelectItem } from "@heroui/react";

export const ConstructionProcessor = () => {
  return (
    <div className="space-y-8">
      {/* 1. Bộ lọc tìm kiếm */}
      <div className="flex items-end gap-4 bg-white p-6 rounded-lg border shadow-sm">
        <div className="flex-1 grid grid-cols-3 gap-4">
          <CustomInput label="Từ khóa" placeholder="Nhập từ khóa tìm kiếm" endContent={<SearchIcon size={18} />} />
          <CustomInput label="Từ ngày" type="date" endContent={<CalendarIcon size={18} />} />
          <CustomInput label="Đến ngày" type="date" endContent={<CalendarIcon size={18} />} />
        </div>
        <CustomButton className="bg-blue-600 text-white w-[100px] h-10 rounded-md">Tìm</CustomButton>
      </div>

      {/* 2. Form xử lý duyệt đơn */}
      <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <CustomInput label="Ngày duyệt đơn" type="date" endContent={<CalendarIcon size={18} />} />
          <CustomInput label="Nội dung" placeholder="Nhập nội dung" />
          <Select label="Đội trưởng thi công" variant="bordered">
            <SelectItem key="1">Chọn đội trưởng...</SelectItem>
          </Select>
          <Select label="Đơn vị thi công" variant="bordered">
            <SelectItem key="1">Chọn đơn vị...</SelectItem>
          </Select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          {/* Nút Duyệt đơn tận dụng CustomButton */}
          <CustomButton
            variant="flat" // Dùng flat để có nền nhạt chữ đậm
            className="bg-[#86efac] text-green-800 w-[140px] h-10 font-bold"
            startContent={<CheckIcon size={18} />}
          >
            Duyệt đơn (F2)
          </CustomButton>

          {/* Nút Từ chối tận dụng CustomButton */}
          <CustomButton
            variant="flat"
            className="bg-[#fca5a5] text-red-800 w-[140px] h-10 font-bold"
            startContent={<XMarkIcon size={18} />}
          >
            Từ chối
          </CustomButton>
        </div>
      </div>
    </div>
  );
};