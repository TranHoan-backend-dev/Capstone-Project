"use client";
import CustomButton from "@/app/(auth)/login/components/custom-button";
import CustomInput from "@/components/ui/custom/CustomInput";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { CalendarIcon, RefreshIcon, SaveIcon, SearchIcon } from "@/components/ui/Icons";
import { Checkbox, Select, SelectItem } from "@heroui/react";

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
            {/* Nhóm 1: Thông tin khách hàng */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-700">Thông tin khách hàng</h3>
                <CustomInput
                    label="Mã đơn"
                    placeholder="Nhập mã đơn"
                    endContent={<SearchIcon size={18} className="text-blue-500" />}
                    isRequired
                />
                <CustomInput label="Tên khách hàng" placeholder="Nhập tên khách hàng" isRequired />
            </div>

            {/* Nhóm 2: Thông tin địa chỉ */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-700">Thông tin địa chỉ</h3>
                <CustomInput label="Số nhà" placeholder="Nhập số nhà" />
                <CustomInput label="Thôn/Làng" placeholder="Nhập đường phố" />
                <CustomInput label="Đường phố" placeholder="Nhập đường phố" />
                <div className="grid grid-cols-2 gap-2">
                    <Select label="Phường" variant="bordered" size="sm">
                        <SelectItem key="p1">Chọn phường</SelectItem>
                    </Select>
                    <Select label="Tổ / Khu / Xóm" variant="bordered" size="sm">
                        <SelectItem key="t1">Chọn tổ/khu</SelectItem>
                    </Select>
                </div>
            </div>

            {/* Nhóm 3: Thông tin thu tiền */}
            <div className="space-y-4">
                <h3 className="font-bold text-gray-700">Thông tin thu tiền</h3>
                <CustomInput
                    label="Ngày thu"
                    type="date"
                    endContent={<CalendarIcon size={18} />}
                    isRequired
                />
                <CustomInput label="Số phiếu thu" placeholder="Nhập số phiếu thu" />
                <Select label="Hình thức thanh toán" variant="bordered" isRequired>
                    <SelectItem key="ck">Chuyển khoản</SelectItem>
                    <SelectItem key="tm">Tiền mặt</SelectItem>
                </Select>
                <Checkbox size="sm" color="primary">Đã thu tiền</Checkbox>
            </div>
        </GenericSearchFilter>
    );
};