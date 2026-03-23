"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Tab, Tabs, Chip, DateValue } from "@heroui/react";

import { ApprovalInputSection } from "./components/approval-input-section";
import { EstimateTable, EstimateOrder } from "./components/estimate-table";

import { FilterSection } from "@/components/ui/FilterSection";

const EstimateApprovalPage = () => {
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  const [approvalDate, setApprovalDate] = useState<
    DateValue | null | undefined
  >(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");

  const mapStatus = (status: string): "pending" | "approved" | "rejected" => {
    switch (status) {
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "pending";
    }
  };

  const [orders, setOrders] = useState<EstimateOrder[]>([]);
  const [data, setData] = useState<EstimateOrder[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
        });
        const res = await fetch(
          `/api/construction/estimates?${params.toString()}`,
        );
        const json = await res.json();

        const items = json?.data?.content ?? [];

        const mapped: EstimateOrder[] = await Promise.all(
          items.map(async (item: any, index: number) => {
            const info = item.generalInformation;
            const form = info.installationFormId;

            let creatorName = info.createBy;

            try {
              const res = await fetch(
                `/api/auth/employees/${info.createBy}/name`,
              );
              const nameJson = await res.json();
              creatorName = nameJson?.data || info.createBy;
            } catch (e) {
              console.error("Fetch employee name failed");
            }

            return {
              stt: (page - 1) * pageSize + index + 1,
              id: info.estimationId,
              code: form?.formNumber,
              designProfileName: info.customerName,
              phone: item.phoneNumber,
              installationAddress: info.address,
              totalAmount: "0",
              createdDate: new Date(info.createdAt).toLocaleDateString("vi-VN"),
              creator: creatorName,
              status: mapStatus(item.status?.estimate),
            };
          }),
        );

        setOrders(mapped);
        setTotalPages(json?.data?.totalPages ?? 1);
        setTotalItems(json?.data?.totalElements ?? 0);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, sort]);

  const filteredOrders = useMemo(() => {
    let filtered = orders;
    if (activeTab === "pending") {
      filtered = filtered.filter((o) => o.status === "pending");
    } else {
      filtered = filtered.filter((o) => o.status === "approved");
    }
    if (keyword) {
      const lowerK = keyword.toLowerCase();

      filtered = filtered.filter(
        (o) =>
          o.code.toLowerCase().includes(lowerK) ||
          o.designProfileName.toLowerCase().includes(lowerK) ||
          o.phone.toLowerCase().includes(lowerK),
      );
    }

    return filtered;
  }, [orders, activeTab, keyword]);

  const handleSearch = (query: string) => {
    setKeyword(query);
  };

  const handleApprove = (item: EstimateOrder) => {
    console.log("Approve", item);
  };

  const handleReject = (item: EstimateOrder) => {
    console.log("Reject", item);
  };

  const handleEstimate = (item: EstimateOrder) => {
    console.log("Estimate", item);
  };

  const handleView = (item: EstimateOrder) => {
    console.log("View", item);
  };

  return (
    <>
      <FilterSection
        actions={<></>}
        from={from}
        keyword={keyword}
        setFromAction={setFrom}
        setKeywordAction={setKeyword}
        setToAction={setTo}
        title="Bộ lọc tìm kiếm"
        to={to}
        onSearch={handleSearch}
      />

      <ApprovalInputSection
        approvalDate={approvalDate}
        approvalNote={approvalNote}
        setApprovalDateAction={setApprovalDate}
        setApprovalNoteAction={setApprovalNote}
      />

      <Tabs
        aria-label="Options"
        classNames={{
          cursor: activeTab === "pending" ? "bg-yellow-500" : "bg-green-500",
          tab: "max-w-fit px-6 h-12",
          tabContent: `group-data-[selected=true]:text-blue-600 font-medium text-black dark:text-white dark:group-data-[selected=true]:text-yellow-300`,
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
        }}
        color="primary"
        selectedKey={activeTab}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab
          key="pending"
          title={
            <div className="flex items-center space-x-2">
              <span>Chờ duyệt</span>
              <Chip color="warning" size="sm" variant="flat">
                12
              </Chip>
            </div>
          }
        >
          <EstimateTable
            activeTab="pending"
            data={filteredOrders}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            onApproveAction={handleApprove}
            onEstimateAction={handleEstimate}
            onRejectAction={handleReject}
            onViewAction={handleView}
          />
        </Tab>
        <Tab
          key="approved"
          title={
            <div className="flex items-center space-x-2">
              <span>Đã duyệt</span>
              <Chip color="success" size="sm" variant="flat">
                45
              </Chip>
            </div>
          }
        >
          <EstimateTable
            activeTab="approved"
            data={filteredOrders}
            loading={loading}
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            onPageChange={setPage}
            onApproveAction={handleApprove}
            onEstimateAction={handleEstimate}
            onRejectAction={handleReject}
            onViewAction={handleView}
          />
        </Tab>
      </Tabs>
    </>
  );
};

export default EstimateApprovalPage;
