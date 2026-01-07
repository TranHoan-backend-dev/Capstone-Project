import { FormField } from "@/types";

export const supplementaryInfoFields: FormField[] = [
  {
    key: "dateOfStay",
    label: "Tháng trọ",
    type: "date",
  },
  {
    key: "installationCosts",
    label: "Kinh phí lắp đặt",
    type: "input",
  },
  {
    key: "promotionM3",
    label: "M3 khuyến mãi",
    type: "input",
  },
  {
    key: "deductionPeriod",
    label: "Thời gian khấu trừ",
    type: "input",
  },
  {
    key: "invoiceOptions",
    type: "checkbox",
    label: "",
    colSpan: 2,
    options: [
      { key: "changeInfo", label: "Đổi thông tin xuất hóa đơn" },
      { key: "noCharge", label: "Không tính tiền" },
      { key: "promotion", label: "Khuyến mãi" },
    ],
  },
];
