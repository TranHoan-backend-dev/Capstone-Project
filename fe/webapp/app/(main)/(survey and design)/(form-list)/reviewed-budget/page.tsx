import type { Metadata } from "next";

import ReviewedBudgetListContent from "./ReviewedBudgetListContent";

export const metadata: Metadata = {
  title: "Danh sách đơn đã duyệt dự toán | CT cổ phần cấp nước Nam Định",
  description:
    "Báo cáo tổng hợp các đơn đã được phê duyệt hoặc từ chối duyệt dự toán.",
};

export default function Page() {
  return <ReviewedBudgetListContent />;
}
