"use client";

import React, { useState } from "react";
import { AccessRightsTable } from "./components/access-rights-table";
import { FilterSection } from "./components/filter-section";

const AccessRightsPage = () => {
  const [username, setUsername] = useState("");
  return (
    <>
      <FilterSection username={username}
        onSearch={setUsername}/>
      <AccessRightsTable username={username}/>
    </>
  );
};

export default AccessRightsPage;
