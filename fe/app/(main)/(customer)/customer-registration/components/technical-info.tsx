"use client";
import CustomInput from "@/components/ui/CustomInput";
import { CalendarIcon, SearchIcon } from "@/components/ui/Icons";
import { Checkbox, Select, SelectItem } from "@heroui/react";

export const TechnicalInfo = () => {
  return (
    <div className="space-y-4">
      <h3 className="text-blue-700 font-bold border-b pb-2 text-[15px]">Hợp đồng & thông số kỹ thuật</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Hàng 1 */}
        <CustomInput label="Số hợp đồng" placeholder="Nhập số hợp đồng" />
        <CustomInput label="Mã đồng hồ" placeholder="Nhập mã đồng hồ" />
        <CustomInput label="Ngày hợp đồng" type="date" endContent={<CalendarIcon size={18}/>} />

        {/* Hàng 2 */}
        <CustomInput label="Ngày lắp đặt" type="date" endContent={<CalendarIcon size={18}/>} />
        <CustomInput label="Số hợp đồng lắp đặt" placeholder="Nhập số hợp đồng lắp đặt" />
        <CustomInput label="Ngày hợp đồng lắp đặt" type="date" endContent={<CalendarIcon size={18}/>} />

        {/* Hàng 3 */}
        <Select label="Loại khách hàng" variant="bordered" defaultSelectedKeys={["sh"]}>
          <SelectItem key="sh">Sinh hoạt</SelectItem>
        </Select>
        <Select label="Mục đích sử dụng" variant="bordered" defaultSelectedKeys={["sh"]}>
          <SelectItem key="sh">Sinh hoạt</SelectItem>
        </Select>
        <CustomInput label="Số hộ" type="number" defaultValue="1" />

        {/* Hàng 4 */}
        <CustomInput label="Số nhân khẩu" type="number" defaultValue="1" />
        <Select label="Bảng giá" variant="bordered" defaultSelectedKeys={["bg1"]}>
          <SelectItem key="bg1">Bảng giá 1</SelectItem>
        </Select>
        <Select label="Tính phí bảo vệ môi trường đặc biệt" variant="bordered" defaultSelectedKeys={["0"]}>
          <SelectItem key="0">0%</SelectItem>
          <SelectItem key="10">10%</SelectItem>
        </Select>

        {/* Hàng 5 */}
        <CustomInput label="Lộ trình ghi" placeholder="Nhập lộ trình" endContent={<SearchIcon size={18} className="text-blue-500" />} />
        <Select label="Loại đồng hồ" variant="bordered" endContent={<SearchIcon size={18} className="text-blue-500" />}>
          <SelectItem key="co">Chọn loại đồng hồ</SelectItem>
          <SelectItem key="dt">Đồng hồ điện tử</SelectItem>
        </Select>
        <CustomInput label="Chỉ số đồng hồ" type="number" defaultValue="0" />

        {/* Hàng 6*/}
        <CustomInput label="Định mức" type="number" defaultValue="0" />
        <Select label="Kích cỡ" variant="bordered" defaultSelectedKeys={["dn15"]}>
          <SelectItem key="dn15">DN15</SelectItem>
          <SelectItem key="dn20">DN20</SelectItem>
          <SelectItem key="dn25">DN25</SelectItem>
        </Select>
        <div className="flex items-center h-full pt-4">
          <Checkbox size="sm" color="primary">Khách hàng lớn</Checkbox>
        </div>
      </div>
    </div>
  );
};