import type { Metadata } from "next";

import RejectedBudgetApprovalContent from "./RejectedBudgetApprovalContent";

export const metadata: Metadata = {
  title: "Danh sách đơn từ chối duyệt dự toán | CT cổ phần cấp nước Nam Định",
  description: "Báo cáo danh sách các đơn đã bị từ chối phê duyệt dự toán.",
};

export default function Page() {
  return <RejectedBudgetApprovalContent />;
}
