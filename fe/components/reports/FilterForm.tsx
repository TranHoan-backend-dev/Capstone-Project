"use client";

import React, { useState } from "react";
import { Select, SelectItem, Button, DateValue } from "@heroui/react";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid";
import { SingleDatePicker } from "./component/SingleDatePicker";
import { DateRangePicker } from "./component/DateRangePicker";

interface FilterFormProps {
  title: string;
  onFilterChange?: (filters: FilterValues) => void;
  onSubmit?: (filters: FilterValues) => void;
}

export interface FilterValues {
  branch: string;
  createDate: DateValue | null;
  fromDate: DateValue | null;
  toDate: DateValue | null;
}

export const FilterForm = ({
  title,
  onFilterChange,
  onSubmit,
}: FilterFormProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    branch: "",
    createDate: null,
    fromDate: null,
    toDate: null,
  });

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSubmit = () => {
    onSubmit?.(filters);
  };

  return (
    <div className="rounded-lg bg-white p-4 md:p-6 shadow-sm">
      <h1 className="mb-4 md:mb-6 text-lg md:text-xl font-semibold">{title}</h1>
      <div className="grid gap-4 md:gap-6 md:grid-cols-2">
        <div className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <Select
              label="Chi nhánh"
              labelPlacement="outside"
              size="sm"
              placeholder="Chọn thành phố"
              className="w-full md:w-[500px] text-sm rounded-md border border-gray-300"
              selectedKeys={filters.branch ? [filters.branch] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleFilterChange("branch", selected);
              }}
            >
              <SelectItem key="nam-dinh" textValue="Thành phố Nam Định">Thành phố Nam Định</SelectItem>
            </Select>
          </div>
          <SingleDatePicker
            value={filters.createDate}
            onChange={(value) => handleFilterChange("createDate", value)}
            label="Ngày lập"
          />
        </div>
        <div className="grid gap-4 md:gap-6 md:grid-cols-[1fr_auto]">
          <div className="flex justify-end">
            <div className="w-full md:w-auto">
              <DateRangePicker
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                onFromDateChange={(value) =>
                  handleFilterChange("fromDate", value)
                }
                onToDateChange={(value) => handleFilterChange("toDate", value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          <DocumentChartBarIcon className="mr-2 h-4 w-4" />
          Báo cáo
        </Button>
      </div>
    </div>
  );
};