"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { SurveyAssignmentTable } from "./components/results-table";
import SurveyTabs from "./components/servey-tabs";

import { FilterSection } from "@/components/ui/FilterSection";
import { SurveyAssignmentItem } from "@/types";

const AssigningSurveyPage = () => {
  const pendingData: SurveyAssignmentItem[] = [
    {
      id: 1,
      code: "#DH001234",
      customerName: "Nguyễn Thị Mai",
      phone: "0901234567",
      address: "123 Đường Nguyễn Huệ, P. Bến Nghé, Q1...",
      registrationDate: "15/12/2024",
      surveyDate: "20/12/2024 08:00",
      status: "pending",
    },
    {
      id: 2,
      code: "#DH001235",
      customerName: "Trần Văn Hùng",
      phone: "0912345678",
      address: "456 Lê Lợi, P. Bến Thành, Q1, TP.HCM",
      registrationDate: "15/12/2024",
      surveyDate: "21/12/2024 14:00",
      status: "pending",
    },
  ];

  const assignedData: SurveyAssignmentItem[] = [
    {
      id: 1,
      code: "#DH009234",
      customerName: "Nguyễn Thị Mai",
      phone: "0901234567",
      address: "123 Đường Nguyễn Huệ, P. Bến Nghé, Q1...",
      registrationDate: "15/12/2024",
      surveyDate: "21/12/2024 14:00",
      surveyorName: "Tuấn Anh",
      status: "assigned",
    },
    {
      id: 2,
      code: "#DH001235",
      customerName: "Trần Văn Hùng",
      phone: "0912345678",
      address: "456 Lê Lợi, P. Bến Thành, Q1, TP.HCM",
      registrationDate: "15/12/2024",
      surveyDate: "21/12/2024 14:00",
      surveyorName: "Võ Mỹ Linh",
      status: "assigned",
    },
  ];

  const [activeTab, setActiveTab] = useState<"pending" | "assigned">("pending");
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  const currentData = activeTab === "pending" ? pendingData : assignedData;

  return (
    <>
      <FilterSection
        from={from}
        keyword={keyword}
        setFrom={setFrom}
        setKeyword={setKeyword}
        setTo={setTo}
        title="Phân công khảo sát thiết kế"
        to={to}
      />

      <div>
        <SurveyTabs activeTab={activeTab} onChange={setActiveTab} />
        <SurveyAssignmentTable data={currentData} />
      </div>
    </>
  );
};

export default AssigningSurveyPage;
