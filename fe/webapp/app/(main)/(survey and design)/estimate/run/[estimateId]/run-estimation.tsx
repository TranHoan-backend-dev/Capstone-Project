"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { TechnicalInfoCard } from "./components/technical-info-card";
import { MaterialCostCard } from "./components/material-cost-card";
import { EstimateResponse, MaterialEstimateItem } from "@/types";
import { TotalCostDisplay } from "./components/total-cost-display ";
import { authFetch } from "@/utils/authFetch";
import { useProfile } from "@/hooks/useLogin";

const RunEstimationPage = () => {
  const params = useParams();
  const estimateId = params.estimateId as string | undefined;
  const [materials, setMaterials] = useState<MaterialEstimateItem[]>([]);
  const [estimateData, setEstimateData] = useState<EstimateResponse | null>(
    null,
  );
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView =
    isITStaff || isSurveyStaff || isCompanyLeader || isPlanningTechnicalHead;
  useEffect(() => {
    const fetchEstimate = async () => {
      if (!estimateId) return;
      try {
        const res = await authFetch(
          `/api/construction/estimates/${estimateId}`,
        );
        if (!res.ok) return;
        const json = await res.json();
        setEstimateData(json.data);
      } catch (error) {
        console.error("Failed to fetch estimate:", error);
      }
    };

    fetchEstimate();
  }, [estimateId]);

  if (!estimateId) return <p>Estimate ID không tồn tại</p>;
  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <TechnicalInfoCard
        estimateData={estimateData}
        setEstimateData={setEstimateData}
        estimateId={estimateId}
        materials={materials}
      />

      <MaterialCostCard
        estimateId={estimateId}
        estimateData={estimateData}
        setEstimateData={setEstimateData}
        materials={materials}
        setMaterials={setMaterials}
      />
      <TotalCostDisplay estimateData={estimateData} materials={materials} />
    </div>
  );
};

export default RunEstimationPage;
