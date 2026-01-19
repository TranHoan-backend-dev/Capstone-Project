import { FormField } from "@/types";

export const contractFields: FormField[] = [
  {
    key: "contractNumber",
    label: "Số hợp đồng",
    type: "input",
  },
  {
    key: "meterCode",
    label: "Mã đồng hồ",
    type: "input",
  },
  {
    key: "contractDate",
    label: "Ngày hợp đồng",
    type: "date",
  },
  {
    key: "installationDate",
    label: "Ngày lắp đặt",
    type: "date",
  },
  {
    key: "installationContractNumber",
    label: "Số hợp đồng lắp đặt",
    type: "input",
  },
  {
    key: "installationContractDate",
    label: "Ngày hợp đồng lắp đặt",
    type: "date",
  },
  {
    key: "customerType",
    label: "Loại khách hàng",
    type: "select",
    options: [],
  },
  {
    key: "purposeUse",
    label: "Mục đích sử dụng",
    type: "select",
    options: [],
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
    key: "priceTable",
    label: "Bảng giá",
    type: "select",
    options: [],
  },
  {
    key: "environmentalFeeSpecial",
    label: "Tính phí bảo vệ môi trường đặc biệt",
    type: "select",
    options: [],
  },
  {
    key: "recordingRoute",
    label: "Lộ trình ghi",
    type: "search-input",
  },
  {
    key: "meterType",
    label: "Loại đồng hồ",
    type: "search-input",
  },
  {
    key: "meterIndex",
    label: "Chỉ số đồng hồ",
    type: "input",
  },
  {
    key: "quota",
    label: "Định mức",
    type: "input",
  },
  {
    key: "size",
    label: "Kích cỡ",
    type: "select",
    options: [],
  },
  {
    key: "isMajorCustomer",
    label: "Khách hàng lớn",
    type: "checkbox",
  },
];
