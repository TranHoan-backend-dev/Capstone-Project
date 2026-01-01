"use client";

import React, { useEffect, useState } from "react";
import { Button, Input, Tooltip } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import CustomInput from "@/components/ui/CustomInput";
import {
    DocumentChartBarIcon,
    CheckCircleIcon
} from "@heroicons/react/24/outline";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { DeleteIcon } from "@/config/chip-and-icon";

export const MaterialCostCard = () => {
    const materials = [
        {
            id: "1",
            index: 1,
            code: "ONG80-20",
            description: "Ống nhựa HDPE",
            note: "",
            unit: "Mét",
            reductionFactor: 1,
            quantity: 3,
            materialPrice: 7600,
            laborPrice: 4189,
            materialTotal: 22800,
            laborTotal: 12567,
        },
        {
            id: "2",
            index: 2,
            code: "ONG80-20",
            description: "Ống nhựa HDPE",
            note: "",
            unit: "Mét",
            reductionFactor: 1,
            quantity: 3,
            materialPrice: 7600,
            laborPrice: 4189,
            materialTotal: 22800,
            laborTotal: 12567,
        }
    ];

    const columns = [
        { key: "index", label: "#", width: "50px" },
        { key: "code", label: "Mã vật tư" },
        { key: "description", label: "Nội dung công việc" },
        { key: "note", label: "Công thức/Ghi chú" },
        { key: "unit", label: "ĐVT" },
        { key: "reductionFactor", label: "Hệ số giảm", align: "center" as const },
        { key: "quantity", label: "Khối lượng", align: "center" as const },
        { key: "materialPrice", label: "Giá vật tư", align: "end" as const },
        { key: "laborPrice", label: "Giá nhân công", align: "end" as const },
        { key: "materialTotal", label: "Tiền vật tư", align: "end" as const },
        { key: "laborTotal", label: "Tiền nhân công", align: "end" as const },
        { key: "actions", label: "Hoạt động", align: "center" as const },
    ];

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const renderCell = (item: any, columnKey: string) => {
        switch (columnKey) {
            case "note":
                return <Input variant="bordered" size="sm" radius="sm" className="min-w-[100px]" />;
            case "reductionFactor":
                return <Input variant="bordered" size="sm" radius="sm" defaultValue={item.reductionFactor.toString()} className="w-16 mx-auto text-center" />;
            case "quantity":
                return <Input variant="bordered" size="sm" radius="sm" defaultValue={item.quantity.toString()} className="w-16 mx-auto text-center" />;
            case "materialPrice":
            case "laborPrice":
            case "materialTotal":
            case "laborTotal":
                if (!isMounted) return item[columnKey];
                return (item[columnKey] as number).toLocaleString("vi-VN");
            case "actions":
                return (
                    <Tooltip content="Xóa" color="danger" closeDelay={0}>
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-danger hover:bg-danger-50 dark:hover:bg-danger-900/10"
                        >
                            <DeleteIcon className="w-5 h-5" />
                        </Button>
                    </Tooltip>
                );
            default:
                return item[columnKey];
        }
    };

    return (
        <div className="space-y-4">
            <GenericDataTable
                title="Chi phí vật tư khách hàng thanh toán"
                columns={columns}
                data={materials}
                renderCell={renderCell}
                topContent={
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <SearchInputWithButton label="Mã vật tư" />
                        <CustomInput label="Khối lượng" />
                    </div>
                }
                tableProps={{
                    className: "pt-0"
                }}
            />

            <div className="flex flex-wrap gap-3 p-4">
                <Button color="success" className="text-white font-bold ml-auto shadow-md shadow-success/20" startContent={<CheckCircleIcon className="w-4 h-4" />}>
                    Hoàn tất dự toán
                </Button>
                <Button color="primary" className="font-bold shadow-md shadow-primary/20" startContent={<DocumentChartBarIcon className="w-4 h-4" />}>
                    Báo cáo
                </Button>
            </div>
        </div>
    );
};
