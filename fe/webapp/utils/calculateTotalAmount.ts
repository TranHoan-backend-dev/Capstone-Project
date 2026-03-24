export const calculateTotalAmount = (materials: any[]): string => {
  if (!materials || materials.length === 0) return "0";

  const total = materials.reduce((sum, item) => {
    const materialTotal = parseFloat(item.totalMaterialPrice ?? 0) || 0;
    const laborTotal = parseFloat(item.totalLaborPrice ?? 0) || 0;
    return sum + materialTotal + laborTotal;
  }, 0);

  return total.toLocaleString("vi-VN");
};
