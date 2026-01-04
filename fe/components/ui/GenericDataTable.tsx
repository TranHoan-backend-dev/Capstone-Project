"use client";

import React from "react";
import {
  Card,
  CardBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  TableProps,
  Spinner,
} from "@heroui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

import { CustomPagination } from "./custom/CustomPagination";

interface Column {
  key: string;
  label: string | React.ReactNode;
  align?: "start" | "center" | "end";
  width?: string;
}

interface GenericDataTableProps<T> {
  title: string;
  icon?: React.ReactNode;
  columns: Column[];
  data: T[];
  renderCell: (item: T, columnKey: string) => React.ReactNode;
  paginationProps?: {
    total: number;
    initialPage: number;
    onChange?: (page: number) => void;
    summary?: string;
  };
  tableProps?: Partial<TableProps>;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
  headerSummary?: string;
  actions?: React.ReactNode;
  topContent?: React.ReactNode;
  hideHeader?: boolean;
}

export const GenericDataTable = <T extends { id: string | number }>({
  title,
  icon,
  columns,
  data,
  renderCell,
  paginationProps,
  tableProps,
  isCollapsible = false,
  defaultOpen = true,
  headerSummary,
  actions,
  topContent,
}: GenericDataTableProps<T>) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card
      className="overflow-hidden bg-content1 transition-all duration-300"
      shadow="sm"
    >
      <CardBody className="p-0">
        <div
          className={`border-b border-divider transition-colors ${isCollapsible ? "hover:bg-default-100" : ""}`}
        >
          {title && (
            <div
              className={`p-6 flex justify-between items-center ${isCollapsible ? "cursor-pointer select-none" : ""}`}
              role={isCollapsible ? "button" : undefined}
              onClick={() => isCollapsible && setIsOpen(!isOpen)}
            >
              <>
                <div className="flex items-center gap-3">
                  <div className="text-primary">{icon}</div>
                  <h2 className="text-lg font-bold text-foreground">{title}</h2>
                </div>
                <div className="flex items-center gap-4">
                  {headerSummary && (
                    <div className="hidden md:block px-3 py-1.5 bg-default-100 rounded-full text-xs font-medium text-default-500 whitespace-nowrap">
                      Tìm thấy {headerSummary} bản ghi
                    </div>
                  )}
                  {actions && <div>{actions}</div>}
                  {isCollapsible && (
                    <div className="text-default-400">
                      <ChevronDownIcon
                        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                      />
                    </div>
                  )}
                </div>
              </>
            </div>
          )}
        </div>

        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "opacity-100 max-h-[5000px] visible" : "opacity-0 max-h-0 invisible"}`}
        >
          {topContent && (
            <div className="p-6 pt-2 border-b border-divider">{topContent}</div>
          )}
          <div className="overflow-x-auto">
            <Table
              removeWrapper
              aria-label={title}
              classNames={{
                th: "bg-default-50 text-default-400 font-bold py-4 px-4 text-[11px] uppercase tracking-widest",
                td: "py-4 px-4 text-sm text-foreground last:border-none",
                ...tableProps?.classNames,
              }}
              {...tableProps}
            >
              <TableHeader>
                {columns.map((column, index) => (
                  <TableColumn
                    key={column.key}
                    align={column.align || "start"}
                    className={`${index === 0 && column.key !== "selection" ? "!pl-8" : ""} bg-default-100 text-foreground`}
                    style={column.width ? { width: column.width } : {}}
                  >
                    {column.label}
                  </TableColumn>
                ))}
              </TableHeader>
              <TableBody
                emptyContent={"Không có dữ liệu để hiển thị."}
                items={data}
                loadingContent={<Spinner label="Loading..." />}
              >
                {(item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-default-50 transition-colors border-divider"
                  >
                    {columns.map((column, index) => (
                      <TableCell
                        key={column.key}
                        className={
                          index === 0 && column.key !== "selection"
                            ? "!pl-8"
                            : ""
                        }
                      >
                        {renderCell(item, column.key)}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {paginationProps && (
            <CustomPagination
              initialPage={paginationProps.initialPage}
              summary={paginationProps.summary}
              total={paginationProps.total}
              onChange={paginationProps.onChange}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
};
