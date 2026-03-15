export const ESTIMATE_COLUMN = [
  { key: "index", label: "#", width: "50px" },
  { key: "code", label: "Mã vật tư" },
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
