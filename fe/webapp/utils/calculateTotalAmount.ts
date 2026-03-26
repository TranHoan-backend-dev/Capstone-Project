export const calculateTotalAmount = (materials: any[], generalInfo?: any): string => {
  if (!materials || materials.length === 0) return "0";

  // Tính tổng từ materials
  const materialTotal = materials.reduce((sum, item) => {
    const materialPrice = parseFloat(item.totalMaterialPrice ?? 0) || 0;
    return sum + materialPrice;
  }, 0);

  const laborTotal = materials.reduce((sum, item) => {
    const laborPrice = parseFloat(item.totalLaborPrice ?? 0) || 0;
    return sum + laborPrice;
  }, 0);

  const subtotal = materialTotal + laborTotal;

  // Lấy các hệ số và phí từ generalInformation (nếu có)
  const laborCoefficient = (generalInfo?.laborCoefficient || 0) / 100;
  const generalCostCoefficient =
    (generalInfo?.generalCostCoefficient || 0) / 100;
  const precalculatedTaxCoefficient =
    (generalInfo?.precalculatedTaxCoefficient || 0) / 100;
  const constructionMachineryCoefficient =
    (generalInfo?.constructionMachineryCoefficient || 0) / 100;
  const vatCoefficient = (generalInfo?.vatCoefficient || 0) / 100;
  const designCoefficient = (generalInfo?.designCoefficient || 0) / 100;

  const contractFee = generalInfo?.contractFee || 0;
  const surveyFee = generalInfo?.surveyFee || 0;
  const installationFee = generalInfo?.installationFee || 0;
  const designFee = generalInfo?.designFee || 0;

  // Tính các khoản phí theo hệ số
  const laborCost = subtotal * laborCoefficient;
  const generalCost = subtotal * generalCostCoefficient;
  const precalculatedTax = subtotal * precalculatedTaxCoefficient;
  const constructionMachinery = subtotal * constructionMachineryCoefficient;
  const designCost = subtotal * designCoefficient;

  // Tổng phụ trước VAT
  const beforeVAT =
    subtotal +
    laborCost +
    generalCost +
    precalculatedTax +
    constructionMachinery +
    designCost +
    contractFee +
    surveyFee +
    installationFee +
    designFee;

  // Tổng cộng (bao gồm VAT)
  const grandTotal = beforeVAT + beforeVAT * vatCoefficient;

  // Làm tròn lên đến số nguyên (ví dụ: 986520.61 -> 986521)
  const roundedTotal = Math.ceil(grandTotal);

  return roundedTotal.toLocaleString("vi-VN");
};
