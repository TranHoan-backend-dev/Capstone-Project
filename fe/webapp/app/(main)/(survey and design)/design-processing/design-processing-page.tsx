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

  // Pagination riêng cho từng bảng
  const [currentPageOrders, setCurrentPageOrders] = useState(0);
  const [currentPageProcessed, setCurrentPageProcessed] = useState(0);
  const [pageSize] = useState(10);
  const [totalPagesOrders, setTotalPagesOrders] = useState(1);
  const [totalElementsOrders, setTotalElementsOrders] = useState(0);
  const [totalPagesProcessed, setTotalPagesProcessed] = useState(1);
  const [totalElementsProcessed, setTotalElementsProcessed] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch orders to design (status = REGISTRATION_PENDING_FOR_APPROVAL)
  const fetchOrdersToDesign = async () => {
    try {
      const fromStr = formatDateValueToString(from);
      const toStr = formatDateValueToString(to);

      const params = new URLSearchParams({
        page: String(currentPageOrders),
        size: String(pageSize),
        status: "REGISTRATION_PENDING_FOR_APPROVAL", // Thêm status param
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
        console.error("Fetch orders failed", res.status);
        return;
      }

      const json = await res.json();
      const result = json?.data;
      const items = result?.content ?? [];

      const orders: DesignProcessingItem[] = items.map(
        (item: NewInstallationLookupResponse) => ({
          id: item.formCode,
          formNumber: item.formNumber,
          customerName: item.customerName,
          phoneNumber: item.phoneNumber,
          address: item.address,
          registrationAt: formatDate1(item.registrationAt),
          scheduleSurveyAt: formatDate1(item.scheduleSurveyAt),
          status: "processing",
        }),
      );

      setOrdersToDesign(orders);
      setTotalPagesOrders(result?.page?.totalPages ?? 1);
      setTotalElementsOrders(result?.page?.totalElements ?? 0);
    } catch (error) {
      console.error(error);
      setOrdersToDesign([]);
      setTotalPagesOrders(1);
      setTotalElementsOrders(0);
    }
  };

  // Fetch processed designs (status = REGISTRATION_APPROVED)
  const fetchProcessedDesigns = async () => {
    try {
      const fromStr = formatDateValueToString(from);
      const toStr = formatDateValueToString(to);

      const params = new URLSearchParams({
        page: String(currentPageProcessed),
        size: String(pageSize),
        status: "REGISTRATION_APPROVED", // Thêm status param
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
        console.error("Fetch processed failed", res.status);
        return;
      }

      const json = await res.json();
      const result = json?.data;
      const items = result?.content ?? [];

      const processed: DesignProcessingItem[] = items.map(
        (item: NewInstallationLookupResponse) => ({
          id: item.formCode,
          formNumber: item.formNumber,
          customerName: item.customerName,
          phoneNumber: item.phoneNumber,
          address: item.address,
          registrationAt: formatDate1(item.registrationAt),
          scheduleSurveyAt: formatDate1(item.scheduleSurveyAt),
          status: "paid",
        }),
      );

      setProcessedDesigns(processed);
      setTotalPagesProcessed(result?.page?.totalPages ?? 1);
      setTotalElementsProcessed(result?.page?.totalElements ?? 0);
    } catch (error) {
      console.error(error);
      setProcessedDesigns([]);
      setTotalPagesProcessed(1);
      setTotalElementsProcessed(0);
    }
  };

  // Fetch all data
  useEffect(() => {
    setLoading(true);

    const fetchAllData = async () => {
      await Promise.all([fetchOrdersToDesign(), fetchProcessedDesigns()]);
      setLoading(false);
    };

    fetchAllData();
  }, [currentPageOrders, currentPageProcessed, searchQuery, from, to]);

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
    setCurrentPageOrders(0);
    setCurrentPageProcessed(0);
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
          page={currentPageOrders + 1}
          totalElements={totalElementsOrders}
          totalPages={totalPagesOrders}
          onPageChange={(p) => setCurrentPageOrders(p - 1)}
          onApprove={handleApprove}
        />
        <ProcessedDesignsTable
          data={processedDesigns}
          page={currentPageProcessed + 1}
          totalElements={totalElementsProcessed}
          totalPages={totalPagesProcessed}
          onPageChange={(p) => setCurrentPageProcessed(p - 1)}
          onReject={handleReject}
        />
      </div>
    </>
  );
};

export default DesignProcessingPage;
