"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Tab,
  Tabs,
  Chip,
  DateValue,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";

import { EstimateTable } from "./components/estimate-table";
import { FilterSection } from "./components/filter-section";
import { CallToast } from "@/components/ui/CallToast";
import { authFetch } from "@/utils/authFetch";
import { useProfile } from "@/hooks/useLogin";
import CreateSignatureModal from "./components/create-signature-modal";
import SignModal from "./components/sign-modal";
import { EstimateOrder } from "@/types";
import CustomButton from "@/components/ui/custom/CustomButton";

type EstimateTabKey = "pending" | "approved";

const formatCurrency = (value: unknown): string => {
  const numeric =
    typeof value === "number"
      ? value
      : Number(String(value ?? "").replace(/[^\d.-]/g, ""));

  if (!Number.isFinite(numeric)) {
    return "0";
  }

  return numeric.toLocaleString("vi-VN");
};

const EstimateApprovalPage = () => {
  const router = useRouter();
  const { profile } = useProfile();
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);

  const [activeTab, setActiveTab] = useState<EstimateTabKey>("pending");

  const [isCreateSignModalOpen, setIsCreateSignModalOpen] = useState(false);
  const [selectedItemForSign, setSelectedItemForSign] =
    useState<EstimateOrder | null>(null);

  const [surveyStaffId, setSurveyStaffId] = useState("");
  const [planningHeadId, setPlanningHeadId] = useState("");
  const [companyLeadershipId, setCompanyLeadershipId] = useState("");

  const [allEmployees, setAllEmployees] = useState<
    { id: string; fullName: string; departmentName?: string }[]
  >([]);

  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedItemForSigning, setSelectedItemForSigning] =
    useState<EstimateOrder | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: "approve" | "reject";
    item: EstimateOrder;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [orders, setOrders] = useState<EstimateOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const [pageByTab, setPageByTab] = useState<Record<EstimateTabKey, number>>({
    pending: 1,
    approved: 1,
  });
  const [refetch, setRefetch] = useState(0);
  const pageSize = 10;
  const currentPage = pageByTab[activeTab];

  const currentUser = profile
    ? {
        id: profile.id,
        fullname: profile.fullname,
        role: profile.role,
        significanceUrl: profile.significanceUrl || "",
      }
    : null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        let surveyStaff = null;
        if (profile && profile.role === "survey_staff") {
          surveyStaff = {
            id: profile.id,
            fullName: profile.fullname,
            departmentName: "Khảo sát",
          };
          setSurveyStaffId(profile.id);
        }

        let planningHeads = [];
        try {
          const planningRes = await authFetch("/api/auth/employees/pt-head");
          const planningJson = await planningRes.json();

          if (planningJson?.data && Array.isArray(planningJson.data)) {
            planningHeads = planningJson.data.map((emp: any) => ({
              id: emp.id,
              fullName: emp.name,
              departmentName: "Kế hoạch - Kỹ thuật",
            }));
          }
        } catch (error) {
          console.error("Error fetching planning head:", error);
        }

        let leaderships = [];
        try {
          const leadershipRes = await authFetch(
            "/api/auth/employees/leadership",
          );
          const leadershipJson = await leadershipRes.json();

          if (leadershipJson?.data && Array.isArray(leadershipJson.data)) {
            leaderships = leadershipJson.data.map((emp: any) => ({
              id: emp.id,
              fullName: emp.name,
              departmentName: "Ban lãnh đạo",
            }));
          }
        } catch (error) {
          console.error("Error fetching company leadership:", error);
        }

        const employeesList = [];

        if (surveyStaff) {
          employeesList.push(surveyStaff);
        }

        employeesList.push(...planningHeads);
        employeesList.push(...leaderships);

        setAllEmployees(employeesList);

        if (planningHeads.length === 1 && !planningHeadId) {
          setPlanningHeadId(planningHeads[0].id);
        }

        if (leaderships.length === 1 && !companyLeadershipId) {
          setCompanyLeadershipId(leaderships[0].id);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
        setAllEmployees([]);
      }
    };

    fetchEmployees();
  }, [profile]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: "0",
          size: "1000",
          sort: `${sort.field},${sort.direction}`,
        });
        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) {
          params.append("keyword", trimmedKeyword);
        }
        const res = await authFetch(
          `/api/construction/estimates?${params.toString()}`,
        );
        const json = await res.json();

        const items = json?.data?.content ?? [];

        const mapped: EstimateOrder[] = await Promise.all(
          items.map(async (item: any, index: number) => {
            const info = item.generalInformation;
            const form = info.installationFormId;
            const fallbackTotal =
              info.totalAmount ?? info.totalPrice ?? item.totalAmount ?? 0;
            return {
              stt: (currentPage - 1) * pageSize + index + 1,
              id: info.estimationId,
              code: form?.formNumber,
              designProfileName: info.customerName,
              phone: item.phoneNumber,
              installationAddress: info.address,
              totalAmount: formatCurrency(fallbackTotal),
              createdDate: new Date(info.createdAt).toLocaleDateString("vi-VN"),
              status: info.status?.estimate?.toLowerCase() || "pending",
            };
          }),
        );
        setOrders(mapped);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sort, refetch, keyword]);

  const pendingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status?.toUpperCase() !== "APPROVED" &&
          order.status?.toUpperCase() !== "REJECTED",
      ),
    [orders],
  );

  const approvedOrders = useMemo(
    () => orders.filter((order) => order.status?.toUpperCase() === "APPROVED"),
    [orders],
  );

  const totalItemsByTab = useMemo(
    () => ({
      pending: pendingOrders.length,
      approved: approvedOrders.length,
    }),
    [pendingOrders.length, approvedOrders.length],
  );

  const totalPagesByTab = useMemo(
    () => ({
      pending: Math.max(1, Math.ceil(totalItemsByTab.pending / pageSize)),
      approved: Math.max(1, Math.ceil(totalItemsByTab.approved / pageSize)),
    }),
    [totalItemsByTab, pageSize],
  );

  const paginatedPendingOrders = useMemo(() => {
    const start = (pageByTab.pending - 1) * pageSize;
    return pendingOrders.slice(start, start + pageSize);
  }, [pendingOrders, pageByTab.pending, pageSize]);

  const paginatedApprovedOrders = useMemo(() => {
    const start = (pageByTab.approved - 1) * pageSize;
    return approvedOrders.slice(start, start + pageSize);
  }, [approvedOrders, pageByTab.approved, pageSize]);

  const tableData =
    activeTab === "pending" ? paginatedPendingOrders : paginatedApprovedOrders;

  const handleSearch = (query: string) => {
    setKeyword(query);
  };
  const handleApprove = async (item: EstimateOrder) => {
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/construction/estimates/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: true,
          estimateId: item.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Duyệt dự toán thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Duyệt dự toán thành công",
        color: "success",
      });

      setRefetch((prev) => prev + 1);
    } catch (error: any) {
      CallToast({
        title: "Thất bại",
        message: error.message || "Có lỗi xảy ra khi duyệt dự toán",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (item: EstimateOrder) => {
    setIsProcessing(true);
    try {
      const res = await authFetch(`/api/construction/estimates/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: false,
          estimateId: item.id,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Từ chối dự toán thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Từ chối dự toán thành công",
        color: "success",
      });

      // Refresh data
      setRefetch((prev) => prev + 1);
    } catch (error: any) {
      CallToast({
        title: "Thất bại",
        message: error.message || "Có lỗi xảy ra khi từ chối dự toán",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  const handleCreateSignatureRequest = (item: EstimateOrder) => {
    setSelectedItemForSign(item);
    setPlanningHeadId("");
    setCompanyLeadershipId("");
    setIsCreateSignModalOpen(true);
  };

  // Sửa lại handleConfirmCreateSignatureRequest
  const handleConfirmCreateSignatureRequest = async () => {
    if (!selectedItemForSign) return;

    // Lấy survey staff ID từ profile
    let surveyStaffIdValue = "";
    if (profile && profile.role === "survey_staff") {
      surveyStaffIdValue = profile.id;
    }

    if (!surveyStaffIdValue && !planningHeadId && !companyLeadershipId) {
      CallToast({
        title: "Thất bại",
        message: "Vui lòng chọn ít nhất một người ký",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const requestBody = {
        estId: selectedItemForSign.id,
        surveyStaff: surveyStaffIdValue || null,
        plHead: planningHeadId || null,
        companyLeadership: companyLeadershipId || null,
      };

      const res = await authFetch(`/api/construction/estimates/sign`, {
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
      console.error("Error:", error);
      CallToast({
        title: "Thất bại",
        message: error.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignAction = (item: EstimateOrder) => {
    setSelectedItemForSigning(item);
    setIsSignModalOpen(true);
  };

  const handleConfirmSign = async () => {
    if (!selectedItemForSigning) return;

    if (!currentUser?.significanceUrl) {
      CallToast({
        title: "Thất bại",
        message:
          "Bạn chưa có chữ ký điện tử. Vui lòng cập nhật thông tin cá nhân.",
        color: "danger",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const requestBody = {
        estimateId: selectedItemForSigning.id,
        electronicSignUrl: currentUser.significanceUrl,
      };

      const res = await authFetch(`/api/construction/estimates/sign`, {
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

  const handleEstimate = (item: EstimateOrder) => {
    router.push(`/estimate/run/${item.id}`);
  };
  const handleApproveClick = (item: EstimateOrder) => {
    setConfirmAction({ type: "approve", item });
    setIsConfirmModalOpen(true);
  };

  const handleRejectClick = (item: EstimateOrder) => {
    setConfirmAction({ type: "reject", item });
    setIsConfirmModalOpen(true);
  };
  const handleConfirmAction = async () => {
    if (!confirmAction) return;

    if (confirmAction.type === "approve") {
      await handleApprove(confirmAction.item);
    } else {
      await handleReject(confirmAction.item);
    }

    // Đóng modal
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
    setRejectReason("");
  };
  const pendingCount = totalItemsByTab.pending;
  const approvedCount = totalItemsByTab.approved;

  const currentUserRole = profile?.role;

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
        onSelectionChange={(key) => setActiveTab(key as EstimateTabKey)}
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
            data={tableData}
            loading={loading}
            page={pageByTab.pending}
            totalPages={totalPagesByTab.pending}
            totalItems={totalItemsByTab.pending}
            onPageChange={(nextPage) =>
              setPageByTab((prev) => ({ ...prev, pending: nextPage }))
            }
            onViewAction={handleView}
            onApproveAction={handleApproveClick}
            onRejectAction={handleRejectClick}
            onEstimateAction={handleEstimate}
            onCreateSignatureRequest={handleCreateSignatureRequest}
            onSignAction={handleSignAction}
            currentUserRole={currentUserRole}
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
            data={tableData}
            loading={loading}
            page={pageByTab.approved}
            totalPages={totalPagesByTab.approved}
            totalItems={totalItemsByTab.approved}
            onPageChange={(nextPage) =>
              setPageByTab((prev) => ({ ...prev, approved: nextPage }))
            }
            onViewAction={handleView}
            onApproveAction={handleApproveClick}
            onRejectAction={handleRejectClick}
            onEstimateAction={handleEstimate}
            onCreateSignatureRequest={handleCreateSignatureRequest}
            onSignAction={handleSignAction}
            currentUserRole={currentUserRole}
          />
        </Tab>
      </Tabs>

      <CreateSignatureModal
        isOpen={isCreateSignModalOpen}
        onOpenChange={() => {
          setIsCreateSignModalOpen(false);
          setSelectedItemForSign(null);
        }}
        selectedItem={selectedItemForSign}
        surveyStaffId={surveyStaffId}
        planningHeadId={planningHeadId}
        companyLeadershipId={companyLeadershipId}
        employees={allEmployees}
        isProcessing={isProcessing}
        onSurveyStaffChange={setSurveyStaffId}
        onPlanningHeadChange={setPlanningHeadId}
        onCompanyLeadershipChange={setCompanyLeadershipId}
        onConfirm={handleConfirmCreateSignatureRequest}
      />

      <SignModal
        isOpen={isSignModalOpen}
        onOpenChange={() => {
          setIsSignModalOpen(false);
          setSelectedItemForSigning(null);
        }}
        selectedItem={selectedItemForSigning}
        currentUser={currentUser}
        isProcessing={isProcessing}
        onConfirm={handleConfirmSign}
      />
      <Modal
        isOpen={isConfirmModalOpen}
        onOpenChange={() => {
          setIsConfirmModalOpen(false);
          setConfirmAction(null);
          setRejectReason("");
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                {confirmAction?.type === "approve"
                  ? "Xác nhận duyệt dự toán"
                  : "Xác nhận từ chối dự toán"}
              </ModalHeader>
              <ModalBody>
                <p>
                  {confirmAction?.type === "approve"
                    ? `Bạn có chắc chắn muốn duyệt dự toán ${confirmAction?.item.code}?`
                    : `Bạn có chắc chắn muốn từ chối dự toán ${confirmAction?.item.code}?`}
                </p>
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  disabled={isProcessing}
                >
                  Hủy
                </CustomButton>
                <CustomButton
                  color={
                    confirmAction?.type === "approve" ? "success" : "danger"
                  }
                  onPress={handleConfirmAction}
                  isLoading={isProcessing}
                  className="text-white"
                >
                  {confirmAction?.type === "approve" ? "Duyệt" : "Từ chối"}
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EstimateApprovalPage;
