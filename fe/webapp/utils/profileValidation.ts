export const validateProfile = (data: {
  fullName?: string;
  phoneNumber?: string;
  gender?: boolean;
  birthdate?: string | null;
  address?: string;
}) => {
  // Bắt buộc nhập họ tên
  if (!data.fullName || data.fullName.trim() === "") {
    return "Vui lòng nhập họ và tên";
  }

  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(data.fullName.trim())) {
    return "Họ tên không được chứa ký tự số và ký tự đặc biệt";
  }
  if (data.fullName.trim().length > 255) {
    return "Họ tên quá dài";
  }

  // Bắt buộc nhập số điện thoại
  if (!data.phoneNumber || data.phoneNumber.trim() === "") {
    return "Vui lòng nhập số điện thoại";
  }

  const phoneRegex = /^0[0-9]{9}$/;
  if (!phoneRegex.test(data.phoneNumber.trim())) {
    return "Số điện thoại phải bắt đầu bằng 0 và gồm đúng 10 chữ số";
  }

  // Bắt buộc nhập địa chỉ
  if (!data.address || data.address.trim() === "") {
    return "Vui lòng nhập địa chỉ";
  }

  const addressRegex = /^[a-zA-ZÀ-ỹ0-9\s,.\-/()]+$/;
  if (!addressRegex.test(data.address.trim())) {
    return "Địa chỉ không được chứa ký tự đặc biệt";
  }
  if (data.address.trim().length > 255) {
    return "Địa chỉ quá dài";
  }

  // Bắt buộc chọn giới tính
  if (data.gender === undefined || data.gender === null) {
    return "Vui lòng chọn giới tính";
  }

  // Bắt buộc nhập ngày sinh
  if (!data.birthdate || data.birthdate.trim() === "") {
    return "Vui lòng nhập ngày sinh";
  }

  const birth = new Date(data.birthdate);
  const now = new Date();

  if (isNaN(birth.getTime())) {
    return "Ngày sinh không hợp lệ";
  }
  if (birth > now) {
    return "Ngày sinh không được ở tương lai";
  }
  if (birth.getFullYear() < 1940) {
    return "Ngày sinh không hợp lệ";
  }

  return null;
};
