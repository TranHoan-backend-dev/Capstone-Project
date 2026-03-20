"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import { Button } from "@heroui/react";
interface FilterSectionProps {
  onFilter?: (filters: any) => void;
}

export const FilterSection = ({ onFilter }: FilterSectionProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [fromDate, setFromDate] = useState<string>(
    searchParams.get("fromDate") || "",
  );
  const [toDate, setToDate] = useState<string>(
    searchParams.get("toDate") || "",
  );

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.set("keyword", keyword);
    if (fromDate) params.set("fromDate", fromDate);
    if (toDate) params.set("toDate", toDate);
    params.set("page", "0"); // Reset về trang đầu khi filter

    router.push(`/settlement?${params.toString()}`);

    if (onFilter) {
      onFilter({ keyword, fromDate, toDate });
    }
  };

  const handleReset = () => {
    setKeyword("");
    setFromDate("");
    setToDate("");
    router.push("/settlement");

    if (onFilter) {
      onFilter({});
    }
  };

  return (
    <GenericSearchFilter
      isCollapsible
      gridClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-3"
      icon={<SearchIcon size={18} />}
      title="Tra cứu quyết toán"
    >
      <div className="lg:col-span-2 space-y-1">
        <div className="flex gap-2">
          <CustomInput
            className="font-bold"
            label="Từ khóa"
            placeholder="Nhập từ khóa"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="lg:col-span-1 space-y-1">
        <CustomDatePicker className="font-bold" label="Từ ngày" />
      </div>

      <div className="lg:col-span-1 space-y-1">
        <CustomDatePicker className="font-bold" label="Đến ngày" />
      </div>
    </GenericSearchFilter>
  );
};

export const DatePickerField = ({ label }: { label: string }) => {
  return (
    <div className="lg:col-span-1 space-y-1">
      <CustomDatePicker className="font-bold" label={label} />
    </div>
  );
};
