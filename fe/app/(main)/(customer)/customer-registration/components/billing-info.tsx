"use client";
import React from "react";
import CustomInput from "@/components/ui/CustomInput";
import { Checkbox } from "@heroui/react";
import { CalendarIcon } from "@/components/ui/Icons";

export const BillingInfo = () => {
  return (
    <div className="space-y-8">
      {/* Section: Thông tin phụ */}
      <div className="space-y-4">
        <h3 className="text-blue-700 font-bold border-b pb-2 text-[15px]">Thông tin phụ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cập nhật: Tháng nợ chuyển sang kiểu date theo mockup mới */}
          <CustomInput 
            label="Tháng nợ" 
            type="date" 
            endContent={<CalendarIcon size={18} className="text-gray-400" />} 
          />
          <CustomInput label="Kinh phí lắp đặt" type="number" defaultValue="0" />
          <CustomInput label="M3 khuyến mãi" type="number" defaultValue="0" />
          <CustomInput label="Thời gian khấu trừ" type="number" defaultValue="0" />
        </div>
        
        <div className="flex flex-wrap gap-10 pt-2">
          <Checkbox size="sm" color="primary">Để thông tin xuất hóa đơn</Checkbox>
          <Checkbox size="sm" color="primary">Không tính tiền</Checkbox>
          <Checkbox size="sm" color="primary">Khuyến mãi</Checkbox>
        </div>
      </div>

      {/* Section: Thông tin hóa đơn */}
      <div className="space-y-4">
        <h3 className="text-blue-700 font-bold border-b pb-2 text-[15px]">Thông tin hóa đơn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Tên xuất hóa đơn" placeholder="Nhập tên xuất hóa đơn" />
          <CustomInput label="Địa chỉ xuất hóa đơn" placeholder="Nhập địa chỉ xuất hóa đơn" />
          {/* Ghi chú chiếm 2 cột theo mockup */}
          <div className="md:col-span-2">
            <CustomInput label="Ghi chú" placeholder="Nhập ghi chú" />
          </div>
        </div>
      </div>
    </div>
  );
};