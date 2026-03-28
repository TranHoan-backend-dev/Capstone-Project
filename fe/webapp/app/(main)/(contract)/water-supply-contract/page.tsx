import { Metadata } from "next";
import { CustomBreadcrumb } from "@/components/ui/custom/CustomBreadcrumb";
import NewWaterContractPage from "./contract-page";

export const metadata: Metadata = {
  title: "Hợp đồng cấp nước mới",
  description: "Hợp đồng cấp nước mới",
};

export default function NewWaterContract() {
  const breadcrumbItems = [
    { label: "Trang chủ", href: "/home" },
    { label: "Hợp đồng cấp nước mới" },
  ];

  return (
    <>
      <CustomBreadcrumb items={breadcrumbItems} />
      <NewWaterContractPage />
    </>
  );
}
