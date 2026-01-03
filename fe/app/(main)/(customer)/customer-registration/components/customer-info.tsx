"use client";

import React from "react";
import CustomInput from "@/components/ui/CustomInput"; // Điều chỉnh đường dẫn theo dự án của bạn
import { SearchIcon, CalendarIcon } from "@/components/ui/Icons";// Cần thêm icon Calendar

export const CustomerInfo = () => {
  return (
    <div className="space-y-4">
      {/* Tiêu đề Section */}
      <div className="border-b pb-2">
        <h3 className="text-lg font-bold text-blue-700">Thông tin đơn & định danh</h3>
      </div>

      {/* Grid Layout 3 cột */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomInput 
          label="Mã đơn" 
          placeholder="Nhập mã đơn" 
          endContent={<SearchIcon className="text-gray-400 size-4" />}
          isRequired 
        />
        <CustomInput 
          label="Mã khách hàng" 
          placeholder="Nhập mã khách hàng" 
        />
        <CustomInput 
          label="Mã số thuế" 
          placeholder="Nhập mã số thuế" 
        />

        <CustomInput 
          label="Tên khách hàng" 
          placeholder="Nhập tên khách hàng" 
          isRequired
        />
        <CustomInput 
          label="Số CCCD" 
          placeholder="Nhập số" 
        />
        <CustomInput 
          label="Ngày cấp" 
          type="date" 
          endContent={<CalendarIcon className="text-gray-400 size-4" />}
        />

        <CustomInput 
          label="Kỳ khai thác" 
          placeholder="Nhập kỳ khai thác" 
        />
        <CustomInput 
          label="Mã số Quan hệ ngân sách" 
          placeholder="Nhập mã số Quan hệ ngân sách" 
        />
        <CustomInput 
          label="Số điện thoại" 
          placeholder="Nhập số điện thoại" 
        />

        <CustomInput 
          label="Mã hộ khẩu" 
          placeholder="Nhập mã hộ khẩu" 
        />
        <CustomInput 
          label="Mã Hộ Chiếu" 
          placeholder="Nhập số" 
        />
      </div>
    </div>
  );
};