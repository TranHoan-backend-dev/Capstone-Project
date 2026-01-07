"use client";

import React, { useMemo, useState } from "react";
import { DateValue } from "@heroui/react";

import { ActionsSection } from "./components/actions-section";
import { OrdersToDesignTable } from "./components/orders-to-design-table";
import { ProcessedDesignsTable } from "./components/processed-designs-table";
import { WaitingInputTable } from "./components/waiting-input-table";

import { FilterSection } from "@/components/ui/FilterSection";
import { DesignProcessingItem } from "@/types";

const DesignProcessingPage = () => {
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  const [ordersToDesign, setOrdersToDesign] = useState<DesignProcessingItem[]>([
    {
      id: "1",
      code: "01025120007",
      customerName: "Trần Thị Nguyệt",
      phone: "0355909536",
      address: "Thửa 133, Nghiệp 92/2, Khu CN Hòa Xá, Nam Định",
      registrationDate: "01/12/2025",
      surveyAppointment: "27/11/2025",
      status: "paid",
    },
    {
      id: "2",
      code: "01025120124",
      customerName: "Hoàng Thế Quý",
      phone: "0915705720",
      address: "29B, Trần Huy Liệu, P. Thành Nam, TP. Nam Định",
      registrationDate: "26/11/2025",
      surveyAppointment: "27/11/2025",
      status: "processing",
    },
  ]);

  const [processedDesigns, setProcessedDesigns] = useState([
    {
      id: "3",
      code: "0102580016",
      customerName: "Nguyễn Văn Vũ",
      phone: "0913090736",
      address:
        "Thửa 344 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registrationDate: "06/08/2025",
      surveyAppointment: "07/08/2025",
    },
    {
      id: "4",
      code: "0102580015",
      customerName: "Nguyễn Văn Vũ",
      phone: "0913090736",
      address:
        "Thửa 343 ngách 31/294, Đường Kênh, Phường Nam Định, TP. Nam Định",
      registrationDate: "06/08/2025",
      surveyAppointment: "07/08/2025",
    },
  ]);

  const [waitingInput, setWaitingInput] = useState<DesignProcessingItem[]>([
    {
      id: "5",
      code: "0102404119",
      customerName: "Trần Liên Hương",
      phone: "0944808979",
      address: "28/107, Đường 19/5, P.Trần Tế Xương, TP. Nam Định",
      registrationDate: "24/04/2024",
      surveyAppointment: "24/04/2024",
      status: "pending_restore",
    },
    {
      id: "6",
      code: "0102590069",
      customerName: "Công ty CP Đầu tư và Thương mại Mạnh Hải",
      phone: "0906519568",
      address: "Số 96, Đông A, P.Lộc Vượng, TP. Nam Định",
      registrationDate: "26/09/2022",
      surveyAppointment: "26/09/2022",
      status: "rejected",
    },
    {
      id: "7",
      code: "0102590069",
      customerName: "Công ty CP Đầu tư và Thương mại Mạnh Hải",
      phone: "0906519568",
      address: "Số 96, Đông A, P.Lộc Vượng, TP. Nam Định",
      registrationDate: "26/09/2022",
      surveyAppointment: "26/09/2022",
      status: "none",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Action Handlers
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
          item.code.includes(searchQuery),
      ),
    [ordersToDesign, searchQuery],
  );

  const filteredProcessed = useMemo(
    () =>
      processedDesigns.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.includes(searchQuery),
      ),
    [processedDesigns, searchQuery],
  );

  const filteredWaiting = useMemo(
    () =>
      waitingInput.filter(
        (item) =>
          item.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.code.includes(searchQuery),
      ),
    [waitingInput, searchQuery],
  );

  return (
    <>
      <ActionsSection />
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
