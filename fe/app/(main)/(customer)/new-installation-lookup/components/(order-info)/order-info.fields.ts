import { FormField } from "@/types";

export const orderInfoFields: FormField[] = [
  {
    key: "orderCode",
    label: "Mã đơn đăng ký",
    type: "input",
  },
  {
    key: "orderNumber",
    label: "Số đơn",
    type: "input",
  },
  {
    key: "receivedDate",
    label: "Ngày nhận đơn",
    type: "date",
    required: true,
  },
  {
    key: "surveyDate",
    label: "Ngày hẹn khảo sát",
    type: "date",
  },
  {
    key: "customerType",
    label: "Loại khách hàng",
    type: "select",
    defaultValue: "all",
    options: [{ key: "all", label: "Tất cả" }],
  },
  {
    key: "numberHousehold",
    label: "Số hộ sử dụng",
    type: "input",
  },
  {
    key: "numberPeople",
    label: "Số nhân khẩu",
    type: "input",
  },
  {
    key: "purposeUse",
    label: "Mục đích sử dụng",
    type: "select",
    defaultValue: "all",
    options: [{ key: "all", label: "Tất cả" }],
  },
  {
    key: "generalBranch",
    label: "Nhánh tổng",
    type: "select",
    defaultValue: "all",
    options: [{ key: "all", label: "Tất cả" }],
  },
  {
    key: "masterMeter",
    label: "Đồng hồ tổng",
    type: "search-input",
  },
  {
    key: "routeCode",
    label: "Mã lộ trình",
    type: "input",
  },
];
