"use client";

import React, { useEffect, useState } from "react";
import { Spinner, DateValue } from "@heroui/react";
import { OrdersToDesignTable } from "./components/orders-to-design-table";
import { ProcessedDesignsTable } from "./components/processed-designs-table";
import { FilterSection } from "./components/filter-section";
import { DesignProcessingItem, NewInstallationLookupResponse } from "@/types";
import { authFetch } from "@/utils/authFetch";
import { formatDate1, formatDateValueToString } from "@/utils/format";
import { useProfile } from "@/hooks/useLogin";

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

  const [currentPageOrders, setCurrentPageOrders] = useState(0);
  const [currentPageProcessed, setCurrentPageProcessed] = useState(0);
  const [pageSize] = useState(10);
  const [totalPagesOrders, setTotalPagesOrders] = useState(1);
  const [totalElementsOrders, setTotalElementsOrders] = useState(0);
  const [totalPagesProcessed, setTotalPagesProcessed] = useState(1);
  const [totalElementsProcessed, setTotalElementsProcessed] = useState(0);

  const [keyword, setKeyword] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { profile, loading: profileLoading, hasRole } = useProfile();
  const isITStaff = hasRole("it_staff");
  const isCompanyLeader = hasRole("company_leadership");
  const isPlanningTechnicalHead = hasRole("planning_technical_department_head");
  const isOrderReceivingStaff = hasRole("order_receiving_staff");
  const isSurveyStaff = hasRole("survey_staff");
  const isConstructionHead = hasRole("construction_department_head");
  const isConstructionStaff = hasRole("construction_department_staff");
  const isFinanceStaff = hasRole("finance_department");
  const canView = isITStaff || isSurveyStaff;

  const fetchInstallationForms = async (params: URLSearchParams) => {
    const res = await authFetch(
      `/api/construction/installation-forms?${params.toString()}`,
    );
    if (res.ok) return res;

    // Fallback: some remote environments 500 when parsing `status` enum.
    if (res.status === 500 && params.has("status")) {
      const retryParams = new URLSearchParams(params);
      retryParams.delete("status");
      return await authFetch(
        `/api/construction/installation-forms?${retryParams.toString()}`,
      );
    }

    return res;
  };

  const fetchOrdersToDesign = async () => {
    try {
      const fromStr = formatDateValueToString(from);
      const toStr = formatDateValueToString(to);

      const params = new URLSearchParams({
        page: String(currentPageOrders),
        size: String(pageSize),
        status: "REGISTRATION_PENDING_FOR_APPROVAL",
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

      const res = await fetchInstallationForms(params);

      if (!res.ok) {
        console.error("Fetch orders failed", res.status);
        return;
      }

      const json = await res.json();
      const result = json?.data;
      const items = result?.content ?? [];

      const filteredItems = params.has("status")
        ? items
        : items.filter(
            (item: NewInstallationLookupResponse) =>
              item?.status?.registration === "PENDING_FOR_APPROVAL",
          );

      const orders: DesignProcessingItem[] = filteredItems.map(
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
      setTotalElementsOrders(
        params.has("status")
          ? (result?.page?.totalElements ?? 0)
          : orders.length,
      );
    } catch (error) {
      console.error(error);
      setOrdersToDesign([]);
      setTotalPagesOrders(1);
      setTotalElementsOrders(0);
    }
  };

  const fetchProcessedDesigns = async () => {
    try {
      const fromStr = formatDateValueToString(from);
      const toStr = formatDateValueToString(to);

      const params = new URLSearchParams({
        page: String(currentPageProcessed),
        size: String(pageSize),
        status: "REGISTRATION_APPROVED",
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

      const res = await fetchInstallationForms(params);

      if (!res.ok) {
        console.error("Fetch processed failed", res.status);
        return;
      }

      const json = await res.json();
      const result = json?.data;
      const items = result?.content ?? [];

      const filteredItems = params.has("status")
        ? items
        : items.filter(
            (item: NewInstallationLookupResponse) =>
              item?.status?.registration === "APPROVED",
          );

      const processed: DesignProcessingItem[] = filteredItems.map(
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
      setTotalElementsProcessed(
        params.has("status")
          ? (result?.page?.totalElements ?? 0)
          : processed.length,
      );
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
  if (!canView) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-2">
            Không có quyền truy cập
          </h2>
          <p className="text-gray-600">
            Bạn không có quyền xem trang này. Vui lòng liên hệ quản trị viên.
          </p>
        </div>
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
