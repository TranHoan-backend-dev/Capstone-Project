export const formatVND = (value: number | string) => {
  const number =
    typeof value === "string" ? Number(value.replace(/[^\d]/g, "")) : value;

  if (isNaN(number)) return "0 VND";

  return `${number.toLocaleString("en-US")} VND`;
};

export const formatDate = (iso: string) => {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
