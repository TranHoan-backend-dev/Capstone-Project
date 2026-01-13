"use client";

import React, { useState } from "react";
import { useDisclosure, DateValue } from "@heroui/react";

import { SubMasterMeterModal } from "./sub-master-meter-modal";
import { RouteListModal } from "./route-list-modal";

import { SearchIcon } from "@/components/ui/Icons";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomButton from "@/components/ui/custom/CustomButton";
import { DeleteIcon } from "@/config/chip-and-icon";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";

export const ActionsSection = () => {
  const {
    isOpen: isMeterOpen,
    onOpen: onMeterOpen,
    onOpenChange: onMeterOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRouteOpen,
    onOpen: onRouteOpen,
    onOpenChange: onRouteOpenChange,
  } = useDisclosure();
  const [acceptingFormDate, setAcceptingFormDate] = useState<
    DateValue | null | undefined
  >(null);
  const [branch, setBranch] = useState("nam_dinh");
  const [totalBranch, setTotalBranch] = useState("all");
  const [meterCode, setMeterCode] = useState("");
  const [routeCode, setRouteCode] = useState("");
  const [content, setContent] = useState("");

  const branches = [{ label: "Thành phố Nam Định", value: "nam_dinh" }];

  const totalBranches = [{ label: "Tất cả", value: "all" }];

  const handleClear = () => {
    setAcceptingFormDate(null);
    setBranch("nam_dinh");
    setTotalBranch("all");
    setMeterCode("");
    setRouteCode("");
    setContent("");
  };

  return (
    <>
      <GenericSearchFilter
        isCollapsible
        actions={<></>}
        gridClassName="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-4"
        icon={<SearchIcon size={18} />}
        title="Xử lí đơn chờ thiết kế & Thiết kế"
      >
        <div className="md:col-span-6 space-y-4">
          <div className="space-y-1">
            <CustomDatePicker
              className="max-w-full"
              label="Ngày duyệt đơn"
              value={acceptingFormDate}
              onChange={setAcceptingFormDate}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SelectField
              colSpan="col-span-1"
              label="Chi nhánh"
              options={branches}
              value={branch}
              onValueChangeAction={setBranch}
            />
            <SelectField
              colSpan="col-span-1"
              label="Nhánh tổng"
              options={totalBranches}
              value={totalBranch}
              onValueChangeAction={setTotalBranch}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <SearchInputField
              colSpan="col-span-1"
              label="Nhập mã đồng hồ tổng"
              value={meterCode}
              onSearchClick={onMeterOpen}
              onValueChangeAction={setMeterCode}
            />
            <SearchInputField
              colSpan="col-span-1"
              label="Nhập mã lộ trình"
              value={routeCode}
              onSearchClick={onRouteOpen}
              onValueChangeAction={setRouteCode}
            />
          </div>
        </div>

        <div className="md:col-span-6 flex flex-col h-full space-y-4">
          <div className="flex-1 flex flex-col space-y-1">
            <CustomTextarea
              disableAnimation
              disableAutosize
              isClearable
              className="flex-1"
              classNames={{
                inputWrapper:
                  "h-full min-h-[100px] bg-gray-50/30 dark:bg-default-50/50 border-gray-100 dark:border-divider focus-within:!border-blue-500 dark:focus-within:!border-primary-500 transition-all shadow-sm items-start py-2",
                input: "text-[13px] h-full",
              }}
              label="Nội dung"
              value={content}
              onValueChange={setContent}
            />
          </div>
          <div className="flex justify-end">
            <CustomButton
              className="bg-gray-100 dark:bg-default-100 text-gray-700 dark:text-foreground font-bold px-6 shadow-none border border-gray-200 dark:border-divider h-9 shrink-0 hover:bg-gray-200 dark:hover:bg-default-200"
              radius="md"
              size="md"
              startContent={<DeleteIcon className="w-5 h-5" />}
              onPress={handleClear}
            >
              Xóa các lựa chọn
            </CustomButton>
          </div>
        </div>
      </GenericSearchFilter>

      <SubMasterMeterModal
        isOpen={isMeterOpen}
        onOpenChangeAction={onMeterOpenChange}
      />
      <RouteListModal
        isOpen={isRouteOpen}
        onOpenChangeAction={onRouteOpenChange}
      />
    </>
  );
};

export const SearchInputField = ({
  label,
  onSearchClick,
  colSpan = "md:col-span-6",
  value,
  onValueChangeAction,
}: {
  label: string;
  onSearchClick?: () => void;
  colSpan?: string;
  value: string;
  onValueChangeAction: (val: string) => void;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <SearchInputWithButton
        placeholder={label}
        value={value}
        onSearch={onSearchClick}
        onValueChange={onValueChangeAction}
      />
    </div>
  );
};

export const SelectField = ({
  label,
  options,
  colSpan = "md:col-span-6",
  onValueChangeAction,
}: {
  label: string;
  options: { value: string; label: string }[];
  colSpan?: string;
  value: string;
  onValueChangeAction: (val: string) => void;
}) => {
  return (
    <div className={`${colSpan} space-y-1`}>
      <CustomSelect
        label={label}
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0] as string;

          if (selected) onValueChangeAction(selected);
        }}
        options={options.map((item) => ({
          label: item.label,
          value: item.value,
        }))}
      />
    </div>
  );
};
