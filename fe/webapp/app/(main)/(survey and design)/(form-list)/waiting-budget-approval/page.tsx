import type { Metadata } from "next";

import WaitingBudgetApprovalContent from "./WaitingBudgetApprovalContent";

export const metadata: Metadata = {
  title: "Danh sách hồ sơ chờ duyệt dự toán | CT cổ phần cấp nước Nam Định",
  description: "Báo cáo danh sách các hồ sơ đang chờ được phê duyệt dự toán.",
};

export default function Page() {
  return <WaitingBudgetApprovalContent />;
}
