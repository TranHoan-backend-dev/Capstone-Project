"use client";

import { ArrowDownTrayIcon, PrinterIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from "@heroui/react";

export const ModalActions = () => {
  return (
    <div className="flex gap-3">
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
            {[
              {
                key: "excel",
                label: "Xuất Excel",
                icon: "XLS",
                color: "green",
              },
              {
                key: "pdf",
                label: "Xuất PDF",
                icon: "PDF",
                color: "red",
              },
              {
                key: "word",
                label: "Xuất Word",
                icon: "DOC",
                color: "blue",
              },
            ].map((item) => (
              <DropdownItem
                key={item.key}
                startContent={
                  <span className={`text-${item.color}-600 font-bold w-8`}>
                    {item.icon}
                  </span>
                }
              >
                {item.label}
              </DropdownItem>
            ))}
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
