"use client";
import React from "react";
import CustomInput from "@/components/ui/CustomInput";
import { Select, SelectItem } from "@heroui/react";
import { SearchIcon } from "@/components/ui/Icons";

export const AddressInfo = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-blue-700 font-bold border-b pb-2">Địa chỉ & vị trí chi tiết</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CustomInput label="Số nhà" placeholder="Nhập số nhà" />
        <CustomInput label="Đường phố" placeholder="Nhập tên đường" endContent={<SearchIcon size={18}/>} />
        
        <Select label="Thôn / Làng" variant="bordered" radius="md">
          <SelectItem key="1">Chọn thôn / làng</SelectItem>
        </Select>

        <Select label="Tổ, khu, xóm" variant="bordered" radius="md">
          <SelectItem key="1">Chọn tổ/khu/xóm</SelectItem>
        </Select>

        <Select label="Phường (xã)" variant="bordered" radius="md">
          <SelectItem key="1">Chọn phường/xã</SelectItem>
        </Select>

        <Select label="Chi nhánh" variant="bordered" radius="md" defaultSelectedKeys={["nd"]}>
          <SelectItem key="nd">TP Nam Định</SelectItem>
        </Select>

        <div className="md:col-span-3">
          <CustomInput label="Điểm đấu nối, khối thủy" placeholder="Nhập thông tin điểm đấu nối" />
        </div>
      </div>
    </div>
  );
};