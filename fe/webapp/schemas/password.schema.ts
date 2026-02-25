import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(8, "Yêu cầu có ít nhất 8 ký tự, có ký tự hoa, thường, chữ số")
  .regex(/[A-Z]/, "Yêu cầu có ít nhất 8 ký tự, có ký tự hoa, thường, chữ số")
  .regex(/[0-9]/, "Yêu cầu có ít nhất 8 ký tự, có ký tự hoa, thường, chữ số")
  .regex(/[!@#$%^&*(),.?":{}|<>]/, "Yêu cầu có ít nhất 8 ký tự, có ký tự hoa, thường, chữ số");
