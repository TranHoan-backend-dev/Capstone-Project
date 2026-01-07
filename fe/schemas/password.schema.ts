import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Ít nhất 8 ký tự")
  .regex(/[A-Z]/, "Có ít nhất 1 chữ hoa")
  .regex(/[0-9]/, "Có ít nhất 1 số")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Có ít nhất 1 ký tự đặc biệt");

