export const formatVND = (value: number | string) => {
  const number =
    typeof value === "string" ? Number(value.replace(/[^\d]/g, "")) : value;

  if (isNaN(number)) return "0 VND";

  return `${number.toLocaleString("en-US")} VND`;
};

export const formatDateProfile = (date: string) => {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
};
