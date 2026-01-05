import { CustomBreadcrumb } from "@/components/ui/CustomBreadcrumb";
import { Metadata } from "next";
import { FeeForm } from "./components/fee-form";
import { FeeTable } from "./components/fee-table";

export const metadata: Metadata = {
  title: "Thu tiền lắp đặt",
  description: "Thu tiền lắp đặt",
};

const FeeCollectionPage = () => {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Ghi chỉ số & Hóa đơn" },
    { label: "Thu tiền lắp đặt" }
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />

      <div className="pt-2 space-y-6">

        {/* Khối Form */}
        <FeeForm />

        {/* Khối Table */}
        <FeeTable />

      </div>
    </>
  );
};

export default FeeCollectionPage;