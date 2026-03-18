"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import { TechnicalInfoCard } from "./components/technical-info-card";
import { MaterialCostCard } from "./components/material-cost-card";
import { EstimateResponse } from "@/types";

const RunEstimationPage = () => {
  const params = useParams();
  const estimateId = params.estimateId as string | undefined;

  const [estimateData, setEstimateData] = useState<EstimateResponse | null>(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      if (!estimateId) return; // tránh undefined
      const res = await fetch(`/api/construction/estimates/${estimateId}`);
      if (!res.ok) return;
      const json = await res.json();
      setEstimateData(json.data);
    };

    fetchEstimate();
  }, [estimateId]);

  if (!estimateId) return <p>Estimate ID không tồn tại</p>;

  return (
    <>
      <TechnicalInfoCard
        estimateData={estimateData}
        setEstimateData={setEstimateData}
        estimateId={estimateId} // nếu cần
      />
      <MaterialCostCard />
    </>
  );
};

export default RunEstimationPage;