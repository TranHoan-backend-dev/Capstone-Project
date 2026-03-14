export const validateRequired = (value: string, fieldName: string) => {
  if (!value.trim()) {
    return `${fieldName} không được để trống`;
  }
  return null;
};

export const validateMaxLength = (
  value: string,
  max: number,
  fieldName: string,
) => {
  if (value.trim().length > max) {
    return `${fieldName} không được vượt quá ${max} ký tự`;
  }
  return null;
};

export const validatePhone = (phone: string) => {
  const phoneRegex = /^0[0-9]{9}$/;

  if (!phoneRegex.test(phone)) {
    return "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số";
  }

  return null;
};
