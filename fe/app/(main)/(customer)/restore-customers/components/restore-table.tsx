"use client";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { ArrowPathIcon, TableCellsIcon } from "@heroicons/react/24/outline";
import { Button, Link, Tooltip } from "@heroui/react";
import NextLink from "next/link";

interface RestoreItem {
    id: number;
    customerCode: string;
    customerName: string;
    address: string;
    restoreDate: string;
    period: string;
    reason: string;
}

interface RestoreTableProps {
    data: RestoreItem[];
}

export const RestoreTable = ({ data }: RestoreTableProps) => {
    const columns = [
        { key: "no", label: "STT", width: "60px" },
        { key: "customerCode", label: "Mã KH" },
        { key: "customerName", label: "Tên khách hàng" },
        { key: "address", label: "Địa chỉ" },
        { key: "restoreDate", label: "Ngày Khôi Phục" },
        { key: "period", label: "Kỳ Khôi Phục" },
        { key: "reason", label: "Lý Do Khôi Phục" },
        { key: "action", label: "Hoạt động", align: "center" as const },
    ];

    const renderCell = (item: RestoreItem, columnKey: string) => {
        switch (columnKey) {
            case "no":
                return <span className="font-medium text-black dark:text-white">{data.indexOf(item) + 1}</span>;
            case "customerCode":
                return (
                    <Link as={NextLink} href="#" className="font-bold text-blue-600 hover:underline">
                        {item.customerCode}
                    </Link>
                );
            case "customerName":
                return <span className="font-bold text-gray-900 dark:text-foreground">{item.customerName}</span>;
            case "address":
                return <div className="max-w-[200px] truncate text-gray-600">{item.address}</div>;
            case "restoreDate":
                return <span className="text-gray-400 dark:text-white">{item.restoreDate}</span>;
            case "period":
                return (
                    <span className="font-bold text-blue-600 dark:text-primary-400 bg-blue-50 dark:bg-white px-2 py-0.5 rounded text-[11px] border border-blue-100/50 dark:border-primary-500/30">
                        {item.period}
                    </span>
                );
            case "reason":
                return <div className="text-gray-500 italic max-w-[250px] truncate">{item.reason}</div>;
            case "action":
                return (
                    <div className="flex justify-center items-center">
                        <Tooltip
                            content="Khôi phục"
                            placement="top"
                            delay={0}
                            closeDelay={0}
                            offset={10}
                            classNames={{
                                content: "py-1.5 px-3 shadow-xl text-black bg-white font-medium rounded-lg border border-gray-100",
                            }}
                        >
                            <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                radius="md"
                                className="data-[hover=true]:bg-gray-100 min-w-10 w-10 h-10 transition-colors"
                                onPress={() => console.log("Khôi phục:", item.customerCode)}
                            >
                                <ArrowPathIcon className="w-5 h-5 text-orange-400" />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return (item as any)[columnKey];
        }
    };

    return (
        <GenericDataTable
            title="Danh sách KH khôi phục"
            icon={
                <div className="p-2 bg-blue-50 dark:bg-primary-900/10 rounded-lg text-blue-600 dark:text-primary">
                    <TableCellsIcon className="w-4 h-4" />
                </div>
            }
            columns={columns}
            data={data}
            renderCell={renderCell}
            isCollapsible
            paginationProps={{
                total: 1,
                initialPage: 1,
                summary: `Hiển thị 1-${data.length} của ${data.length} kết quả`,
            }}
            headerSummary={`${data.length}`}
        />
    );
};