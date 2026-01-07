"use client";

import React, { useState } from "react";
import { Link, Select, SelectItem } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { SurveyAssignmentItem } from "@/types";
import {TitleDarkColor} from "@/config/chip-and-icon";

interface Props {
  data: SurveyAssignmentItem[];
}

const surveyors = [
  { id: "1", name: "Nguyễn Văn A" },
  { id: "2", name: "Trần Thị B" },
  { id: "3", name: "Lê Văn C" },
  { id: "4", name: "Phạm Thị D" },
  { id: "5", name: "Hoàng Văn E" },
];

export const SurveyAssignmentTable = ({ data }: Props) => {
  const [selectedSurveyors, setSelectedSurveyors] = useState<
    Record<number, string>
  >({});

  const handleSurveyorChange = (orderId: number, surveyorId: string) => {
    setSelectedSurveyors((prev) => ({
      ...prev,
      [orderId]: surveyorId,
    }));
  };

  const columns = [
    { key: "stt", label: "STT", width: "60px" },
    { key: "code", label: "Mã đơn" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "phone", label: "Điện thoại" },
    { key: "address", label: "Địa chỉ lắp đặt", width: "250px" },
    { key: "registrationDate", label: "Ngày đăng ký" },
    { key: "surveyDate", label: "Ngày hẹn khảo sát" },
    { key: "surveyor", label: "Nhân viên khảo sát" },
  ];

  const renderCell = (item: SurveyAssignmentItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return data.indexOf(item) + 1;

      case "code":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href={`/survey/${item.id}`}
          >
            {item.code}
          </Link>
        );

      case "surveyor":
        return (
          <Select
            className="max-w-[180px]"
            placeholder="Chọn nhân viên"
            selectedKeys={
              selectedSurveyors[item.id] ? [selectedSurveyors[item.id]] : []
            }
            size="sm"
            onChange={(e) => handleSurveyorChange(item.id, e.target.value)}
          >
            {surveyors.map((surveyor) => (
              <SelectItem key={surveyor.id}>{surveyor.name}</SelectItem>
            ))}
          </Select>
        );

      default:
        return (item as any)[columnKey] || "-";
    }
  };

  return (
    <GenericDataTable
      columns={columns}
      data={data}
      hideHeader={true}
      isCollapsible={false}
      paginationProps={{
        total: data.length,
        initialPage: 1,
        summary: `1-${data.length} của ${data.length}`,
      }}
      renderCellAction={renderCell}
      title=""
    />
  );
};
