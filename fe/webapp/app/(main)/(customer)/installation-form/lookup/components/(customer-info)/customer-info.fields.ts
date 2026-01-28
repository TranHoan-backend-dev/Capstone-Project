import { FormField } from "@/types";

export const customerInfoFields: FormField[] = [
  {
    key: "customerName",
    label: "Tên khách hàng",
    type: "input",
    required: true,
  },
  {
    key: "representativeName",
    label: "Tên người đại diện",
    type: "input",
  },
  {
    key: "position",
    label: "Chức vụ",
    type: "input",
  },
  {
    key: "phone",
    label: "Điện thoại liên hệ",
    type: "input",
  },
  {
    key: "dateOfBirth",
    label: "Ngày sinh",
    type: "date",
  },
  {
    key: "citizenIdentity",
    label: "Số CMND/CCCD",
    type: "input",
  },
  {
    key: "dateOfIssue",
    label: "Ngày cấp",
    type: "date",
  },
  {
    key: "placeOfIssue",
    label: "Nơi cấp",
    type: "input",
  },
  {
    key: "householdCode",
    label: "Mã hộ khẩu",
    type: "input",
  },
  {
    key: "taxCode",
    label: "Mã số thuế",
    type: "input",
  },
];
