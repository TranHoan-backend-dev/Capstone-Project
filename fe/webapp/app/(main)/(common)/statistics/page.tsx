import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";

import StatisticsPage from "./statistics-page";

export const metadata: Metadata = {
  title: "Thống kê",
  description: "Thống kê tổng quan hệ thống (IT & lãnh đạo công ty)",
};

export default function StatisticsRoutePage() {
  return (
    <>
      <CustomBreadcrumb
        items={[
          { label: "Trang chủ", href: "/home" },
          { label: "Thống kê", isCurrent: true },
        ]}
      />
      <div className="space-y-6 pt-2">
        <StatisticsPage />
      </div>
    </>
  );
}
