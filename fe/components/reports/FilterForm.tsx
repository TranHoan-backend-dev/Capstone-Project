"use client";

import React, { useState } from "react";
import { Select, SelectItem, Button, DateValue, Input } from "@heroui/react";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid";
import { SingleDatePicker } from "./component/SingleDatePicker";
import { DateRangePicker } from "./component/DateRangePicker";

interface FilterFormProps {
  title: string;
  showSurveyStaff?: boolean;
  onFilterChange?: (filters: FilterValues) => void;
  onSubmit?: (filters: FilterValues) => void;
}

export interface FilterValues {
  branch: string;
  surveyStaff?: string;
  createDate: DateValue | null;
  fromDate: DateValue | null;
  toDate: DateValue | null;
}

export const FilterForm = ({
  title,
  showSurveyStaff = false,
  onFilterChange,
  onSubmit,
}: FilterFormProps) => {
  const [filters, setFilters] = useState<FilterValues>({
    branch: "",
    surveyStaff: "",
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
    <div className="rounded-xl bg-white dark:bg-zinc-900 p-4 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
      <h1 className="mb-6 md:mb-8 text-xl md:text-2xl font-bold dark:text-white">{title}</h1>
      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        <div className="space-y-6 md:space-y-8">
          <div className="space-y-2">
            <Select
              label="Chi nhánh"
              labelPlacement="outside"
              size="md"
              variant="bordered"
              placeholder="Chọn thành phố"
              className="w-full md:w-[500px]"
              classNames={{
                trigger: "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-10",
                label: "text-sm font-bold text-gray-700 dark:text-zinc-300",
                value: "dark:text-white"
              }}
              selectedKeys={filters.branch ? [filters.branch] : []}
              onSelectionChange={(keys) => {
                const selected = Array.from(keys)[0] as string;
                handleFilterChange("branch", selected);
              }}
            >
              <SelectItem key="nam-dinh" textValue="Thành phố Nam Định" className="dark:text-white">
                Thành phố Nam Định
              </SelectItem>
            </Select>
          </div>
          <SingleDatePicker
            value={filters.createDate}
            onChange={(value) => handleFilterChange("createDate", value)}
            label="Ngày lập"
          />
        </div>
        <div className="grid gap-6 md:gap-8">
          <div className="flex justify-between items-center gap-4">
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

          {showSurveyStaff ? (
            <Input
              label="Nhân viên KS"
              labelPlacement="outside"
              size="md"
              variant="bordered"
              placeholder="Nhập tên nhân viên KS"
              value={filters.surveyStaff || ""}
              onValueChange={(value) =>
                handleFilterChange("surveyStaff", value)
              }
              className="w-full md:w-[575px]"
              classNames={{
                inputWrapper: "bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 h-10",
                label: "text-sm font-bold text-gray-700 dark:text-zinc-300",
                input: "dark:text-white"
              }}
            />
          ) : (
            <div className="invisible h-[56px]" />
          )}
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <Button className="bg-blue-600 dark:bg-primary text-white hover:bg-blue-700 h-11 px-8 font-bold">
          <DocumentChartBarIcon className="mr-2 h-5 w-5" />
          Báo cáo
        </Button>
      </div>
    </div>
  );
};
