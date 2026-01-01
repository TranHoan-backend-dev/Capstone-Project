"use client";

import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/solid";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Tooltip } from "@heroui/react";

export const ModalActions = () => {
  return (
    <div className="flex gap-3">
      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
        <Dropdown>
          <DropdownTrigger>
            <Button
              isIconOnly
              color="success"
              variant="flat"
              className="h-10 w-10 min-w-0 font-bold"
            >
              <Tooltip content="Xuất file" color="success">
                <ArrowDownTrayIcon className="h-5 w-5" />
              </Tooltip>
            </Button>
          </DropdownTrigger>
          <DropdownMenu aria-label="Export actions">
            <DropdownItem key="excel" startContent={<span className="text-green-600 font-bold w-8">XLS</span>}>
              Xuất Excel
            </DropdownItem>
            <DropdownItem key="pdf" startContent={<span className="text-red-600 font-bold w-8">PDF</span>}>
              Xuất PDF
            </DropdownItem>
            <DropdownItem key="word" startContent={<span className="text-blue-600 font-bold w-8">DOC</span>}>
              Xuất Word
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Tooltip content="In danh sách này" color="secondary">
          <Button
            isIconOnly
            color="secondary"
            variant="flat"
            className="h-10 w-10 min-w-0 font-bold"
          >
            <PrinterIcon className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>
    </div>
  );
};