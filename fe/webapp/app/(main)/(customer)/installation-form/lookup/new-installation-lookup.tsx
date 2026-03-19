"use client";

import React, { useState } from "react";
import { DateValue } from "@heroui/react";

import { FormActions } from "./components/form-actions";
import { OrderInfoSection } from "./components/(order-info)/order-info-section";
import { CustomerInfoSection } from "./components/(customer-info)/customer-info-section";
import { AddressContactSection } from "./components/(address-contact)/address-contact-section";
import { RelatedOrdersTable } from "./components/related-orders-table";
import { InvoiceInfoSection } from "./components/invoice-info-section";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { AddNewIcon } from "@/config/chip-and-icon";
import { FilterSection } from "@/components/ui/FilterSection";
import { formatDate2 } from "@/utils/format";

const NewInstallationLookup = () => {
  const [keyword, setKeyword] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywordSearch, setKeywordSearch] = useState("");

  const handleSearch = () => {
    setKeywordSearch(keywordInput);
  };
  return (
    <>
      <FilterSection
        from={from}
        keyword={keywordInput}
        setFromAction={setFrom}
        setKeywordAction={setKeywordInput}
        setToAction={setTo}
        title="Tra cứu đơn"
        to={to}
        onSearch={handleSearch}
      />
      <RelatedOrdersTable
        keyword={keywordSearch}
        reloadKey={reloadKey}
        from={formatDate2(from)}
        to={formatDate2(to)}
      />
    </>
  );
};

export default NewInstallationLookup;
