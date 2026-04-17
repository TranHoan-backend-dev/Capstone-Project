import React from "react";
import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import RoadmapAssignmentPage from "./roadmap-assignment-page";

export const metadata: Metadata = {
  title: "Phân công lộ trình ghi | CMSN",
  description:
    "Giao diện dành cho Trưởng phòng kinh doanh để phân công lộ trình ghi thu",
};

export default function Page() {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Phân công lộ trình ghi", isCurrent: true },
        ]}
      />

      <div className="space-y-6 pt-2">
        <RoadmapAssignmentPage />
      </div>
    </>
  );
}
