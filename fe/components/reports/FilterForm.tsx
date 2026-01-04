"use client";

import React, { useState } from "react";
import { Select, SelectItem, Button, DateValue } from "@heroui/react";
import { DocumentChartBarIcon } from "@heroicons/react/24/solid";

import CustomInput from "../ui/custom/CustomInput";

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
    <div className="rounded-xl bg-white dark:bg-zinc-900 p-6 md:p-8 shadow-sm border border-gray-100 dark:border-zinc-800">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Vui lòng chọn các điều kiện để xuất báo cáo
          </p>
        </div>
        <Button
          className="bg-blue-600 dark:bg-primary text-white hover:bg-blue-700 h-11 px-8 font-bold shadow-lg shadow-blue-500/20 dark:shadow-primary/20"
          onPress={handleSubmit}
        >
          <DocumentChartBarIcon className="mr-2 h-5 w-5" />
          Xuất báo cáo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="w-full">
          <Select
            className="w-full"
            label="Chi nhánh"
            labelPlacement="inside"
            selectedKeys={filters.branch ? [filters.branch] : []}
            size="md"
            variant="bordered"
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0] as string;

              handleFilterChange("branch", selected);
            }}
          >
            <SelectItem
              key="nam-dinh"
              className="dark:text-white"
              textValue="Thành phố Nam Định"
            >
              Thành phố Nam Định
            </SelectItem>
          </Select>
        </div>

        {showSurveyStaff && (
          <div className="w-full">
            <CustomInput
              className="w-full"
              label="Nhân viên KS"
              value={filters.surveyStaff || ""}
              onValueChange={(value) =>
                handleFilterChange("surveyStaff", value)
              }
            />
          </div>
        )}

        <div className="w-full">
          <SingleDatePicker
            className="w-full"
            label="Ngày lập"
            value={filters.createDate}
            onChange={(value) => handleFilterChange("createDate", value)}
          />
        </div>

        <div className="md:col-span-2 lg:col-span-2 xl:col-span-2">
          <DateRangePicker
            className="w-full"
            fromDate={filters.fromDate}
            toDate={filters.toDate}
            onFromDateChange={(value) => handleFilterChange("fromDate", value)}
            onToDateChange={(value) => handleFilterChange("toDate", value)}
          />
        </div>
      </div>
    </div>
  );
};
