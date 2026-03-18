import { DateValue } from "@heroui/react";

export const formatVND = (value: number | string) => {
  const number =
    typeof value === "string" ? Number(value.replace(/[^\d]/g, "")) : value;

  if (isNaN(number)) return "0 VND";

  return `${number.toLocaleString("en-US")} VND`;
};

export const formatDate = (date: DateValue | null | undefined) => {
  if (!date) return null;

  const day = String(date.day).padStart(2, "0");
  const month = String(date.month).padStart(2, "0");
  const year = date.year;

  return `${day}-${month}-${year}`;
};
