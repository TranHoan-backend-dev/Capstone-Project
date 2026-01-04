"use client";

import React from "react";

import CustomModal from "@/components/ui/modal/CustomModalWithTable";

interface RouteListModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const RouteListModal = ({
  isOpen,
  onOpenChange,
}: RouteListModalProps) => {
  const data = [
    {
      id: "01C059",
      code: "01C059",
      name: "108-111-112e",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C060",
      code: "01C060",
      name: "108-111-112f",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C061",
      code: "01C061",
      name: "108-111-112g",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C080",
      code: "01C080",
      name: "06Va",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C081",
      code: "01C081",
      name: "06Vb",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C082",
      code: "01C082",
      name: "29Va",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C083",
      code: "01C083",
      name: "29Vb",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C084",
      code: "01C084",
      name: "29Vc",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C085",
      code: "01C085",
      name: "31Va",
      branch: "Thành phố Nam Định",
    },
    {
      id: "01C086",
      code: "01C086",
      name: "31Vb",
      branch: "Thành phố Nam Định",
    },
  ];

  return (
    <CustomModal
      data={data.map((item) => ({
        elements: [
          <span className="font-bold text-blue-700 dark:text-primary">
            {item.code}
          </span>,
          <span className="text-foreground">{item.name}</span>,
          <span className="text-default-600">{item.branch}</span>,
        ],
      }))}
      isOpen={isOpen}
      isPagination={true}
      tableColumns={["Mã ĐP", "Tên sổ ghi", "Chi nhánh"]}
      onOpenChange={onOpenChange}
    />
  );
};
