export const INSTALLATION_FORM_NEW_COLUMN = [
  { key: "stt", label: "STT", width: "40px", align: "center" as const },
  { key: "formNumber", label: "Mã đơn", align: "center" as const },
  { key: "customerName", label: "Tên khách hàng", align: "center" as const },
  { key: "phoneNumber", label: "Điện thoại", align: "center" as const },
  { key: "address", label: "Địa chỉ lắp đặt", align: "center" as const },
  {
    key: "registrationAt",
    label: "Ngày đăng ký",
    align: "center" as const,
    sortable: true,
  },
  { key: "actions", label: "Thao tác", align: "center" as const },
];
