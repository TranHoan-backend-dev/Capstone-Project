"use client";

import React from "react";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { FilterActionButton } from "@/components/ui/FilterActionButton";
import { AddNewIcon } from "@/config/chip-and-icon";

type Props = {
  onAddNew: () => void;
};

export const ButtonSection = ({ onAddNew }: Props) => {
  return (
    <div className="flex justify-end">
      <FilterActionButton
        className="bg-green-500 hover:bg-green-600 dark:shadow-md dark:shadow-success/40"
        color="success"
        icon={<AddNewIcon className="w-4 h-4" />}
        label="Thêm mới"
        onPress={onAddNew}
      />
    </div>
  );
};
