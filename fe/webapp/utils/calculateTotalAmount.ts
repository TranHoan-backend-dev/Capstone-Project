export const calculateTotalAmount = (
  materials: any[],
  generalInfo?: any,
): string => {
  if (!materials || materials.length === 0) return "0";

  // Tính VL và NC từ materials
  const materialCost = materials.reduce((sum, item) => {
    const materialPrice = parseFloat(
      item.totalMaterialPrice ?? item.materialTotal ?? 0,
    );
    return sum + (isNaN(materialPrice) ? 0 : materialPrice);
  }, 0);

  // Chi phí nhân công gốc từ materials
  const baseLaborCost = materials.reduce((sum, item) => {
    const laborPrice = parseFloat(item.totalLaborPrice ?? item.laborTotal ?? 0);
    return sum + (isNaN(laborPrice) ? 0 : laborPrice);
  }, 0);

  // Áp dụng hệ số nhân công
  const laborCoefficient = (generalInfo?.laborCoefficient || 0) / 100;
  const laborCost = baseLaborCost * (1 + laborCoefficient);

  // A - CHI PHÍ XÂY DỰNG
  const directTotal = materialCost + laborCost; // T

  // Chi phí chung (C) = T * hệ số chi phí chung
  const generalCostCoefficient =
    (generalInfo?.generalCostCoefficient || 0) / 100;
  const generalCost = directTotal * generalCostCoefficient;

  // Thu nhập thuế tính trước (TL) = (T + C) * hệ số thuế tính trước
  const precalculatedTaxCoefficient =
    (generalInfo?.precalculatedTaxCoefficient || 0) / 100;
  const preTaxIncome =
    (directTotal + generalCost) * precalculatedTaxCoefficient;

  // Chi phí xây dựng trước thuế (G) = T + C + TL
  const constructionCostBeforeTax = directTotal + generalCost + preTaxIncome;

  // Thuế GTGT (GTGT) = G * hệ số VAT
  const vatCoefficient = (generalInfo?.vatCoefficient || 0) / 100;
  const vat = constructionCostBeforeTax * vatCoefficient;

  // Chi phí xây dựng sau thuế (GXD) = G + GTGT
  const constructionCostAfterTax = constructionCostBeforeTax + vat;

  // B - CHI PHÍ TƯ VẤN XÂY DỰNG
  // Chi phí thiết kế & lắp dự toán = phí thiết kế * (1 + hệ số thiết kế)
  const designCoefficient = (generalInfo?.designCoefficient || 0) / 100;
  const designAndEstimate =
    (generalInfo?.designFee || 0) * (1 + designCoefficient);

  // Nhân công khảo sát, đo đạc thực tế = ngày công khảo sát * phí khảo sát
  const surveyLaborCost =
    (generalInfo?.surveyEffort || 0) * (generalInfo?.surveyFee || 0);

  // Chi phí lắp đặt
  const installationCost = generalInfo?.installationFee || 0;

  const consultingTotal =
    designAndEstimate + surveyLaborCost + installationCost;

  // C - CHI PHÍ KHÁC
  // Chi phí in ấn hợp đồng
  const printingCost = generalInfo?.contractFee || 0;
  const otherTotal = printingCost;

  // Tổng dự toán xây dựng công trình = GXD + GTV + GK
  const grandTotal = constructionCostAfterTax + consultingTotal + otherTotal;

  // Làm tròn đến hàng trăm
  const roundedGrandTotal = Math.round(grandTotal / 100) * 100;

  return roundedGrandTotal.toLocaleString("vi-VN");
};
