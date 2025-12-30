"use client";

import React from "react";
import { TechnicalInfoCard } from "./technical-info-card";
import { MaterialCostCard } from "./material-cost-card";

const RunEstimation = () => {
    return (
        <>
            <TechnicalInfoCard />
            <MaterialCostCard />
        </>
    );
};

export default RunEstimation;