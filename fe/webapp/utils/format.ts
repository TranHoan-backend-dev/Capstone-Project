import { DateValue } from "@heroui/react";

export const formatVND = (value: number | string) => {
  const number =
    typeof value === "string" ? Number(value.replace(/[^\d]/g, "")) : value;

  if (isNaN(number)) return "0 VND";

  return `${number.toLocaleString("en-US")} VND`;
};

export const formatDate1 = (iso: string) => {
  if (!iso) return "";

  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
export const formatDate2 = (date: DateValue | null | undefined) => {
  if (!date) return null;

  const day = String(date.day).padStart(2, "0");
  const month = String(date.month).padStart(2, "0");
  const year = date.year;

  return `${year}-${month}-${day}`;
};