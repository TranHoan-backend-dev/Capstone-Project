"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";
import { FilterSection } from "@/components/ui/FilterSection";
import { BusinessPageTable } from "./components/business-page-table";

const BusinessPage = () => {
  return (
    <>
      <BusinessPageTable />
    </>
  );
};

export default BusinessPage;
