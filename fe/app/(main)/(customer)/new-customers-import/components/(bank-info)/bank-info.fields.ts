import { FormField } from "@/types/index";

export const bankInfoFields: FormField[] = [
  {
    key: "paymentMethod",
    label: "Hình thức thanh toán",
    type: "select",
    options: [],
  },
  {
    key: "accountNumber",
    label: "Số tài khoản",
    type: "input",
  },
  {
    key: "bankName",
    label: "Ngân hàng",
    type: "input",
  },
  {
    key: "accountHolderName",
    label: "Tên chủ tài khoản",
    type: "input",
  },
];
