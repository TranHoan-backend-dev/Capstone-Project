"use client";

import {
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import React from "react";

import { CustomPagination } from "../custom/CustomPagination";

import BaseModal, { BaseModalProps } from "./BaseModal";

export interface CellElements {
  elements: string[];
}

interface ModalProps extends Omit<BaseModalProps, "children"> {
  isHavingSearchField?: boolean;
  tableColumns: string[];
  data: any[];
  topContent?: React.ReactNode;
  isPagination?: boolean; // đổi lại khi có pagination, đổi thành số bản ghi
}

const CustomModalWithTable = ({
  isOpen,
  onOpenChange,
  isHavingSearchField,
  title,
  topContent,
  tableColumns,
  data,
  size = "3xl",
  isPagination,
  className,
}: ModalProps) => {
  return (
    <BaseModal
      className={className}
      isOpen={isOpen}
      size={size}
      title={title || "Chọn từ danh sách lộ trình"}
      onOpenChange={onOpenChange}
    >
      {topContent && <div className="mb-4">{topContent}</div>}

      {isHavingSearchField ?? (
        <div className="flex items-center gap-4 mb-4 justify-center">
          <Input
            className="max-w-[400px]"
            classNames={{
              inputWrapper:
                "h-8 border-[#ccc] dark:border-divider min-h-unit-8",
            }}
            placeholder="Tìm kiếm"
            radius="sm"
            size="sm"
            variant="bordered"
          />
        </div>
      )}

      <div className="overflow-hidden">
        <Table
          removeWrapper
          aria-label="Route list table"
          classNames={{
            th: "bg-[#eef2f8] dark:bg-default-100 text-[#555] dark:text-default-600 font-bold text-[13px] h-9 py-0",
            td: "py-2 text-[13px] group-hover:bg-[#f5f8ff] dark:group-hover:bg-default-50/50 cursor-pointer",
            tr: "hover:bg-[#f5f8ff] dark:hover:bg-default-50 transition-colors",
          }}
        >
          <TableHeader>
            {tableColumns.map((col, idx) => (
              <TableColumn key={idx}>{col}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((items, idx) => (
              <TableRow key={idx}>
                {items &&
                  (Array.isArray(items) ? items : (items as any).elements)?.map(
                    (item: any, cellIdx: number) => (
                      <TableCell key={cellIdx}>{item}</TableCell>
                    ),
                  )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isPagination && (
        <div className="mt-4">
          <CustomPagination initialPage={1} summary="1-10 của 481" total={49} />
        </div>
      )}
    </BaseModal>
  );
};

export default CustomModalWithTable;
