import { Metadata } from "next";

import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import FeeCollectionPage from "./fee-collection-page";

export const metadata: Metadata = {
  title: "Quản lý Thu tiền lắp đặt",
  description: "Quản lý Thu tiền lắp đặt",
};

const FeeCollection = () => {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Ghi chỉ số & Hóa đơn" },
    { label: "Quản lý Thu tiền lắp đặt" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />

      <div className="pt-2 space-y-6">
        <FeeCollectionPage />
      </div>
    </>
  );
};

export default FeeCollection;
