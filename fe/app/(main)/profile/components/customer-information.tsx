"use client";

import { Card, CardBody, Chip } from "@heroui/react";
import React from "react";

import { DarkGreenChip, PencilIcon } from "@/config/chip-and-icon";
import CustomButton from "@/components/ui/custom/CustomButton";

const CustomerInformation = () => {
  const customerDetails = [
    {
      label: "Tên khách hàng",
      value: "Nguyễn Thị Minh Hạnh",
      className: "text-lg font-bold text-gray-800 dark:text-zinc-200",
    },
    {
      label: "Địa chỉ",
      value: "123 Đường Lê Lợi, Phường 1, Quận 1, TP. HCM",
      className: "text-gray-600 dark:text-zinc-400 leading-relaxed font-medium",
    },
    {
      label: "Mã khách hàng",
      value: "KH-2024-001234",
      className:
        "text-lg font-bold text-gray-800 dark:text-zinc-200 tracking-tight",
    },
  ];

  return (
    <Card
      shadow="sm"
      className="border-none rounded-2xl overflow-hidden bg-white dark:bg-zinc-900"
    >
      <CardBody className="p-8">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="space-y-6 flex-1">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Thông Tin Khách Hàng
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              {customerDetails.map((detail, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    {detail.label}
                  </p>
                  <p className={detail.className}>{detail.value}</p>
                </div>
              ))}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                  Trạng thái
                </p>
                <Chip
                  className={`font-bold border-none px-2 ${DarkGreenChip}`}
                  color="success"
                  size="sm"
                  startContent={
                    <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-white mr-1" />
                  }
                  variant="flat"
                >
                  Đang hoạt động
                </Chip>
              </div>
            </div>
          </div>

          <div className="flex flex-row md:flex-col gap-3 shrink-0">
            <CustomButton
              className="bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 font-bold px-6 h-11 rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 border-none"
              startContent={<PencilIcon className="w-4 h-4" />}
            >
              Chỉnh sửa
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomerInformation;
