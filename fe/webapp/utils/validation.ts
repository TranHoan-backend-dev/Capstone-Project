// Required
export const validateRequired = (value: string, fieldName: string) => {
  if (!value || !value.trim()) {
    return `${fieldName} không được để trống`;
  }
  return null;
};

// Max length
export const validateMaxLength = (
  value: string,
  max: number,
  fieldName: string,
) => {
  if (value && value.trim().length > max) {
    return `${fieldName} không được vượt quá ${max} ký tự`;
  }
  return null;
};

// Phone
export const validatePhone = (phone: string) => {
  const phoneRegex = /^0[0-9]{9}$/;

  if (!phoneRegex.test(phone)) {
    return "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số";
  }

  return null;
};

const DIGITS_ONLY_REGEX = /^\d+$/;

export const validateDigitsOnly = (
  value: string | number,
  fieldName: string,
  maxDigits?: number,
) => {
  const normalizedValue = String(value ?? "").trim();

  if (!normalizedValue) {
    return `${fieldName} không được để trống`;
  }

  if (!DIGITS_ONLY_REGEX.test(normalizedValue)) {
    return `${fieldName} chỉ được chứa ký tự số`;
  }

  if (maxDigits && normalizedValue.length > maxDigits) {
    return `${fieldName} không được vượt quá ${maxDigits} ký tự số`;
  }

  return null;
};

export const validateMoneyInput = (value: string | number, fieldName: string) => {
  return validateDigitsOnly(value, fieldName, 12);
};

export const validateText255 = (value: string, fieldName: string) => {
  return validateMaxLength(value, 255, fieldName);
};

// Name (chỉ chữ cái)
export const validateName = (value: string, fieldName: string) => {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;

  const maxError = validateMaxLength(value, 255, fieldName);
  if (maxError) return maxError;

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

  if (!nameRegex.test(value.trim())) {
    return `${fieldName} chỉ được chứa chữ cái`;
  }

  return null;
};

// Branch name (cho chi nhánh)
export const validateBranchName = (value: string, fieldName: string) => {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;

  const maxError = validateMaxLength(value, 255, fieldName);
  if (maxError) return maxError;

  const nameRegex = /^[a-zA-ZÀ-ỹ\s()]+$/;

  if (!nameRegex.test(value.trim())) {
    return `${fieldName} chỉ được chứa chữ cái`;
  }

  return null;
};

export const validateSelectRequired = (
  value: Set<string>,
  fieldName: string,
) => {
  if (!value || value.size === 0) {
    return `${fieldName} không được để trống`;
  }
  return null;
};

// Number only
export const validateNumber = (value: string, fieldName: string) => {
  const requiredError = validateRequired(value, fieldName);
  if (requiredError) return requiredError;

  const numberRegex = /^[0-9]+$/;

  if (!numberRegex.test(value)) {
    return `${fieldName} chỉ được chứa số`;
  }

  return null;
};

// Date không được trong quá khứ
export const validateNotPastDate = (date: string, fieldName: string) => {
  if (!date) return `${fieldName} không được để trống`;

  const selectedDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return `${fieldName} không được trong quá khứ`;
  }

  return null;
};

// Date không được trong tương lai
export const validateNotFutureDate = (date: string, fieldName: string) => {
  if (!date) return `${fieldName} không được để trống`;

  const selectedDate = new Date(date);
  const today = new Date();

  today.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);

  if (selectedDate > today) {
    return `${fieldName} không được trong tương lai`;
  }

  return null;
};

export const validateRequiredFields = (
  fields: { value: any; fieldName: string }[],
) => {
  for (const field of fields) {
    if (
      field.value === undefined ||
      field.value === null ||
      String(field.value).trim() === ""
    ) {
      return `${field.fieldName} không được để trống`;
    }
  }

  return null;
};

export const toAccountName = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();
};
