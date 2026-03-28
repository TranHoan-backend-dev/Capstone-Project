// Mock data generator for survey and design reports

const mockNames = [
  "Nguyễn Văn An",
  "Trần Thị Bình",
  "Phạm Văn Công",
  "Hoàng Thị Dung",
  "Đỗ Văn Ðức",
  "Bùi Thị Hoa",
  "Vũ Văn Hùng",
  "Dương Thị Khánh",
  "Lê Văn Long",
  "Cao Thị Mai",
  "Tạ Văn Nam",
  "Đặng Thị Nhi",
  "Phan Văn Phong",
  "Quách Thị Quỳnh",
  "Sơn Văn Sơn",
  "Tô Thị Thu",
  "Ứng Văn Ứng",
  "Vũ Thị Vân",
  "Xây Văn Xuyên",
  "Yên Thị Yên",
];

const mockAddresses = [
  "123 Đường Trần Hưng Đạo, Thành phố Nam Định",
  "456 Phố Quán Tháo, Thành phố Nam Định",
  "789 Đường Tôn Đức Thắng, Thành phố Nam Định",
  "321 Phố Nông Cống, Thành phố Nam Định",
  "654 Đường Hùng Vương, Thành phố Nam Định",
  "987 Phố Quang Trung, Thành phố Nam Định",
  "111 Đường Lê Lợi, Thành phố Nam Định",
  "222 Phố Bạch Đằng, Thành phố Nam Định",
  "333 Đường Hồ Tùng Mậu, Thành phố Nam Định",
  "444 Phố Trần Phú, Thành phố Nam Định",
  "555 Đường Viết Khoa, Thành phố Nam Định",
  "666 Phố Trần Nhân Tông, Thành phố Nam Định",
  "777 Đường Giải Phóng, Thành phố Nam Định",
  "888 Phố Phan Thúc Duyên, Thành phố Nam Định",
  "999 Đường Thái Thịnh, Thành phố Nam Định",
  "101 Phố Thanh Nê, Thành phố Nam Định",
  "202 Đường Hàng Đào, Thành phố Nam Định",
  "303 Phố Hàng Bông, Thành phố Nam Định",
  "404 Đường Hàng Gà, Thành phố Nam Định",
  "505 Phố Hàng Dầu, Thành phố Nam Định",
];

const mockPhones = [
  "0901234567",
  "0912345678",
  "0923456789",
  "0934567890",
  "0945678901",
  "0956789012",
  "0967890123",
  "0978901234",
  "0989012345",
  "0990123456",
  "0911234567",
  "0922345678",
  "0933456789",
  "0944567890",
  "0955678901",
  "0966789012",
  "0977890123",
  "0988901234",
  "0999012345",
  "0910123456",
];

const mockOrderNumbers = Array.from({ length: 20 }, (_, i) => `ĐH${String(i + 1).padStart(6, "0")}`);

const mockEmployees = [
  "Tô Văn Thanh",
  "Lý Tuấn Kiệt",
  "Ngô Thanh Vân",
  "Chu Huy Hùng",
  "Trần Dần",
  "Lê Anh Tuấn",
  "Đặng Cường",
  "Bùi Khắc Huy",
  "Vũ Thanh Hùng",
  "Phạm Bình",
];

const purposeOfUse = [
  "Sinh hoạt",
  "Cơ quan, hành chính sự nghiệp",
  "Sản xuất",
  "Kinh doanh dịch vụ",
  "Sinh hoạt",
  "Cơ quan, hành chính sự nghiệp",
  "Sản xuất",
  "Kinh doanh dịch vụ",
  "Sinh hoạt",
  "Kinh doanh dịch vụ",
];

const notes = [
  "Chờ xét duyệt",
  "Đang xử lý",
  "Cần bổ sung tài liệu",
  "Phê duyệt",
  "Từ chối",
  "Tạm dừng",
  "Chốt duyệt",
  "Sắp duyệt",
  "Tạm dừng xét duyệt",
  "Chờ bổ sung",
];

const surveyContent = [
  "Kiểm tra đường ống",
  "Đánh giá nhu cầu",
  "Rà soát pháp lý",
  "Kiểm tra địa chính",
  "Lập phương án kỹ thuật",
  "Tham khảo ý kiến cộng đồng",
  "Kiểm tra kỹ thuật",
  "Lập báo cáo sơ bộ",
  "Rà soát tài chính",
  "Phê duyệt sơ bộ",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate(startDate: Date, endDate: Date): string {
  const time = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  const date = new Date(time);
  return date.toLocaleDateString("vi-VN");
}

// Helper: Lấy ngày random trong khoảng
function getRandomDateInRange(startDate: Date, endDate: Date): Date {
  const time = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(time);
}

// Helper: Lấy ngày sau một ngày nhất định (cách 1-30 ngày)
function getDateAfter(baseDate: Date, maxDaysAfter: number = 30): Date {
  const daysAfter = Math.floor(Math.random() * maxDaysAfter) + 1;
  const newDate = new Date(baseDate);
  newDate.setDate(newDate.getDate() + daysAfter);
  return newDate;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("vi-VN");
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export const generateMockDataWaitingBudgetApproval = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayLap = getDateAfter(ngayDK, 15); // Lập sau đăng ký 1-15 ngày
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      ngayDK: formatDate(ngayDK),
      ngayLap: formatDate(ngayLap),
      tongTien: formatCurrency(Math.random() * 4500000 + 500000), // 500k - 5 triệu VNĐ
      nvLap: getRandomItem(mockEmployees),
    };
  });
};

export const generateMockDataWaitingBudget = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayHenKS = getDateAfter(ngayDK, 10); // Hẹn khảo sát 1-10 ngày sau đăng ký
    const ngayDuyetKS = getDateAfter(ngayHenKS, 15); // Duyệt khảo sát 1-15 ngày sau hẹn
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      ngayDK: formatDate(ngayDK),
      ngayHenKS: formatDate(ngayHenKS),
      ngayDuyetKS: formatDate(ngayDuyetKS),
      ghiChu: getRandomItem(notes),
    };
  });
};

export const generateMockDataRejectedBudgetApproval = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayLap = getDateAfter(ngayDK, 15); // Lập 1-15 ngày sau đăng ký
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      ngayDK: formatDate(ngayDK),
      ngayLap: formatDate(ngayLap),
      nvLapChietTinh: getRandomItem(mockEmployees),
      ghiChu: getRandomItem(notes),
    };
  });
};

export const generateMockDataReportContract = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayLap = getDateAfter(ngayDK, 20); // Lập 1-20 ngày sau đăng ký
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      ngayDK: formatDate(ngayDK),
      ngayLap: formatDate(ngayLap),
      nvLap: getRandomItem(mockEmployees),
    };
  });
};

export const generateMockDataRejectedDesign = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayLap = getDateAfter(ngayDK, 15); // Khảo sát 1-15 ngày sau đăng ký
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      ngayDK: formatDate(ngayDK),
      ngayLap: formatDate(ngayLap),
      nvLap: getRandomItem(mockEmployees),
      noidungKS: getRandomItem(surveyContent),
    };
  });
};

export const generateMockDataAssignedSurvey = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayHenKS = getDateAfter(ngayDK, 10); // Hẹn khảo sát 1-10 ngày sau đăng ký
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      mucDichSD: getRandomItem(purposeOfUse),
      ngayDK: formatDate(ngayDK),
      ngayHenKS: formatDate(ngayHenKS),
      nhanvienKS: getRandomItem(mockEmployees),
    };
  });
};

export const generateMockDataUnassignedSurvey = (count: number = 20) => {
  const startDate = new Date(2026, 0, 1);
  const endDate = new Date(2026, 2, 24);

  return Array.from({ length: count }, (_, i) => {
    const ngayDK = getRandomDateInRange(startDate, endDate);
    const ngayHenKS = getDateAfter(ngayDK, 10); // Hẹn khảo sát 1-10 ngày sau đăng ký
    
    return {
      stt: i + 1,
      soDon: mockOrderNumbers[i % mockOrderNumbers.length],
      tenKhachHang: mockNames[i % mockNames.length],
      diaChi: mockAddresses[i % mockAddresses.length],
      dienThoai: mockPhones[i % mockPhones.length],
      mucDichSD: getRandomItem(purposeOfUse),
      ngayDK: formatDate(ngayDK),
      ngayHenKS: formatDate(ngayHenKS),
    };
  });
};
