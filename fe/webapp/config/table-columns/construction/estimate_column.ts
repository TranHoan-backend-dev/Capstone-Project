export const ESTIMATE_COLUMN = [
  { key: "stt", label: "STT", width: "40px" },
  // { key: "code", label: "Mã vật tư", sortable: true },
  { key: "description", label: "Nội dung công việc" },
  { key: "note", label: "Ghi chú" },
  { key: "unit", label: "ĐVT" },
  { key: "reductionFactor", label: "Hệ số giảm", align: "center" as const },
  { key: "quantity", label: "Khối lượng", align: "center" as const },
  { key: "materialPrice", label: "Đơn giá vật tư", align: "end" as const },
  { key: "laborPrice", label: "Đơn giá nhân công", align: "end" as const },
  { key: "materialTotal", label: "Thành tiền vật tư", align: "end" as const },
  { key: "laborTotal", label: "Thành tiền nhân công", align: "end" as const },
  { key: "actions", label: "Hoạt động", align: "center" as const },
];

export const ESTIMATE_PREPARATION_COLUMN = [
  { key: "stt", label: "STT", width: "40px", align: "center" as const },
  { key: "formNumber", label: "Mã đơn" },
  { key: "customerName", label: "Tên khách hàng" },
  { key: "address", label: "Địa chỉ lắp đặt", width: "300px" },
  {
    key: "registerDate",
    label: "Ngày đăng ký",
    sortable: true,
    align: "center" as const,
  },
  { key: "note", label: "Ghi chú" },
  { key: "status", label: "Trạng thái" },
  { key: "actions", label: "Hoạt động", align: "center" as const },
];

export const ESTIMATE_APPROVAL_COLUMN = [
  { key: "code", label: "Mã đơn", align: "start" },
  { key: "designProfileName", label: "Tên hồ sơ thiết kế", align: "start" },
  { key: "installationAddress", label: "Địa chỉ lắp đặt", align: "start" },
  { key: "totalAmount", label: "Tổng tiền", align: "end" },
  { key: "createdDate", label: "Ngày lập", align: "center" },
  { key: "creator", label: "Người lập", align: "start" },
  { key: "actions", label: "Hành động", align: "center" },
];
