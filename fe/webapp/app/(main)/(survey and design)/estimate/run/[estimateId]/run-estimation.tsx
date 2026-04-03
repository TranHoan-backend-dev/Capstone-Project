"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { TechnicalInfoCard } from "./components/technical-info-card";
import { MaterialCostCard } from "./components/material-cost-card";
import { EstimateResponse, MaterialEstimateItem } from "@/types";
import { TotalCostDisplay } from "./components/total-cost-display ";
import { authFetch } from "@/utils/authFetch";

const RunEstimationPage = () => {
  const params = useParams();
  const estimateId = params.estimateId as string | undefined;
  const [materials, setMaterials] = useState<MaterialEstimateItem[]>([]);
  const [estimateData, setEstimateData] = useState<EstimateResponse | null>(
    null,
  );

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!estimateId) return;
      try {
        const res = await authFetch(`/api/construction/estimates/${estimateId}`);
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
