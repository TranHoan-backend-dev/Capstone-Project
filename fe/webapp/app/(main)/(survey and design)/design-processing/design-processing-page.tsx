"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Spinner, DateValue } from "@heroui/react";
import { ActionsSection } from "./components/actions-section";
import { OrdersToDesignTable } from "./components/orders-to-design-table";
import { ProcessedDesignsTable } from "./components/processed-designs-table";
import { WaitingInputTable } from "./components/waiting-input-table";
import { FilterSection } from "@/components/ui/FilterSection";
import {
  DesignProcessingItem,
  DesignProcessingStatus,
  NewInstallationLookupResponse,
} from "@/types";
import { authFetch } from "@/utils/authFetch";
import { formatDate1 } from "@/utils/format";
import { CallToast } from "@/components/ui/CallToast";

const DesignProcessingPage = () => {
  const [keyword, setKeyword] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await authFetch("/api/construction/installation-forms");
        const json = await res.json();

        const items = json?.data?.content ?? [];

        const orders: DesignProcessingItem[] = [];
        const processed: DesignProcessingItem[] = [];
        const waiting: DesignProcessingItem[] = [];

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
            status: "processing", // default
          };

          if (regStatus === "PENDING_FOR_APPROVAL") {
            mapped.status = "processing";
            orders.push(mapped);
          } else if (regStatus === "APPROVED") {
            mapped.status = "paid";
            processed.push(mapped);
          } else if (regStatus === "REJECTED") {
            mapped.status = "rejected";
            waiting.push(mapped);
          }
        });

        setOrdersToDesign(orders);
        setProcessedDesigns(processed);
        setWaitingInput(waiting);
      } catch (err: any) {
        CallToast({
          title: "Lỗi",
          message: err.message || "Có lỗi xảy ra",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredOrders = useMemo(
    () =>
      ordersToDesign.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.formNumber.includes(searchQuery),
      ),
    [ordersToDesign, searchQuery],
  );

  const filteredProcessed = useMemo(
    () =>
      processedDesigns.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.formNumber.includes(searchQuery),
      ),
    [processedDesigns, searchQuery],
  );

  const filteredWaiting = useMemo(
    () =>
      waitingInput.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.formNumber.includes(searchQuery),
      ),
    [waitingInput, searchQuery],
  );
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
        title="Tra cứu đơn"
        to={to}
        onSearch={handleSearch}
      />

      <div className="space-y-8">
        <OrdersToDesignTable data={filteredOrders} onApprove={handleApprove} />
        <ProcessedDesignsTable
          data={filteredProcessed}
          onReject={handleReject}
        />
        <WaitingInputTable data={filteredWaiting} onRestore={handleRestore} />
      </div>
    </>
  );
};

export default DesignProcessingPage;
