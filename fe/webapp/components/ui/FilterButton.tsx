"use client"

import React from "react";
import { FunnelIcon } from "@heroicons/react/24/solid";
import { FilterActionButton } from "./FilterActionButton";

interface FilterButtonProps {
  onPress?: () => void;
}

const FilterButton = ({ onPress }: FilterButtonProps) => {
  return (
    <FilterActionButton
      className="bg-blue-600 hover:bg-blue-700"
      color="primary"
      icon={<FunnelIcon className="w-4 h-4" />}
      label="Lọc"
      onPress={onPress}
    />
  );
};

export default FilterButton;
