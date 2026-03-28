"use client";

import { useState, useCallback } from "react";
import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/outline";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Tooltip,
} from "@heroui/react";

import { SearchInputWithButton } from "../ui/SearchInputWithButton";
import { exportToCSV, exportToHTML, exportToJSON, printData } from "@/lib/exportUtils";

interface SearchToolbarProps {
  onSearch?: (query: string) => void;
  data?: any[];
  columns?: Array<{ key: string; label: string }>;
  reportTitle?: string;
}

export const SearchToolbar = ({
  onSearch,
  data = [],
  columns = [],
  reportTitle = "Báo cáo",
}: SearchToolbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onSearch?.(value);
    },
    [onSearch]
  );

  const handleExportCSV = () => {
    exportToCSV(data, columns, reportTitle);
  };

  const handleExportHTML = () => {
    exportToHTML(data, columns, reportTitle);
  };

  const handleExportJSON = () => {
    exportToJSON(data, columns, reportTitle);
  };

  const handlePrint = () => {
    printData(data, columns, reportTitle);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-1">
      <div className="relative flex-1 w-full md:max-w-xs">
        <SearchInputWithButton
          label="Nhập từ khóa tìm kiếm"
          type="text"
          value={searchQuery}
          onChange={(e: any) => handleSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              className="h-10 w-10 min-w-0 font-bold"
              color="success"
              variant="flat"
            >
              <Tooltip color="success" content="Xuất file">
                <ArrowDownTrayIcon className="h-5 w-5" />
              </Tooltip>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Export actions">
            <DropdownItem
              key="excel"
              startContent={
                <span className="text-green-600 font-bold w-8">XLS</span>
              }
              onPress={handleExportCSV}
            >
              Xuất Excel (CSV)
            </DropdownItem>
            <DropdownItem
              key="html"
              startContent={
                <span className="text-orange-600 font-bold w-8">HTML</span>
              }
              onPress={handleExportHTML}
            >
              Xuất HTML
            </DropdownItem>
            <DropdownItem
              key="json"
              startContent={
                <span className="text-blue-600 font-bold w-8">JSON</span>
              }
              onPress={handleExportJSON}
            >
              Xuất JSON
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Tooltip color="secondary" content="In danh sách này">
          <Button
            isIconOnly
            className="h-10 w-10 min-w-0 font-bold"
            color="secondary"
            variant="flat"
            onPress={handlePrint}
          >
            <PrinterIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
