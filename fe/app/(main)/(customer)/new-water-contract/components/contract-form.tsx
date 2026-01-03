"use client";
import React from "react";
import CustomInput from "@/components/ui/CustomInput";
import { Select, SelectItem, Checkbox } from "@heroui/react";
import { SearchIcon, CalendarIcon } from "@/components/ui/Icons";

export const ContractForm = () => {
  return (
    <div className="space-y-10">
      {/* A. THÔNG TIN ĐỊNH DANH */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-700">A. THÔNG TIN ĐỊNH DANH</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Mã đơn" placeholder="01025070074" endContent={<SearchIcon size={18} className="text-blue-500"/>} />
          <CustomInput label="Tên khách hàng" placeholder="Nhập tên khách hàng" />
          <CustomInput label="Người đại diện" placeholder="Nhập tên người đại diện" />
          <CustomInput label="Chức vụ" placeholder="Nhập chức vụ" />
        </div>
      </section>

      {/* B. ĐỊA CHỈ LẮP ĐẶT */}
      <section className="space-y-4">
        <h3 className="font-bold text-gray-700">B. ĐỊA CHỈ LẮP ĐẶT</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số nhà" placeholder="Nhập số nhà" />
          <CustomInput label="Đường phố" placeholder="Nhập tên đường phố" endContent={<SearchIcon size={18} className="text-blue-500"/>} />
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
        <h3 className="font-bold text-gray-700">C. THÔNG TIN CÁ NHÂN / PHÁP LÝ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số CMND / CCCD" />
          <CustomInput label="Ngày cấp" type="date" endContent={<CalendarIcon size={18}/>} />
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
        <h3 className="font-bold text-gray-700">D. THÔNG TIN THANH TOÁN & HỢP ĐỒNG</h3>
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
          <CustomInput label="Ngày làm hợp đồng" type="date" endContent={<CalendarIcon size={18}/>} />
          <CustomInput label="Ngày giao thi công" placeholder="2025-12-25" type="date" endContent={<CalendarIcon size={18}/>} />
          <Select label="Chi nhánh" variant="bordered" defaultSelectedKeys={["nd"]}>
            <SelectItem key="nd">TP Nam Định</SelectItem>
          </Select>
        </div>
      </section>

      {/* G. PHẦN MỞ RỘNG - XUẤT HÓA ĐƠN */}
      <section className="space-y-4">
        <div className="flex items-center gap-4 border-b pb-2">
           <h3 className="font-bold text-gray-700 uppercase">G. Phần mở rộng - Xuất hóa đơn</h3>
           <Checkbox size="sm">Đổi thông tin xuất hóa đơn</Checkbox>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Tên xuất hóa đơn" />
          <CustomInput label="Địa chỉ xuất hóa đơn" />
          <div className="md:col-span-2">
            <CustomInput label="Nội dung" placeholder="Nhập ghi chú" />
          </div>
        </div>
      </section>
    </div>
  );
};