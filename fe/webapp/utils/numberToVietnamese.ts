export const numberToVietnamese = (num: number): string => {
  const units = [
    "",
    "Một",
    "Hai",
    "Ba",
    "Bốn",
    "Năm",
    "Sáu",
    "Bảy",
    "Tám",
    "Chín",
  ];
  const scales = ["", "Nghìn", "Triệu", "Tỷ"];

  if (num === 0) return "Không Đồng";

  const readBlock = (n: number) => {
    let str = "";
    const hundred = Math.floor(n / 100);
    const ten = Math.floor((n % 100) / 10);
    const unit = n % 10;

    if (hundred > 0) str += units[hundred] + " Trăm ";

    if (ten > 1) {
      str += units[ten] + " Mươi ";
      if (unit === 1) str += "Mốt";
      else if (unit === 5) str += "Lăm";
      else if (unit > 0) str += units[unit];
    } else if (ten === 1) {
      str += "Mười ";
      if (unit === 5) str += "Lăm";
      else if (unit > 0) str += units[unit];
    } else if (unit > 0) {
      str += hundred > 0 ? "Lẻ " + units[unit] : units[unit];
    }

    return str.trim();
  };

  let result = "";
  let scaleIndex = 0;

  while (num > 0) {
    const block = num % 1000;
    if (block > 0) {
      result = readBlock(block) + " " + scales[scaleIndex] + " " + result;
    }
    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return `${result.trim()} Đồng`;
};
