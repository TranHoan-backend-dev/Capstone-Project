"use client";

import React, { useMemo } from "react";
import { EstimateResponse, MaterialEstimateItem } from "@/types";

interface TotalCostDisplayProps {
  estimateData: EstimateResponse | null;
  materials: MaterialEstimateItem[];
}

export const TotalCostDisplay = ({
  estimateData,
  materials,
}: TotalCostDisplayProps) => {
  const grandTotal = useMemo(() => {
    // Tính tổng từ materials
    const materialTotal = materials.reduce(
      (sum, item) => sum + (item.materialTotal || 0),
      0,
    );
    const laborTotal = materials.reduce(
      (sum, item) => sum + (item.laborTotal || 0),
      0,
    );
    const subtotal = materialTotal + laborTotal;

    // Lấy các hệ số và phí từ generalInformation
    const generalInfo = estimateData?.generalInformation;

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

    // Tổng cộng
    return beforeVAT + beforeVAT * vatCoefficient;
  }, [estimateData, materials]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <div className="flex justify-end items-center gap-4 p-4 bg-default-50 rounded-lg">
      <span className="text-sm font-medium text-default-600">
        Tổng chi phí dự toán:
      </span>
      <span className="text-xl font-bold text-primary">
        {formatCurrency(grandTotal)}
      </span>
    </div>
  );
};
