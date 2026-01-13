import { passwordSchema } from "@/schemas/password.schema";

export const checkPasswordRequirements = (password: string) => {
  return {
    minLength: password.length >= 6,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    isValid: passwordSchema.safeParse(password).success,
  };
};
