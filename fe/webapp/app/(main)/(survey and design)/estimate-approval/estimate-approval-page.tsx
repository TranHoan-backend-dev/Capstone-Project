"use client";

import React, { useState, useMemo } from "react";
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

  // Mock Data
  const mockData: EstimateOrder[] = [
    {
      id: 1,
      code: "DT-2024-001",
      designProfileName: "Hệ thống điện mặt trời 5kW\nNguyễn Văn Minh",
      phone: "0912345678",
      installationAddress: "123 Nguyễn Trãi, Q.1, TP.HCM",
      totalAmount: "125,000,000 ₫",
      createdDate: "15/01/2024",
      creator: "Trần Thị B",
      status: "pending",
    },
    {
      id: 2,
      code: "DT-2024-002",
      designProfileName: "Lắp đặt điện năng lượng 10kW\nLê Thị Hoa",
      phone: "0987654321",
      installationAddress: "456 Lê Lợi, Quận 3, TP.HCM",
      totalAmount: "125,000,000 ₫",
      createdDate: "14/01/2024",
      creator: "Lê Văn C",
      status: "pending",
    },
    {
      id: 3,
      code: "DT-2024-003",
      designProfileName: "Hệ thống điện mặt trời 7.5kW\nPhạm Văn Đức",
      phone: "0901234567",
      installationAddress: "789 Cách Mạng Tháng 8, Q.10",
      totalAmount: "125,000,000 ₫",
      createdDate: "13/01/2024",
      creator: "Trần Thị B",
      status: "pending",
    },
    {
      id: 4,
      code: "DT-2024-004",
      designProfileName: "Điện năng lượng mặt trời 3kW\nHoàng Thị Mai",
      phone: "0933445566",
      installationAddress: "234 Võ Văn Tần, Q.3, TP.HCM",
      totalAmount: "78,500,000 ₫",
      createdDate: "12/01/2024",
      creator: "Lê Văn C",
      status: "pending",
    },
    {
      id: 5,
      code: "DT-2024-005",
      designProfileName: "Hệ thống năng lượng 12kW\nVũ Minh Tuấn",
      phone: "0977889900",
      installationAddress: "567 Điện Biên Phủ, Bình Thạnh",
      totalAmount: "125,000,000 ₫",
      createdDate: "11/01/2024",
      creator: "Trần Thị B",
      status: "pending",
    },
    {
      id: 6,
      code: "DT-2024-006",
      designProfileName: "Hệ thống điện mặt trời 20kW\nNguyễn Văn An",
      phone: "0912999888",
      installationAddress: "123 Đường Láng, Hà Nội",
      totalAmount: "250,000,000 ₫",
      createdDate: "10/01/2024",
      creator: "Trần Thị B",
      status: "approved",
    },
    {
      id: 7,
      code: "DT-2024-007",
      designProfileName: "Điện năng lượng 15kW\nPhạm Thị Cúc",
      phone: "0987111222",
      installationAddress: "456 Cầu Giấy, Hà Nội",
      totalAmount: "180,000,000 ₫",
      createdDate: "09/01/2024",
      creator: "Lê Văn C",
      status: "approved",
    },
  ];

  const [orders, setOrders] = useState<EstimateOrder[]>(mockData);

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    // Filter by tab
    if (activeTab === "pending") {
      filtered = filtered.filter((o) => o.status === "pending");
    } else {
      // For demo, assuming all others are approved in this tab,
      // but really we need mock data for approved.
      // Since mock data is all pending, let's just show empty or approved items if we had any.
      filtered = filtered.filter((o) => o.status === "approved");
    }

    // Filter by keyword
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
    // Implement logic
  };

  const handleReject = (item: EstimateOrder) => {
    console.log("Reject", item);
    // Implement logic
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
