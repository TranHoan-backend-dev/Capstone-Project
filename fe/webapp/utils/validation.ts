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

// Address (chữ cái, số, dấu phẩy, dấu chấm, dấu gạch ngang, dấu gạch chéo)
export const validateAddress = (value: string, fieldName: string = "Địa chỉ") => {
  if (!value || !value.trim()) return null; // address thường không bắt buộc

  const maxError = validateMaxLength(value, 255, fieldName);
  if (maxError) return maxError;

  const addressRegex = /^[a-zA-ZÀ-ỹ0-9\s,.\-/()]+$/;
  if (!addressRegex.test(value.trim())) {
    return `${fieldName} không được chứa ký tự đặc biệt`;
  }

  return null;
};

// Lọc ký tự không hợp lệ cho trường địa chỉ (chỉ giữ chữ cái, số, khoảng trắng và , . - / ( ))
export const normalizeAddress = (value: string): string => {
  return value.replace(/[^a-zA-ZÀ-ỹ0-9\s,.\-/()]/g, "");
};

export const validateGeneralText = (value: string, fieldName: string) => {
  if (!value || !value.trim()) return null;

  const maxError = validateMaxLength(value, 255, fieldName);
  if (maxError) return maxError;

  const generalTextRegex = /^[a-zA-ZÀ-ỹ0-9\s,.\-/()']+$/;
  if (!generalTextRegex.test(value.trim())) {
    return `${fieldName} không được chứa ký tự đặc biệt`;
  }

  return null;
};

// Tax code (chỉ chữ số và chữ cái, tối đa 14 ký tự)
export const validateTaxCode = (value: string, fieldName: string = "Mã số thuế") => {
  if (!value || !value.trim()) return null; // không bắt buộc

  if (value.trim().length > 14) {
    return `${fieldName} không được vượt quá 14 ký tự`;
  }

  if (!/^[a-zA-Z0-9\-]+$/.test(value.trim())) {
    return `${fieldName} chỉ được chứa chữ số, chữ cái và dấu gạch ngang`;
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

// Code / FormCode / FormNumber / ContractId / SettlementId / ReceiptNumber
// Chỉ cho phép chữ cái, chữ số, dấu gạch ngang và dấu gạch chéo
export const validateCodeField = (value: string, fieldName: string) => {
  if (!value || !value.trim()) {
    return `${fieldName} không được để trống`;
  }

  const maxError = validateMaxLength(value, 50, fieldName);
  if (maxError) return maxError;

  const codeRegex = /^[a-zA-Z0-9\-/]+$/;
  if (!codeRegex.test(value.trim())) {
    return `${fieldName} không được chứa ký tự đặc biệt`;
  }

  return null;
};

// Bank text fields (Ngân hàng, Tên tài khoản) - chỉ chữ cái, không số, không ký tự đặc biệt
export const validateBankTextField = (value: string, fieldName: string) => {
  if (!value || !value.trim()) return null; // không bắt buộc

  const maxError = validateMaxLength(value, 255, fieldName);
  if (maxError) return maxError;

  const bankTextRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!bankTextRegex.test(value.trim())) {
    return `${fieldName} chỉ được chứa chữ cái, không được nhập số hoặc ký tự đặc biệt`;
  }

  return null;
};

// Lọc ký tự không hợp lệ cho trường text ngân hàng (chỉ giữ chữ cái và khoảng trắng)
export const normalizeBankTextField = (value: string): string => {
  return value.replace(/[^a-zA-ZÀ-ỹ\s]/g, "");
};

export const toAccountName = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toUpperCase();
};
