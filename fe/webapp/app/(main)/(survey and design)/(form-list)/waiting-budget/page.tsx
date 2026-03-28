import type { Metadata } from "next";

import WaitingBudgetListContent from "./WaitingBudgetListContent";

export const metadata: Metadata = {
  title: "Danh sách hồ sơ chờ lập dự toán | CT cổ phần cấp nước Nam Định",
  description:
    "Báo cáo danh sách các hồ sơ đang được khảo sát để chờ lập dự toán.",
};

export default function Page() {
  return <WaitingBudgetListContent />;
}
