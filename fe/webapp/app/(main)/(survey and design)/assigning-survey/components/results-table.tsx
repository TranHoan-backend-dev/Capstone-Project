"use client";

import React, { useState } from "react";
import { Link } from "@heroui/react";
import NextLink from "next/link";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { NewInstallationFormResponse, SurveyAssignmentItem } from "@/types";
import { TitleDarkColor } from "@/config/chip-and-icon";
import { formatDate1 } from "@/utils/format";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { SURVEY_ASSIGNMENT_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";

interface Props {
  data: SurveyAssignmentItem[];
  page: number;
  totalItem: number;
  totalPage: number;
  onPageChange: (page: number) => void;
  keyword: string;
  reloadKey: number;
  setReloadKey: React.Dispatch<React.SetStateAction<number>>;
}

export const SurveyAssignmentTable = ({
  data,
  keyword,
  page,
  totalItem,
  totalPage,
  onPageChange,
  reloadKey,
  setReloadKey,
}: Props) => {
  const [selectedSurveyors, setSelectedSurveyors] = useState<
    Record<string, { id: string; name: string }>
  >({});
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [currentRow, setCurrentRow] = useState<string | null>(null);
  const pageSize = 10;

  const handleOpenModal = (rowId: string) => {
    setCurrentRow(rowId);
    setShowEmployeeModal(true);
  };

  const handleAssign = async (
    item: SurveyAssignmentItem,
    employeeId: string,
    employeeName: string,
  ) => {
    try {
      const res = await fetch(
        `/api/construction/installation-forms/assign/${employeeId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formCode: item.id,
            formNumber: item.formNumber,
          }),
        },
      );

      if (!res.ok) {
        let message = "Lỗi khi phân công";
        try {
          const json = await res.json();
          message = json?.message || message;
        } catch {
          const text = await res.text();
          if (text) message = text;
        }

        CallToast({
          title: "Lỗi",
          message,
          color: "danger",
        });
        return;
      }

      setSelectedSurveyors((prev) => ({
        ...prev,
        [item.id]: {
          id: employeeId,
          name: employeeName,
        },
      }));

      setReloadKey((prev) => prev + 1);
    } catch (err: any) {
      console.error(err);
      CallToast({
        title: "Lỗi",
        message: err.message || "Lỗi khi phân công",
        color: "danger",
      });
    }
  };

  const renderCell = (item: SurveyAssignmentItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return item.stt;

      case "formNumber":
        return (
          <Link
            as={NextLink}
            className={`font-bold text-blue-600 hover:underline hover:text-blue-800 ${TitleDarkColor}`}
            href={`/survey/${item.id}`}
          >
            {item.formNumber}
          </Link>
        );

      case "surveyor":
        const selected = selectedSurveyors[item.id];
        let displayName = selected?.name ?? item.handoverByFullName ?? "";
        if (!displayName || displayName === "false") {
          displayName = "Chưa phân công";
        }

        return (
          <SearchInputWithButton
            label=""
            value={displayName}
            onSearch={() => handleOpenModal(item.id)}
            onChange={() => {
              setSelectedSurveyors((prev) => {
                const clone = { ...prev };
                delete clone[item.id];
                return clone;
              });
            }}
          />
        );

      default:
        return (item as any)[columnKey] || "-";
    }
  };

  return (
    <>
      <GenericDataTable
        title="Danh sách đơn"
        columns={SURVEY_ASSIGNMENT_COLUMN}
        data={data}
        hideHeader={true}
        isCollapsible={false}
        headerSummary={`${data.length}`}
        paginationProps={{
          total: totalPage,
          page: page,
          onChange: onPageChange,
          summary: `${totalItem}`,
        }}
        renderCellAction={renderCell}
      />
      <LookupModal
        enableSearch={false}
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        title="Chọn nhân viên khảo sát"
        api="/api/auth/employees/survey-staff"
        columns={[
          { key: "stt", label: "STT" },
          { key: "fullName", label: "Tên nhân viên" },
        ]}
        mapData={(item, index) => ({
          stt: index + 1,
          id: item.id,
          fullName: item.fullName,
        })}
        onSelect={(employee) => {
          if (!currentRow) return;
          const currentItem = data.find((d) => d.id === currentRow);
          if (!currentItem) return;
          handleAssign(currentItem, employee.id, employee.fullName);
          setShowEmployeeModal(false);
        }}
      />
    </>
  );
};
