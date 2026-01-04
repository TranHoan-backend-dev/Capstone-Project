"use client"

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Card, CardBody, Button, CardHeader } from "@heroui/react";
import {
    ArrowLeftIcon,
    ArrowDownTrayIcon,
    UserCircleIcon,
    DocumentArrowUpIcon,
    InformationCircleIcon,
    DocumentIcon
} from "@heroicons/react/24/outline";
import { DarkYellowChip, TitleDarkColor } from "@/config/chip-and-icon";

const CustomerProfile = () => {
    const params = useParams();
    const router = useRouter();
    const { id } = params;

    const customer = {
        name: "Nguyễn Song Hoàn",
        address: "2f9b TTĐ, Hoàng Diệu, , , Phường Nam Định,",
    };

    const customerInfomationStyle = "text-sm font-semibold text-gray-800 dark:text-gray-100"
    const darkButtonBackground = "bg-gradient-to-r dark:from-yellow-900/40 dark:to-yellow-800/20"

    return (
        <div className="space-y-6 pt-2 pb-8">
            <CustomBreadcrumb
                items={[
                    { label: "Trang chủ", href: "/home" },
                    { label: "Tra cứu khách hàng", href: "/customers" },
                    { label: "Hồ sơ khách hàng", isCurrent: true },
                ]}
            />

            <div className="grid gap-6 w-full">
                <Card className="w-full shadow-md border border-divider dark:border-gray-800 bg-background">
                    <CardHeader className={`flex gap-3 px-6 py-4 bg-gradient-to-r from-blue-100 to-blue-50 dark:from-yellow-900/40 dark:to-yellow-800/20 text-blue-700 ${TitleDarkColor} rounded-t-lg`}>
                        <div className="p-2 bg-blue-200/50 rounded-full">
                            <UserCircleIcon className="w-6 h-6 text-blue-600 dark:text-white" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-md font-bold uppercase tracking-wide">Thông tin hồ sơ</p>
                            <p className="text-small text-blue-600/80 dark:text-yellow-300/80">Chi tiết thông tin khách hàng</p>
                        </div>
                    </CardHeader>
                    <CardBody className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-default-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Tên khách hàng</span>
                                <span className={customerInfomationStyle}>{customer.name}</span>
                            </div>
                            <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-default-50 rounded-lg border border-transparent hover:border-blue-200 transition-colors">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-wider">Địa chỉ</span>
                                <span className={`${customerInfomationStyle} break-words`}>{customer.address}</span>
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                startContent={<ArrowLeftIcon className="w-4 h-4" />}
                                onPress={() => router.back()}
                                className={`${DarkYellowChip} font-bold`}
                            >
                                Quay lại danh sách
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="w-full shadow-md border border-divider dark:border-gray-800">
                    <CardHeader className="flex gap-3 px-6 py-4 border-b border-divider">
                        <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                            <DocumentArrowUpIcon className="w-5 h-5" />
                        </div>
                        <span className="text-base font-bold text-gray-800 dark:text-gray-100">Tải lên tài liệu</span>
                    </CardHeader>
                    <CardBody className="p-6">
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50 dark:bg-default-50/20 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                            <input
                                type="file"
                                id="file-upload"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className="p-4 bg-blue-50 text-blue-500 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <ArrowDownTrayIcon className="w-8 h-8 rotate-180" />
                            </div>
                            <div className="text-center z-10">
                                <span className="text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-yellow-100">Chọn tệp tin</span>
                                <span className="text-sm text-gray-500"> hoặc kéo thả vào đây</span>
                                <p className="text-xs text-gray-400 mt-1">Hỗ trợ PDF, PNG, JPG (Tối đa 5MB)</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg border border-blue-100 dark:border-blue-800/30">
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-gray-500 italic flex items-center gap-2">
                                    <InformationCircleIcon className="w-4 h-4" />
                                    Chưa có tệp nào được chọn
                                </span>
                            </div>
                            <Button
                                size="sm"
                                color="primary"
                                className={`${DarkYellowChip} font-bold shadow-sm`}
                                startContent={<ArrowDownTrayIcon className="w-4 h-4" />}
                            >
                                Lưu tài liệu
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                <Card className="w-full shadow-sm border border-divider dark:border-gray-800">
                    <CardHeader className="flex gap-3 px-6 py-3 border-b border-divider bg-gray-50/50 dark:bg-default-100/50">
                        <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase">Danh sách tài liệu</span>
                    </CardHeader>
                    <CardBody className="p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3">
                            <DocumentIcon className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Chưa có dữ liệu</p>
                        <p className="text-xs text-gray-400 mt-1">Vui lòng tải lên tài liệu mới để xem tại đây</p>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default CustomerProfile;
