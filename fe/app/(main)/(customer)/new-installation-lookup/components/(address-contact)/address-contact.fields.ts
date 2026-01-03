import { FormField } from "@/types/index";

export const addressContactFields: FormField[] = [
  {
    key: "houseNumber",
    label: "Số nhà",
    type: "input",
  },
  {
    key: "street",
    label: "Đường phố",
    type: "input",
  },
  {
    key: "village",
    label: "Chọn thôn / làng",
    type: "select",
    options: [],
  },
  {
    key: "neighborhood",
    label: "Chọn tổ / khu / xóm",
    type: "select",
    options: [],
  },
  {
    key: "ward",
    label: "Chọn phường / xã",
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
];
