"use client";

import React from "react";
import { TechnicalInfoCard } from "./components/technical-info-card";
import { MaterialCostCard } from "./components/material-cost-card";

const RunEstimationPage = () => {
    return (
        <>
            <TechnicalInfoCard />
            <MaterialCostCard />
        </>
    );
};

export default RunEstimationPage;