"use client";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import CustomInput from "@/components/ui/custom/CustomInput";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";
import { FilterPendingConstructionRequest } from "@/types";
import { useState } from "react";
import CustomButton from "@/components/ui/custom/CustomButton";

interface ConstructionProcessorProps {
  onFilterChange: (filters: FilterPendingConstructionRequest) => void;
}

export const ConstructionProcessor = ({
  onFilterChange,
}: ConstructionProcessorProps) => {
  const [keyword, setKeyword] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [approvalDate, setApprovalDate] = useState("");
  const [teamLeader, setTeamLeader] = useState("");
  const [constructionUnit, setConstructionUnit] = useState("");
  const [content, setContent] = useState("");

  const handleSearch = () => {
    onFilterChange({
      keyword,
      fromDate,
      toDate,
      approvalDate,
      teamLeader,
      constructionUnit,
      content,
    });
  };

  const handleReset = () => {
    setKeyword("");
    setFromDate("");
    setToDate("");
    setApprovalDate("");
    setTeamLeader("");
    setConstructionUnit("");
    setContent("");
    onFilterChange({});
  };

  return (
    <GenericSearchFilter
      title="Xử lý Đơn Chờ Thi Công"
      icon={<SearchIcon size={18} />}
      gridClassName="block space-y-8"
      isCollapsible
      actions={
        <div className="flex gap-2">
          <CustomButton color="primary" onPress={handleSearch}>
            Tìm kiếm
          </CustomButton>
          <CustomButton variant="light" onPress={handleReset}>
            Đặt lại
          </CustomButton>
        </div>
      }
    >
      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Bộ lọc tìm kiếm
        </h3>
        <div className="flex items-end gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchInputWithButton
              label="Từ khóa"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <CustomInput
              label="Từ ngày"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
            <CustomInput
              label="Đến ngày"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-base font-bold text-gray-800 dark:text-white">
          Thông tin duyệt đơn
        </h3>
        <div className="grid grid-cols-3 gap-6">
          <CustomInput
            label="Ngày duyệt đơn"
            type="date"
            value={approvalDate}
            onChange={(e) => setApprovalDate(e.target.value)}
          />
          {/* <CustomSelect
            label="Đội trưởng thi công"
            value={teamLeader}
            onChange={(e) => setTeamLeader(e.target.value)}
            options={[
              { label: "Chọn đội trưởng...", value: "" },
              { label: "Đội 1 - Nguyễn Văn A", value: "team1" },
              { label: "Đội 2 - Trần Văn B", value: "team2" },
              { label: "Đội 3 - Lê Văn C", value: "team3" },
            ]}
          /> */}
          {/* <CustomSelect
            label="Đơn vị thi công"
            value={constructionUnit}
            onChange={(e) => setConstructionUnit(e.target.value)}
            options={[
              { label: "Chọn đơn vị...", value: "" },
              { label: "Đơn vị thi công số 1", value: "unit1" },
              { label: "Đơn vị thi công số 2", value: "unit2" },
              { label: "Đơn vị thi công số 3", value: "unit3" },
            ]}
          /> */}
        </div>
        <CustomTextarea
          label="Nội dung"
          placeholder="Nhập nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </section>
    </GenericSearchFilter>
  );
};
