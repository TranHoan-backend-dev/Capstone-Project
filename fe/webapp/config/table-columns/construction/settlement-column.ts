export const SETLEMENT_LOOKUP_COLUMN = [
  { key: "stt", label: "STT", width: "40px" },
  { key: "formNumber", label: "Số đơn" },
  { key: "jobContent", label: "Tên công trình" },
  { key: "note", label: "Ghi chú" },
  { key: "connectionFee", label: "Phí kết nối" },
  { key: "address", label: "Địa chỉ lắp đặt" },
  { key: "registrationAt", label: "Ngày đăng ký" },
  { key: "actions", label: "Hoạt động", align: "center" as const },
];

export const SETLEMENT_DOCUMENT_COLUMN = [
  { key: "stt", label: "STT", align: "center" as const },
  { key: "materialCode", label: "Mã Hiệu", align: "center" as const },
  { key: "jobContent", label: "Tên công việc", align: "left" as const },
  { key: "unit", label: "Đơn vị", align: "center" as const },
  { key: "mass", label: "Khối lượng", align: "right" as const },
  { key: "materialCost", label: "Đơn giá VL", align: "right" as const },
  {
    key: "laborPriceAtRuralCommune",
    label: "Đơn giá NC",
    align: "right" as const,
  },
  { key: "totalMaterialPrice", label: "Thành tiền VL", align: "right" as const },
  { key: "totalLaborPrice", label: "Thành tiền NC", align: "right" as const },
];
