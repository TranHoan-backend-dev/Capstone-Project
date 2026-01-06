import { FormField } from "@/types/index";

export const customerInfoFields: FormField[] = [
  { key: "code", label: "Mã đơn", type: "search-input", required: true },
  { key: "maKhachHang", label: "Mã khách hàng", type: "input" },
  { key: "maSoThue", label: "Mã số thuế", type: "input" },
  { key: "customerName", label: "Tên khách hàng", type: "input" },
  { key: "cccd", label: "Số CCCD / CMND", type: "input" },
  { key: "issueDate", label: "Ngày cấp", type: "date" },
  { key: "exploitationPeriod", label: "Kỳ khai thác", type: "input" },
  {
    key: "budgetRelationshipCode",
    label: "Mã số Quan hệ ngân sách",
    type: "input",
  },
  { key: "soDienThoai", label: "Số điện thoại", type: "input" },
  { key: "householdCode", label: "Mã hộ khẩu", type: "input" },
  { key: "passportCode", label: "Mã hộ chiếu", type: "input" },
];
