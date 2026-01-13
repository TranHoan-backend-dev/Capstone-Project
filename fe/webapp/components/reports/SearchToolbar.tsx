"use client";

import { useState } from "react";
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

export const SearchToolbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 px-1">
      <div className="relative flex-1 w-full md:max-w-xs">
        <SearchInputWithButton
          label="Nhập từ khóa tìm kiếm"
          type="text"
          value={searchQuery}
          onChange={(e: any) => setSearchQuery(e.target.value)}
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
            >
              Xuất Excel
            </DropdownItem>
            <DropdownItem
              key="pdf"
              startContent={
                <span className="text-red-600 font-bold w-8">PDF</span>
              }
            >
              Xuất PDF
            </DropdownItem>
            <DropdownItem
              key="word"
              startContent={
                <span className="text-blue-600 font-bold w-8">DOC</span>
              }
            >
              Xuất Word
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Tooltip color="secondary" content="In danh sách này">
          <Button
            isIconOnly
            className="h-10 w-10 min-w-0 font-bold"
            color="secondary"
            variant="flat"
          >
            <PrinterIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};
