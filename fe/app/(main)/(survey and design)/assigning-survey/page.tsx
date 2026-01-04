import React from "react";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import { Metadata } from "next";
import AssigningSurveyPage from "./assigning-survey";

export const metadata: Metadata = {
  title: "Phân công khảo sát thiết kế",
  description: "Phân công khảo sát thiết kế",
};

const AssigningSurvey = () => {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Khảo sát thiết kế", href: "assigning-survey" },
        ]}
      />

      <div className="space-y-6 pt-2">
        <AssigningSurveyPage />
      </div>
    </>
  );
};

export default AssigningSurvey;
