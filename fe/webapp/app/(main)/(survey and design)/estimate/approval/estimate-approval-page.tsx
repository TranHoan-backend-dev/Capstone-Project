"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tab, Tabs, Chip, DateValue, useDisclosure } from "@heroui/react";

import { ApprovalInputSection } from "./components/approval-input-section";
import { EstimateTable, EstimateOrder } from "./components/estimate-table";

import { FilterSection } from "@/components/ui/FilterSection";
import BaseModal from "@/components/ui/modal/BaseModal";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";

// Helper function to calculate total amount from materials
const calculateTotalAmount = (materials: any[]): string => {
  if (!materials || materials.length === 0) return "0";

  const total = materials.reduce((sum, item) => {
    const materialTotal = parseFloat(item.totalMaterialPrice ?? 0) || 0;
    const laborTotal = parseFloat(item.totalLaborPrice ?? 0) || 0;
    return sum + materialTotal + laborTotal;
  }, 0);

  return total.toLocaleString("vi-VN");
};

const EstimateApprovalPage = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  const [approvalDate, setApprovalDate] = useState<
    DateValue | null | undefined
  >(null);
  const [approvalNote, setApprovalNote] = useState("");
  const [activeTab, setActiveTab] = useState<string>("pending");

  // Modal state
  const [selectedItem, setSelectedItem] = useState<EstimateOrder | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const mapStatus = (status: string): "pending" | "approved" => {
    return status === "APPROVED" ? "approved" : "pending";
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
  const [refetch, setRefetch] = useState(0);
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
              totalAmount: calculateTotalAmount(item.material),
              createdDate: new Date(info.createdAt).toLocaleDateString("vi-VN"),
              creator: creatorName,
              status: mapStatus(info.status?.estimate),
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
  }, [page, sort, refetch]);

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
    setSelectedItem(item);
    setActionType("approve");
    setApprovalDate(null);
    setApprovalNote("");
    onOpen();
  };

  const handleReject = (item: EstimateOrder) => {
    setSelectedItem(item);
    setActionType("reject");
    setApprovalDate(null);
    setApprovalNote("");
    onOpen();
  };

  const handleEstimate = (item: EstimateOrder) => {
    router.push(`/estimate/run/${item.id}`);
  };

  const handleView = (item: EstimateOrder) => {
    router.push(`/estimate/run/${item.id}`);
  };

  const handleConfirmAction = async () => {
    if (!selectedItem || !actionType) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng điền đầy đủ ngày duyệt",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch(
        `/api/construction/estimates/${selectedItem.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(actionType === "approve"),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Cập nhật thất bại");
      }

      CallToast({
        title: "Thành công",
        message: `${actionType === "approve" ? "Duyệt" : "Từ chối"} dự toán thành công`,
        color: "success",
      });

      // Reload data
      setRefetch((prev) => prev + 1);
      onOpenChange();
    } catch (error) {
      CallToast({
        title: "Thất bại",
        message: error instanceof Error ? error.message : "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const pendingCount = orders.filter((o) => o.status === "pending").length;
  const approvedCount = orders.filter((o) => o.status === "approved").length;
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

      {/* <ApprovalInputSection
        approvalDate={approvalDate}
        approvalNote={approvalNote}
        setApprovalDateAction={setApprovalDate}
        setApprovalNoteAction={setApprovalNote}
      /> */}

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
                {pendingCount}
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
                {approvedCount}
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

      {/* Approval/Rejection Modal */}
      <BaseModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={`${actionType === "approve" ? "Duyệt" : "Từ chối"} dự toán #${selectedItem?.code}`}
        size="2xl"
      >
        <div className="space-y-6 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Khách hàng
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItem?.designProfileName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng tiền
                </p>
                <p className="font-semibold text-primary">
                  {selectedItem?.totalAmount}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Địa chỉ
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedItem?.installationAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-divider">
          <CustomButton
            onPress={() => {
              onOpenChange();
              setSelectedItem(null);
              setActionType(null);
            }}
            className="font-medium"
            color="default"
            variant="bordered"
          >
            Hủy
          </CustomButton>
          <CustomButton
            onPress={handleConfirmAction}
            isLoading={isProcessing}
            className="text-white font-medium"
            color={actionType === "approve" ? "success" : "danger"}
          >
            {actionType === "approve" ? "Duyệt" : "Từ chối"}
          </CustomButton>
        </div>
      </BaseModal>
    </>
  );
};

export default EstimateApprovalPage;
