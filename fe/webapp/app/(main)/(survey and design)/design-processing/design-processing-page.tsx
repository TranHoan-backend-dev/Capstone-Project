"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner, DateValue } from "@heroui/react";
import { ActionsSection } from "./components/actions-section";
import { OrdersToDesignTable } from "./components/orders-to-design-table";
import { ProcessedDesignsTable } from "./components/processed-designs-table";
import { WaitingInputTable } from "./components/waiting-input-table";
import { FilterSection } from "./components/filter-section";
import {
  DesignProcessingItem,
  DesignProcessingStatus,
  NewInstallationLookupResponse,
} from "@/types";
import { authFetch } from "@/utils/authFetch";
import {
  formatDate1,
  formatDate2,
  formatDateValueToString,
} from "@/utils/format";
import { CallToast } from "@/components/ui/CallToast";

const DesignProcessingPage = () => {
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const [ordersToDesign, setOrdersToDesign] = useState<DesignProcessingItem[]>(
    [],
  );
  const [processedDesigns, setProcessedDesigns] = useState<
    DesignProcessingItem[]
  >([]);
  const [waitingInput, setWaitingInput] = useState<DesignProcessingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const fromStr = formatDateValueToString(from);
        const toStr = formatDateValueToString(to);

        const params = new URLSearchParams({
          page: String(currentPage),
          size: String(pageSize),
        });

        if (searchQuery?.trim()) {
          params.append("keyword", searchQuery.trim());
        }

        if (fromStr) {
          params.append("from", fromStr);
        }

        if (toStr) {
          params.append("to", toStr);
        }

        const res = await authFetch(
          `/api/construction/installation-forms?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const result = json?.data;

        const items = result?.content ?? [];

        const orders: DesignProcessingItem[] = [];
        const processed: DesignProcessingItem[] = [];

        items.forEach((item: NewInstallationLookupResponse) => {
          const regStatus = item.status?.registration?.toUpperCase();

          const mapped: DesignProcessingItem = {
            id: item.formCode,
            formNumber: item.formNumber,
            customerName: item.customerName,
            phoneNumber: item.phoneNumber,
            address: item.address,
            registrationAt: formatDate1(item.registrationAt),
            scheduleSurveyAt: formatDate1(item.scheduleSurveyAt),
            status: "processing",
          };

          if (regStatus === "PENDING_FOR_APPROVAL") {
            orders.push({ ...mapped, status: "processing" });
          } else if (regStatus === "APPROVED") {
            processed.push({ ...mapped, status: "paid" });
          }
        });

        setOrdersToDesign(orders);
        setProcessedDesigns(processed);

        setTotalPages(result?.page?.totalPages ?? 1);
        setTotalElements(result?.page?.totalElements ?? 0);
      } catch (error) {
        console.error(error);
        setOrdersToDesign([]);
        setProcessedDesigns([]);
        setTotalPages(1);
        setTotalElements(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, searchQuery, from, to]);

  const handleApprove = (order: DesignProcessingItem) => {
    setOrdersToDesign((prev) => prev.filter((i) => i.id !== order.id));
    setProcessedDesigns((prev) => [...prev, order]);
  };

  const handleReject = (design: DesignProcessingItem) => {
    setProcessedDesigns((prev) => prev.filter((i) => i.id !== design.id));
    setWaitingInput((prev) => [...prev, { ...design, status: "rejected" }]);
  };

  const handleRestore = (item: DesignProcessingItem) => {
    setWaitingInput((prev) => prev.filter((i) => i.id !== item.id));
    setOrdersToDesign((prev) => [...prev, { ...item, status: "processing" }]);
  };

  const handleSearch = () => {
    setSearchQuery(keyword);
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spinner size="lg" label="Đang tải dữ liệu..." />
      </div>
    );
  }
  return (
    <>
      {/* <ActionsSection /> */}
      <FilterSection
        from={from}
        keyword={keyword}
        setFromAction={setFrom}
        setKeywordAction={setKeyword}
        setToAction={setTo}
        to={to}
        onSearch={handleSearch}
      />

      <div className="space-y-8">
        <OrdersToDesignTable
          data={ordersToDesign}
          page={currentPage + 1}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p - 1)}
          onApprove={handleApprove}
        />
        <ProcessedDesignsTable
          data={processedDesigns}
          page={currentPage + 1}
          totalElements={totalElements}
          totalPages={totalPages}
          onPageChange={(p) => setCurrentPage(p - 1)}
          onReject={handleReject}
        />
        {/* <WaitingInputTable data={filteredWaiting} onRestore={handleRestore} /> */}
      </div>
    </>
  );
};

export default DesignProcessingPage;
