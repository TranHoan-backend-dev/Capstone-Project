export const validateProfile = (data: {
  fullName?: string;
  phoneNumber?: string;
  gender?: boolean;
  birthdate?: string | null;
  address?: string;
}) => {
  if (data.fullName) {
    const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;

    if (!nameRegex.test(data.fullName)) {
      return "Họ tên không chứa kỹ tự số và ký tự đặc biệt";
    }

    if (data.fullName.length > 255) {
      return "Họ tên quá dài";
    }
  }

  if (data.phoneNumber) {
    const phoneRegex = /^0[0-9]{9}$/;

    if (!phoneRegex.test(data.phoneNumber)) {
      return "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số";
    }
  }

  if (data.birthdate) {
    const birth = new Date(data.birthdate);
    const now = new Date();

    if (birth > now) {
      return "Ngày sinh không được ở tương lai";
    }

    if (birth.getFullYear() < 1940) {
      return "Ngày sinh không hợp lệ";
    }
  }

  return null;
};
