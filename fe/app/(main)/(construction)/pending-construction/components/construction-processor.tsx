"use client";
import CustomInput from "@/components/ui/custom/CustomInput";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import { Select, SelectItem } from "@heroui/react";

export const ConstructionProcessor = () => {
    return (
        <GenericSearchFilter
            title="Xử lý Đơn Chờ Thi Công"
            icon={<SearchIcon size={18} />}
            gridClassName="block space-y-8"
            isCollapsible={false}
        //   actions={
        //     <div className="flex justify-end gap-3">
        //       <CustomButton
        //         color="success"
        //         className="w-[120px] h-9 text-white"
        //         startContent={<SaveIcon size={16} />}
        //       >
        //         Duyệt đơn
        //       </CustomButton>

        //       <CustomButton
        //         color="danger"
        //         className="w-[120px] h-9 text-white"
        //         startContent={<XMarkIcon size={16} />}
        //       >
        //         Từ chối
        //       </CustomButton>
        //     </div>
        //   }
        >
            {/* 1. Bộ lọc tìm kiếm */}
            <section className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Bộ lọc tìm kiếm</h3>
                <div className="flex items-end gap-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <CustomInput label="Từ khóa" placeholder="Nhập từ khóa tìm kiếm" endContent={<SearchIcon size={18} />} />
                        <CustomInput label="Từ ngày" type="date" />
                        <CustomInput label="Đến ngày" type="date" />
                    </div>
                    {/* <CustomButton color="primary" className="w-[100px] h-[58px] rounded-xl flex-shrink-0">Tìm</CustomButton> */}
                </div>
            </section>

            {/* 2. Form xử lý duyệt đơn */}
            <section className="space-y-4">
                <h3 className="text-base font-bold text-gray-800 dark:text-white">Thông tin duyệt đơn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput label="Ngày duyệt đơn" type="date" />
                    <CustomInput label="Nội dung" placeholder="Nhập nội dung" />
                    <Select label="Đội trưởng thi công" variant="bordered">
                        <SelectItem key="1">Chọn đội trưởng...</SelectItem>
                    </Select>
                    <Select label="Đơn vị thi công" variant="bordered">
                        <SelectItem key="1">Chọn đơn vị...</SelectItem>
                    </Select>
                </div>
            </section>
        </GenericSearchFilter>
    );
};