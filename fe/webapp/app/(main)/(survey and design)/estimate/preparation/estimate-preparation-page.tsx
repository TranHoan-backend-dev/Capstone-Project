"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { ResultsTable } from "./components/results-table";

import { FilterSection } from "@/components/ui/FilterSection";
import { formatDate } from "@/utils/format";

const EstimatePreparationPage = () => {
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  return (
    <>
      <FilterSection
        actions={<></>}
        from={from}
        keyword={keyword}
        setFromAction={setFrom}
        setKeywordAction={setKeyword}
        setToAction={setTo}
        title="Bộ lọc"
        to={to}
      />
      <ResultsTable
        keyword={keyword}
        from={formatDate(from)}
        to={formatDate(to)}
      />
    </>
  );
};

export default EstimatePreparationPage;
