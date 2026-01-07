"use client";

import React from "react";
import { Checkbox, Textarea } from "@heroui/react";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { RefreshIcon, SaveIcon, SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomButton from "@/app/(auth)/login/components/custom-button";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { TitleDarkColor } from "@/config/chip-and-icon";

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
      <section className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
        >
          A. THÔNG TIN ĐỊNH DANH
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SearchInputWithButton label="Mã đơn" />
          <CustomInput label="Tên khách hàng" />
          <CustomInput label="Người đại diện" />
          <CustomInput label="Chức vụ" />
        </div>
      </section>

      <section className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
        >
          B. ĐỊA CHỈ LẮP ĐẶT
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số nhà" />
          <SearchInputWithButton label="Đường phố" />
          {[
            {
              label: "Thôn / Làng",
              options: [
                {
                  label: "Chọn thôn/làng",
                  value: "tl1",
                },
              ],
            },
            {
              label: "Tổ / Khu / Xóm",
              options: [
                {
                  label: "Chọn tổ/khu/xóm",
                  value: "t1",
                },
              ],
            },
            {
              label: "Phường/Xã",
              options: [
                {
                  label: "Chọn phường/xã",
                  value: "p1",
                },
              ],
            },
          ].map((item, idx) => (
            <CustomSelect key={idx} label={item.label} options={item.options} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
        >
          C. THÔNG TIN CÁ NHÂN / PHÁP LÝ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số CMND / CCCD" />
          <CustomDatePicker label="Ngày cấp" />
          {[
            { label: "Nơi cấp" },
            { label: "Điện thoại" },
            { label: "Mã hộ khẩu" },
            { label: "Mã số thuế" },
            { label: "Số hộ", type: "number", defaultValue: "1" },
            { label: "Số nhân khẩu", type: "number", defaultValue: "1" },
          ].map((item, idx) => (
            <CustomInput
              key={idx}
              label={item.label}
              {...(item.type ? { type: item.type } : {})}
              {...(item.defaultValue ? { type: item.defaultValue } : {})}
            />
          ))}
          <CustomSelect
            label="Mục đích sử dụng"
            defaultSelectedKeys={["sh"]}
            options={[
              {
                label: "SH - Sinh hoạt",
                value: "sh",
              },
            ]}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h3
          className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
        >
          D. THÔNG TIN THANH TOÁN & HỢP ĐỒNG
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CustomInput label="Số hợp đồng" />
          {[
            {
              label: "Loại hợp đồng",
              options: [
                {
                  label: "Gia đình",
                  value: "gd",
                },
              ],
              defaultSelectedKeys: ["gd"],
            },
            {
              label: "Mã nguồn",
              options: [
                {
                  label: "Nhập mã nguồn",
                  value: "n1",
                },
              ],
            },
            {
              label: "Hạng mục",
              options: [
                {
                  label: "Gia đình",
                  value: "h1",
                },
              ],
            },
          ].map((item, idx) => (
            <CustomSelect
              key={idx}
              label={item.label}
              {...(item.defaultSelectedKeys
                ? { defaultSelectedKeys: item.defaultSelectedKeys }
                : {})}
              options={item.options}
            />
          ))}
          <CustomInput label="Người ký hợp đồng" />
          <CustomInput label="Chức vụ" />
          <CustomSelect
            label="Hình thức thanh toán"
            defaultSelectedKeys={["tn"]}
            options={[
              {
                label: "Thu tại nhà",
                value: "tn",
              },
            ]}
          />
          <CustomInput label="Số tài khoản" />
          <CustomSelect
            label="Ngân hàng"
            options={[
              {
                label: "Vietcombank",
                value: "vcb",
              },
            ]}
          />

          <CustomDatePicker label="Ngày làm hợp đồng" />
          <CustomDatePicker label="Ngày giao thi công" />

          <CustomSelect
            label="Chi nhánh"
            defaultSelectedKeys={["nd"]}
            options={[
              {
                label: "TP Nam Định",
                value: "nd",
              },
            ]}
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-4 pb-2 mb-4">
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${TitleDarkColor}`}
          >
            E. PHẦN MỞ RỘNG - XUẤT HÓA ĐƠN
          </h3>
          <Checkbox size="sm">Đổi thông tin xuất hóa đơn</Checkbox>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CustomInput label="Tên xuất hóa đơn" />
          <CustomInput label="Địa chỉ xuất hóa đơn" />
          <div className="md:col-span-2">
            <Textarea label="Nội dung" variant="bordered" />
          </div>
        </div>
      </section>
    </GenericSearchFilter>
  );
};
