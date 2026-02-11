"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";
import { FilterSection } from "@/components/ui/FilterSection";
import { AccessRightsTable } from "./components/access-rights-table";

const AccessRightsPage = () => {
  return (
    <>
      <AccessRightsTable />
    </>
  );
};

export default AccessRightsPage;
