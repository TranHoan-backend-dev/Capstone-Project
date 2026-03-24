"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Tab, Tabs, Chip, DateValue, useDisclosure } from "@heroui/react";

import { EstimateTable, EstimateOrder } from "./components/estimate-table";
import { FilterSection } from "@/components/ui/FilterSection";
import BaseModal from "@/components/ui/modal/BaseModal";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
const PENDING_STATUSES = ["pending", "processing", "pending_for_approval"];
const APPROVED_STATUS = "approved";

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

  const [activeTab, setActiveTab] = useState<string>("pending");

  // Modal state for creating signature request
  const [isCreateSignModalOpen, setIsCreateSignModalOpen] = useState(false);
  const [selectedItemForSign, setSelectedItemForSign] =
    useState<EstimateOrder | null>(null);

  // State for signer selection
  const [surveyStaffId, setSurveyStaffId] = useState("");
  const [planningHeadId, setPlanningHeadId] = useState("");
  const [companyLeadershipId, setCompanyLeadershipId] = useState("");

  // Available employees for dropdowns - store all employees
  const [allEmployees, setAllEmployees] = useState<
    { id: string; fullName: string; departmentName?: string }[]
  >([]);

  // Modal state for signing
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedItemForSigning, setSelectedItemForSigning] =
    useState<EstimateOrder | null>(null);
  const [electronicSignUrl, setElectronicSignUrl] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [orders, setOrders] = useState<EstimateOrder[]>([]);
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

  // Fetch all employees for dropdowns
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch("/api/auth/employees?size=1000");
        const json = await res.json();

        // Extract data from response structure: data.content
        const employees = json?.data?.content || [];

        // Map to required format
        const mappedEmployees = employees.map((emp: any) => ({
          id: emp.id,
          fullName: emp.fullName,
          departmentName: emp.departmentName,
        }));

        setAllEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setAllEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

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
              status: info.status?.estimate?.toLowerCase() || "pending",
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

  // Sửa logic lọc trong filteredOrders:
  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (activeTab === "pending") {
      // Các status sẽ hiển thị ở tab "Chờ duyệt"
      filtered = filtered.filter((o) => {
        const status = o.status?.toLowerCase();
        return PENDING_STATUSES.includes(status);
      });
    }

    if (activeTab === "approved") {
      // Chỉ hiển thị status = "approved"
      filtered = filtered.filter((o) => {
        const status = o.status?.toLowerCase();
        return status === APPROVED_STATUS;
      });
    }

    if (keyword) {
      const lowerK = keyword.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.code?.toLowerCase().includes(lowerK) ||
          o.designProfileName?.toLowerCase().includes(lowerK) ||
          o.phone?.toLowerCase().includes(lowerK),
      );
    }

    return filtered;
  }, [orders, activeTab, keyword]);

  const handleSearch = (query: string) => {
    setKeyword(query);
  };

  // Handle create signature request
  const handleCreateSignatureRequest = (item: EstimateOrder) => {
    setSelectedItemForSign(item);
    // Reset selections
    setSurveyStaffId("");
    setPlanningHeadId("");
    setCompanyLeadershipId("");
    setIsCreateSignModalOpen(true);
  };

  const handleConfirmCreateSignatureRequest = async () => {
    if (!selectedItemForSign) return;

    // Validate at least one signer is selected
    if (!surveyStaffId && !planningHeadId && !companyLeadershipId) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng chọn ít nhất một người ký",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create request body with correct structure
      const requestBody = {
        estId: selectedItemForSign.id,
        surveyStaff: surveyStaffId || null,
        plHead: planningHeadId || null,
        companyLeadership: companyLeadershipId || null,
      };

      const res = await fetch(`/api/construction/estimates/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Tạo yêu cầu ký thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Tạo yêu cầu ký duyệt thành công",
        color: "success",
      });

      setRefetch((prev) => prev + 1);
      setIsCreateSignModalOpen(false);
    } catch (error: any) {
      CallToast({
        title: "Thất bại",
        message: error.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle sign action (when user clicks on sign button for an estimate they need to sign)
  const handleSignAction = (item: EstimateOrder) => {
    setSelectedItemForSigning(item);
    setElectronicSignUrl("");
    setIsSignModalOpen(true);
  };

  const handleConfirmSign = async () => {
    if (!selectedItemForSigning) return;

    if (!electronicSignUrl.trim()) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng nhập chữ ký điện tử",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Create request body for sign
      const requestBody = {
        estimateId: selectedItemForSigning.id,
        electronicSignUrl: electronicSignUrl,
      };

      const res = await fetch(`/api/construction/estimates/sign`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Ký thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Ký duyệt dự toán thành công",
        color: "success",
      });

      setRefetch((prev) => prev + 1);
      setIsSignModalOpen(false);
    } catch (error: any) {
      CallToast({
        title: "Thất bại",
        message: error.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleView = (item: EstimateOrder) => {
    router.push(`/estimate/run/${item.id}`);
  };

  // Placeholder functions for approval/rejection/estimation
  const handleApprove = (item: EstimateOrder) => {
    // Implement if needed
    console.log("Approve", item);
  };

  const handleReject = (item: EstimateOrder) => {
    // Implement if needed
    console.log("Reject", item);
  };

  const handleEstimate = (item: EstimateOrder) => {
    router.push(`/estimate/run/${item.id}`);
  };

  // Sửa lại phần đếm số lượng
  const pendingCount = orders.filter((o) => {
    const status = o.status?.toLowerCase();
    return PENDING_STATUSES.includes(status);
  }).length;

  const approvedCount = orders.filter((o) => {
    const status = o.status?.toLowerCase();
    return status === APPROVED_STATUS;
  }).length;

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

      <Tabs
        aria-label="Survey Status"
        classNames={{
          cursor: activeTab === "pending" ? "bg-yellow-500" : "bg-green-500",
          tab: "max-w-fit px-6 h-12",
          tabContent: `group-data-[selected=true]:text-blue-600 font-medium text-black dark:text-white dark:group-data-[selected=true]:text-yellow-300`,
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
        }}
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
            onViewAction={handleView}
            onApproveAction={handleApprove}
            onRejectAction={handleReject}
            onEstimateAction={handleEstimate}
            onCreateSignatureRequest={handleCreateSignatureRequest}
            onSignAction={handleSignAction}
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
            onViewAction={handleView}
            onApproveAction={handleApprove}
            onRejectAction={handleReject}
            onEstimateAction={handleEstimate}
            onCreateSignatureRequest={handleCreateSignatureRequest}
            onSignAction={handleSignAction}
          />
        </Tab>
      </Tabs>

      {/* Modal for creating signature request */}
      <BaseModal
        isOpen={isCreateSignModalOpen}
        onOpenChange={() => setIsCreateSignModalOpen(false)}
        title={`Tạo yêu cầu ký duyệt - ${selectedItemForSign?.code}`}
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
                  {selectedItemForSign?.designProfileName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng tiền
                </p>
                <p className="font-semibold text-primary">
                  {selectedItemForSign?.totalAmount}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Địa chỉ
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedItemForSign?.installationAddress}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nhân viên khảo sát ký
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={surveyStaffId}
                onChange={(e) => setSurveyStaffId(e.target.value)}
              >
                <option value="">-- Chọn nhân viên khảo sát --</option>
                {allEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}{" "}
                    {employee.departmentName
                      ? `(${employee.departmentName})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trưởng phòng Kế hoạch Kỹ thuật
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={planningHeadId}
                onChange={(e) => setPlanningHeadId(e.target.value)}
              >
                <option value="">-- Chọn trưởng phòng --</option>
                {allEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}{" "}
                    {employee.departmentName
                      ? `(${employee.departmentName})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Lãnh đạo công ty
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={companyLeadershipId}
                onChange={(e) => setCompanyLeadershipId(e.target.value)}
              >
                <option value="">-- Chọn lãnh đạo --</option>
                {allEmployees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}{" "}
                    {employee.departmentName
                      ? `(${employee.departmentName})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-divider">
          <CustomButton
            onPress={() => {
              setIsCreateSignModalOpen(false);
              setSelectedItemForSign(null);
            }}
            className="font-medium"
            color="default"
            variant="bordered"
          >
            Hủy
          </CustomButton>
          <CustomButton
            onPress={handleConfirmCreateSignatureRequest}
            isLoading={isProcessing}
            className="text-white font-medium"
            color="primary"
          >
            Tạo yêu cầu
          </CustomButton>
        </div>
      </BaseModal>

      {/* Modal for signing */}
      <BaseModal
        isOpen={isSignModalOpen}
        onOpenChange={() => setIsSignModalOpen(false)}
        title={`Ký duyệt dự toán - ${selectedItemForSigning?.code}`}
        size="2xl"
      >
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Khách hàng
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItemForSigning?.designProfileName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Tổng tiền
                </p>
                <p className="font-semibold text-primary">
                  {selectedItemForSigning?.totalAmount}
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Chữ ký điện tử
            </label>
            <input
              type="text"
              placeholder="Nhập chữ ký điện tử hoặc URL chữ ký"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={electronicSignUrl}
              onChange={(e) => setElectronicSignUrl(e.target.value)}
            />
            <p className="text-sm text-gray-500 mt-1">
              Vui lòng nhập chữ ký điện tử của bạn để xác nhận duyệt dự toán
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-divider">
          <CustomButton
            onPress={() => setIsSignModalOpen(false)}
            color="default"
            variant="bordered"
          >
            Hủy
          </CustomButton>
          <CustomButton
            onPress={handleConfirmSign}
            isLoading={isProcessing}
            color="success"
          >
            Xác nhận ký
          </CustomButton>
        </div>
      </BaseModal>
    </>
  );
};

export default EstimateApprovalPage;
