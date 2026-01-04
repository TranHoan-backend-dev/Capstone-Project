"use client";

import React from "react";
import { Input } from "@heroui/react";

import CustomModal from "@/components/ui/modal/CustomModalWithTable";

interface PriceApplicationModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const PriceApplicationModal = ({
  isOpen,
  onOpenChange,
}: PriceApplicationModalProps) => {
  // Mock data based on the user image
  const data = [
    {
      id: 1,
      description: "Sinh hoạt mức 1",
      price: "SH",
      level: "1",
      quota: "10",
    },
    {
      id: 2,
      description: "Sinh hoạt mức 2",
      price: "SH",
      level: "2",
      quota: "10",
    },
    {
      id: 3,
      description: "Sinh hoạt mức 3",
      price: "SH",
      level: "3",
      quota: "10",
    },
    {
      id: 4,
      description: "Sinh hoạt mức 4",
      price: "SH",
      level: "4",
      quota: "999999",
    },
  ];

  return (
    <CustomModal
      data={data.map((item) => ({
        elements: [
          <span className="text-center block">{item.id}</span>,
          ...[item.description, item.price, item.level, item.quota].map(
            (val) => (
              <Input isReadOnly defaultValue={val} size="sm" variant="flat" />
            ),
          ),
        ],
      }))}
      isHavingSearchField={false}
      isOpen={isOpen}
      isPagination={false}
      tableColumns={["STT", "Mô tả", "Giá", "Mức", "Định mức"]}
      onOpenChange={onOpenChange}
    />
  );
};
