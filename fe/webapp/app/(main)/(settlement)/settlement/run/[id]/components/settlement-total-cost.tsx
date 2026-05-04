"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EstimateResponse, MaterialEstimateItem } from "@/types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import CustomButton from "@/components/ui/custom/CustomButton";

interface CostBreakdown {
  directCosts: {
    material: number; 
    labor: number; 
    total: number; 
  };
  generalCost: number; 
  preTaxIncome: number; 
  constructionCostBeforeTax: number; 
  vat: number; 
  constructionCostAfterTax: number; 
  consultingCosts: {
    designAndEstimate: number; 
    surveyLabor: number; 
    installation: number; 
    total: number; 
  };
  otherCosts: {
    printing: number; 
    total: number; 
  };
  grandTotal: number; 
  roundedGrandTotal: number; 
}

interface SettlementTotalCostProps {
  estimateData: any | null; // Use any to bypass TS issues if needed, or EstimateResponse
  materials: MaterialEstimateItem[];
  onTotalChange?: (roundedTotal: number) => void;
}

export const SettlementTotalCost = ({
  estimateData,
  materials,
  onTotalChange,
}: SettlementTotalCostProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const costBreakdown = useMemo<CostBreakdown | null>(() => {
    if (!estimateData?.generalInformation) return null;

    const generalInfo = estimateData.generalInformation;

    // Lấy các hệ số (chuyển từ % sang số thập phân)
    const generalCostCoefficient = (generalInfo.generalCostCoefficient || 0) / 100;
    const precalculatedTaxCoefficient = (generalInfo.precalculatedTaxCoefficient || 0) / 100;
    const vatCoefficient = (generalInfo.vatCoefficient || 0) / 100;

    // Lấy các phí cố định
    const contractFee = generalInfo.contractFee || 0;
    const surveyFee = generalInfo.surveyFee || 0;
    const installationFee = generalInfo.installationFee || 0;
    const designFee = generalInfo.designFee || 0;

    // Tính VL và NC từ materials thực tế của quyết toán
    const materialCost = materials.reduce((sum, item) => sum + (item.materialTotal || 0), 0);
    const laborCoefficient = (generalInfo.laborCoefficient || 0) / 100;
    const laborCost = materials.reduce((sum, item) => sum + (item.laborTotal || 0), 0) * (1 + laborCoefficient);

    // A - CHI PHÍ XÂY DỰNG
    const directTotal = materialCost + laborCost; 
    const generalCost = directTotal * generalCostCoefficient;
    const preTaxIncome = (directTotal + generalCost) * precalculatedTaxCoefficient;
    const constructionCostBeforeTax = directTotal + generalCost + preTaxIncome;
    const vat = constructionCostBeforeTax * vatCoefficient;
    const constructionCostAfterTax = constructionCostBeforeTax + vat;

    // B - CHI PHÍ TƯ VẤN XÂY DỰNG
    const designAndEstimate = (generalInfo.designFee || 0) * (1 + (generalInfo.designCoefficient || 0) / 100);
    const surveyLaborCost = (generalInfo.surveyEffort || 0) * (generalInfo.surveyFee || 0);
    const installationCost = generalInfo.installationFee || 0;
    const consultingTotal = designAndEstimate + surveyLaborCost + installationCost;

    // C - CHI PHÍ KHÁC
    const printingCost = contractFee || 0;
    const otherTotal = printingCost;

    const grandTotal = constructionCostAfterTax + consultingTotal + otherTotal;
    const roundedGrandTotal = Math.round(grandTotal / 100) * 100;

    return {
      directCosts: {
        material: materialCost,
        labor: laborCost,
        total: directTotal,
      },
      generalCost,
      preTaxIncome,
      constructionCostBeforeTax,
      vat,
      constructionCostAfterTax,
      consultingCosts: {
        designAndEstimate,
        surveyLabor: surveyLaborCost,
        installation: installationCost,
        total: consultingTotal,
      },
      otherCosts: {
        printing: printingCost,
        total: otherTotal,
      },
      grandTotal,
      roundedGrandTotal,
    };
  }, [estimateData, materials]);

  useEffect(() => {
    if (costBreakdown && onTotalChange) {
      onTotalChange(costBreakdown.roundedGrandTotal);
    }
  }, [costBreakdown?.roundedGrandTotal]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("vi-VN").format(Math.round(value));
  };

  if (!costBreakdown) {
    return (
      <div className="p-4 bg-default-50 rounded-lg text-center text-default-500">
        Chưa có dữ liệu dự toán gốc để tính toán chi phí
      </div>
    );
  }

  return (
    <div className="mt-6 border border-divider rounded-lg overflow-hidden">
      <div
        className="flex items-center justify-between p-4 bg-default-100 cursor-pointer hover:bg-default-200 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold">
            TỔNG CHI PHÍ QUYẾT TOÁN CÔNG TRÌNH
          </h3>
          <span className="font-bold text-lg text-black-500">
            ({formatCurrency(costBreakdown.roundedGrandTotal)})
          </span>
        </div>
        <CustomButton
          isIconOnly
          size="lg"
          variant="light"
          onPress={() => setIsExpanded(!isExpanded)}
          className="min-w-unit-8 w-8 h-8"
        >
          {isExpanded ? (
            <ChevronUpIcon className="w-4 h-4" />
          ) : (
            <ChevronDownIcon className="w-4 h-4" />
          )}
        </CustomButton>
      </div>

      {isExpanded && (
        <table className="w-full text-sm">
          <thead className="bg-default-100">
            <tr>
              <th className="px-4 py-3 text-left font-semibold w-1/3">Khoản mục</th>
              <th className="px-4 py-3 text-right font-semibold w-1/3">Công thức</th>
              <th className="px-4 py-3 text-right font-semibold w-1/3">Thành tiền (VND)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-divider">
            <tr className="bg-default-50">
              <td colSpan={3} className="px-4 py-2 font-bold">A - CHI PHÍ XÂY DỰNG</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">I - Chi phí trực tiếp</td>
              <td className="px-4 py-2 text-right">T</td>
              <td className="px-4 py-2 text-right"></td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-12">1. Chi phí vật liệu</td>
              <td className="px-4 py-2 text-right">VL</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.directCosts.material)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-12">2. Chi phí nhân công</td>
              <td className="px-4 py-2 text-right">NC = Σ(NC₀) × (1 + {estimateData?.generalInformation?.laborCoefficient || 0}%)</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.directCosts.labor)}</td>
            </tr>
            <tr className="border-t border-divider">
              <td className="px-4 py-2 pl-8 font-medium">Cộng chi phí trực tiếp</td>
              <td className="px-4 py-2 text-right">T = VL + NC</td>
              <td className="px-4 py-2 text-right font-mono font-medium">{formatCurrency(costBreakdown.directCosts.total)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">II - Chi phí chung</td>
              <td className="px-4 py-2 text-right">C = T * {estimateData?.generalInformation?.generalCostCoefficient || 0}%</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.generalCost)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">III - Thu nhập thuế tính trước</td>
              <td className="px-4 py-2 text-right">TL = (T + C) * {estimateData?.generalInformation?.precalculatedTaxCoefficient || 0}%</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.preTaxIncome)}</td>
            </tr>
            <tr className="bg-default-50">
              <td className="px-4 py-2 pl-8 font-medium">Chi phí xây dựng trước thuế</td>
              <td className="px-4 py-2 text-right">G = T + C + TL</td>
              <td className="px-4 py-2 text-right font-mono font-medium">{formatCurrency(costBreakdown.constructionCostBeforeTax)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">IV - Thuế giá trị gia tăng đầu ra</td>
              <td className="px-4 py-2 text-right">GTGT = G * {estimateData?.generalInformation?.vatCoefficient || 0}%</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.vat)}</td>
            </tr>
            <tr className="bg-default-50">
              <td className="px-4 py-2 pl-8 font-bold">Chi phí xây dựng sau thuế</td>
              <td className="px-4 py-2 text-right">GXD = G + GTGT</td>
              <td className="px-4 py-2 text-right font-mono font-bold">{formatCurrency(costBreakdown.constructionCostAfterTax)}</td>
            </tr>

            <tr className="bg-default-50">
              <td colSpan={3} className="px-4 py-2 font-bold">B - CHI PHÍ TƯ VẤN XÂY DỰNG</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">1. Chi phí thiết kế & lắp dự toán</td>
              <td className="px-4 py-2 text-right">TK = Phí thiết kế × (1 + Hệ số thiết kế)</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.consultingCosts.designAndEstimate)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">2. Nhân công khảo sát, đo đạc thực tế</td>
              <td className="px-4 py-2 text-right">GK = {estimateData?.generalInformation?.surveyEffort || 0} ngày công × {formatNumber(estimateData?.generalInformation?.surveyFee || 0)} VND/ngày</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.consultingCosts.surveyLabor)}</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">3. Chi phí lắp đặt</td>
              <td className="px-4 py-2 text-right">LD = Phí lắp đặt</td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.consultingCosts.installation)}</td>
            </tr>
            <tr className="bg-default-50">
              <td className="px-4 py-2 pl-8 font-medium">Tổng chi phí tư vấn</td>
              <td className="px-4 py-2 text-right">GTV = TK + GK + LD</td>
              <td className="px-4 py-2 text-right font-mono font-medium">{formatCurrency(costBreakdown.consultingCosts.total)}</td>
            </tr>

            <tr className="bg-default-50">
              <td colSpan={3} className="px-4 py-2 font-bold">C - CHI PHÍ KHÁC</td>
            </tr>
            <tr>
              <td className="px-4 py-2 pl-8">1. Chi phí in ấn hợp đồng (đã bao gồm VAT)</td>
              <td className="px-4 py-2 text-right"></td>
              <td className="px-4 py-2 text-right font-mono">{formatCurrency(costBreakdown.otherCosts.printing)}</td>
            </tr>
            <tr className="bg-default-50">
              <td className="px-4 py-2 pl-8 font-medium">Tổng chi phí khác</td>
              <td className="px-4 py-2 text-right">GK</td>
              <td className="px-4 py-2 text-right font-mono font-medium">{formatCurrency(costBreakdown.otherCosts.total)}</td>
            </tr>

            <tr className="bg-primary-50 border-t-2 border-black-200">
              <td className="px-4 py-3 pl-8 font-bold text-black-900">TỔNG CHI PHÍ QUYẾT TOÁN CÔNG TRÌNH</td>
              <td className="px-4 py-3 text-right font-bold">GXD + GTV + GK</td>
              <td className="px-4 py-3 text-right font-mono font-bold text-black-900 text-lg">
                {formatCurrency(costBreakdown.grandTotal)}
              </td>
            </tr>

            <tr className="bg-default-100">
              <td className="px-4 py-2 pl-8 font-medium">Làm tròn</td>
              <td className="px-4 py-2 text-right"></td>
              <td className="px-4 py-2 text-right font-mono font-medium">{formatCurrency(costBreakdown.roundedGrandTotal)}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
