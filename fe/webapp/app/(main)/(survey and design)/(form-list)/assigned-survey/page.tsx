import type { Metadata } from "next";

import AssignedSurveyListContent from "./AssignedSurveyListContent";

export const metadata: Metadata = {
  title: "Danh sách đơn đã phân công khảo sát | CT cổ phần cấp nước Nam Định",
  description:
    "Báo cáo danh sách các đơn đã được phân công cho nhân viên khảo sát.",
};

export default function Page() {
  return <AssignedSurveyListContent />;
}
