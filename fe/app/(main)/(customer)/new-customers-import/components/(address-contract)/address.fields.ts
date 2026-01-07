import { FormField } from "@/types";

export const addressFields: FormField[] = [
  { key: "houseNumber", label: "Số nhà", type: "input" },
  { key: "street", label: "Đường phố", type: "search-input" },
  {
    key: "village",
    label: "Thôn / làng",
    type: "select",
    options: [],
  },
  {
    key: "neighborhood",
    label: "Tổ / khu / xóm",
    type: "select",
    options: [],
  },
  {
    key: "ward",
    label: "Phường / xã",
    type: "select",
    options: [],
  },
  {
    key: "branch",
    label: "Chọn chi nhánh",
    type: "select",
    defaultValue: "all",
    options: [{ key: "all", label: "Tất cả" }],
  },
  {
    key: "note",
    type: "textarea",
    label: "Điểm đầu nối, khối thủy",
    rows: 3,
  },
];
