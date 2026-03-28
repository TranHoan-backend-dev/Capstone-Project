"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Chip,
  Link,
  Tooltip,
  Button,
  Spinner,
  Card,
  CardBody,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Avatar,
  Divider,
  Badge,
} from "@heroui/react";
import {
  CalculatorIcon,
  PencilSquareIcon,
  TrashIcon,
  DocumentTextIcon,
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useSettlementUpdates } from "@/hooks/useWebSocketRefresh";
import { sendSignRequestNotification } from "@/utils/notification-helper";
import { getAccessTokenFromCookie } from "@/utils/token-helper";
import { useRouter } from "next/navigation";
import { SettlementDetailModal } from "./settlement-detail-modal";
import { SettlementDocumentModal } from "./settlement-document-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { DeleteIcon, EditIcon, ApprovalIcon } from "@/config/chip-and-icon";
import { SettlementItem, SettlementDetail, SettlementResponse } from "@/types";
import { authFetch } from "@/utils/authFetch";
import { SETLEMENT_LOOKUP_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";
import BaseModal from "@/components/ui/modal/BaseModal";
import CustomButton from "@/components/ui/custom/CustomButton";
import { useProfile } from "@/hooks/useLogin";
import { formatDate1 } from "@/utils/format";
import { getRoleVietnamese } from "@/utils/getRoleVietnamese";
import CustomSelect from "@/components/ui/custom/CustomSelect";

interface ResultsTableProps {
  keyword?: string;
  reloadKey?: number;
  from?: string | null;
  to?: string | null;
  status?: string;
  onEdit: (item: SettlementItem) => void;
  onDeleted: () => void;
  onFilterStatus?: (status: string) => void;
}

// Component hiển thị trạng thái với màu sắc đẹp
const StatusChip = ({ status }: { status: string }) => {
  const statusConfig: Record<string, { color: any; icon: any; label: string }> =
    {
      PENDING: { color: "warning", icon: ClockIcon, label: "Chờ duyệt" },
      APPROVED: { color: "success", icon: CheckCircleIcon, label: "Đã duyệt" },
      REJECTED: { color: "danger", icon: XCircleIcon, label: "Từ chối" },
      DRAFT: { color: "default", icon: DocumentTextIcon, label: "Nháp" },
    };

  const config = statusConfig[status] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Chip
      color={config.color}
      variant="flat"
      startContent={<Icon className="w-4 h-4" />}
      classNames={{
        base: "gap-1",
        content: "font-medium",
      }}
    >
      {config.label}
    </Chip>
  );
};

export const ResultsTable = ({
  keyword,
  reloadKey,
  from,
  to,
  onEdit,
  onDeleted,
  onFilterStatus,
}: ResultsTableProps) => {
  const [data, setData] = useState<SettlementItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const router = useRouter();

  // Auto-refresh data khi có settlement updates từ WebSocket
  useSettlementUpdates(() => {
    console.log("Settlement updated, refreshing data...");
    setRefreshTrigger((prev) => prev + 1);
  });
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSettlementDetail, setSelectedSettlementDetail] = useState<
    SettlementDetail | undefined
  >();
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedSettlementId, setSelectedSettlementId] = useState<
    string | null
  >(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [documentData, setDocumentData] = useState<any[]>([]);
  const [documentLoading, setDocumentLoading] = useState(false);
  const [selectedFormNumber, setSelectedFormNumber] = useState<string | null>(
    null,
  );

  // State cho modal tạo yêu cầu ký duyệt
  const [isCreateSignModalOpen, setIsCreateSignModalOpen] = useState(false);
  const [selectedItemForSign, setSelectedItemForSign] =
    useState<SettlementItem | null>(null);
  const [surveyStaffId, setSurveyStaffId] = useState("");
  const [planningHeadId, setPlanningHeadId] = useState("");
  const [companyLeadershipId, setCompanyLeadershipId] = useState("");
  // const [constructionPresidentId, setConstructionPresidentId] = useState("");

  // State cho modal ký duyệt
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedItemForSigning, setSelectedItemForSigning] =
    useState<SettlementItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Separate employees by role using 4 different endpoints
  const [surveyStaff, setSurveyStaff] = useState<
    { id: string; fullName: string }[]
  >([]);
  const [planningHead, setPlanningHead] = useState<
    { id: string; name: string }[]
  >([]);
  const [companyLeadership, setCompanyLeadership] = useState<
    { id: string; name: string }[]
  >([]);
  // const [constructionPresident, setConstructionPresident] = useState<
  //   { id: string; name: string }[]
  // >([]);

  const { profile } = useProfile();
  const currentUser = profile
    ? {
        id: profile.id,
        fullname: profile.fullname,
        role: profile.role,
        significanceUrl: profile.significanceUrl || "",
      }
    : null;

  // Fetch employees from 4 different endpoints
  useEffect(() => {
    const fetchEmployeesByRole = async () => {
      try {
        // Fetch survey staff
        const surveyRes = await authFetch("/api/auth/employees/survey-staff");
        if (surveyRes.ok) {
          const surveyJson = await surveyRes.json();
          setSurveyStaff(surveyJson?.data || []);
        }

        // Fetch planning head
        const planningRes = await authFetch("/api/auth/employees/pt-head");
        if (planningRes.ok) {
          const planningJson = await planningRes.json();
          setPlanningHead(planningJson?.data || []);
        }

        // Fetch company leadership
        const leadershipRes = await authFetch("/api/auth/employees/leadership");
        if (leadershipRes.ok) {
          const leadershipJson = await leadershipRes.json();
          setCompanyLeadership(leadershipJson?.data || []);
        }

        // // Fetch construction head
        // const constructionRes = await authFetch(
        //   "/api/auth/employees/construction-head",
        // );
        // if (constructionRes.ok) {
        //   const constructionJson = await constructionRes.json();
        //   setConstructionPresident(constructionJson?.data || []);
        // }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployeesByRole();
  }, []);

  // Fetch data
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
        });
        if (keyword?.trim()) params.append("keyword", keyword.trim());
        if (from) params.append("fromDate", from);
        if (to) params.append("toDate", to);
        if (status) params.append("status", status);

        const res = await authFetch(
          `/api/construction/settlements?${params.toString()}`,
        );
        if (!res.ok) return;

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const totalPagesValue = pageData?.totalPages ?? 1;

        setTotalItems(pageData?.totalElements ?? 0);
        setTotalPages(totalPagesValue || 1);

        if (page > totalPagesValue && totalPagesValue > 0) {
          setPage(totalPagesValue);
          return;
        }

        const mapped = items.map((item: SettlementResponse, index: number) => ({
          id: item.settlementId,
          stt: (page - 1) * pageSize + index + 1,
          formCode: item.formCode,
          formNumber: item.formNumber,
          jobContent: item.jobContent,
          address: item.address,
          registrationAt: formatDate1(item.registrationAt),
          connectionFee: item.connectionFee,
          note: item.note,
          status: item.status,
        }));
        setData(mapped);
      } catch (error: any) {
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, keyword, reloadKey, sort, from, to, status, refreshTrigger]);

  const fetchSettlementDetail = async (settlementId: string) => {
    try {
      setIsDetailLoading(true);
      const res = await authFetch(
        `/api/construction/settlements/${settlementId}`,
      );
      if (!res.ok) throw new Error("Failed to fetch");
      const json = await res.json();
      setSelectedSettlementDetail(json?.data);
      setIsDetailModalOpen(true);
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error.message || "Không thể tải thông tin chi tiết",
        color: "danger",
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleteLoading(true);
      const res = await authFetch(`/api/construction/settlements/${deleteId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      CallToast({
        title: "Thành công",
        message: "Xóa quyết toán thành công",
        color: "success",
      });
      setDeleteId(null);
      onDeleted();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateSignatureRequest = (item: SettlementItem) => {
    setSelectedItemForSign(item);
    setSurveyStaffId("");
    setPlanningHeadId("");
    setCompanyLeadershipId("");
    // setConstructionPresidentId("");
    setIsCreateSignModalOpen(true);
  };

  const handleConfirmCreateSignatureRequest = async () => {
    if (!selectedItemForSign) return;
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
      const requestBody = {
        settlementId: selectedItemForSign.id,
        surveyStaff: surveyStaffId || null,
        plHead: planningHeadId || null,
        companyLeadership: companyLeadershipId || null,
        // constructionPresident: constructionPresidentId || null,
      };

      const res = await authFetch(`/api/construction/settlements/sign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Tạo yêu cầu ký thất bại");
      }

      // Gửi notification cho những user được chỉ định ký
      const recipientIds = [
        surveyStaffId,
        planningHeadId,
        companyLeadershipId,
      ].filter(Boolean) as string[];

      if (recipientIds.length > 0) {
        try {
          const accessToken = getAccessTokenFromCookie();
          if (accessToken) {
            await sendSignRequestNotification(
              accessToken,
              recipientIds,
              selectedItemForSign.id,
              selectedItemForSign.formNumber,
              currentUser?.fullname || "Admin",
            );
            console.log("Notification sent to signers:", recipientIds);
          }
        } catch (notificationError) {
          console.error("Failed to send notification:", notificationError);
          // Notification error không bao gồm API error, chỉ log warning
        }
      }

      CallToast({
        title: "Thành công",
        message: "Gửi yêu cầu ký duyệt quyết toán thành công",
        color: "success",
      });

      setIsCreateSignModalOpen(false);
      onDeleted();
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

  const handleSignAction = (item: SettlementItem) => {
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
      const res = await authFetch(
        `/api/construction/settlements/sign/${selectedItemForSigning.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: currentUser.significanceUrl }),
        },
      );

      if (!res.ok) {
        if (res.status === 403)
          throw new Error("Bạn không có quyền thực hiện hành động này");
        if (res.status === 404)
          throw new Error("Không tìm thấy bản quyết toán");
        const err = await res.json();
        throw new Error(err.message || "Ký duyệt thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Ký duyệt quyết toán thành công",
        color: "success",
      });

      setIsSignModalOpen(false);
      onDeleted();
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

  useEffect(() => {
    setPage(1);
  }, [keyword]);

  const actionItems = useMemo(() => {
    return [
      {
        content: "Tạo yêu cầu ký",
        icon: ApprovalIcon,
        className: "text-green-600 hover:bg-green-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) handleCreateSignatureRequest(found);
        },
      },
      {
        content: "Ký duyệt",
        icon: PencilSquareIcon,
        className: "text-blue-600 hover:bg-blue-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) handleSignAction(found);
        },
      },
      {
        content: "Chỉnh sửa",
        icon: EditIcon,
        className: "text-amber-500 hover:bg-amber-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) onEdit(found);
        },
      },
      {
        content: "Tạo phiếu thu",
        icon: CalculatorIcon,
        className: "text-green-600 hover:bg-green-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) {
            router.push(
              `/installation-fee-collection?formCode=${found.formCode}&formNumber=${found.formNumber}`,
            );
          }
        },
      },
    ];
  }, [data, onEdit]);

  const renderCell = (item: SettlementItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="font-medium text-default-700">{item.stt}</span>;
      case "formNumber":
        return (
          <Link
            className="text-primary font-medium hover:underline p-0 h-auto min-w-0"
            onPress={() => fetchSettlementDetail(item.id)}
          >
            {item.formNumber}
          </Link>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-1">
            {actionItems.map((action, idx) => (
              <Tooltip key={idx} content={action.content} closeDelay={0}>
                <CustomButton
                  isIconOnly
                  variant="light"
                  size="lg"
                  className={`${action.className} rounded-lg`}
                  onPress={() => action.onClick(item.id)}
                >
                  <action.icon className="w-5 h-5" />
                </CustomButton>
              </Tooltip>
            ))}
          </div>
        );
      default:
        const value = item[columnKey as keyof SettlementItem];
        return <span className="text-default-600">{String(value || "")}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner size="lg" label="Đang tải dữ liệu..." />
      </div>
    );
  }

  return (
    <>
      <GenericDataTable
        isCollapsible
        columns={SETLEMENT_LOOKUP_COLUMN}
        data={data}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        renderCellAction={renderCell}
        title="Danh sách quyết toán"
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xoá"
        message="Bạn có chắc muốn xoá quyết toán này không?"
        confirmText="Xoá"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />

      <SettlementDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSettlementDetail(undefined);
        }}
        data={selectedSettlementDetail}
        loading={isDetailLoading}
      />

      <SettlementDocumentModal
        isOpen={isDocumentModalOpen}
        onCloseAction={() => setIsDocumentModalOpen(false)}
        data={documentData}
        settlementId={selectedSettlementId || undefined}
        selectedFormNumber={selectedFormNumber || ""}
      />

      {/* Modal tạo yêu cầu ký duyệt - Thiết kế lại với HeroUI */}
      <Modal
        isOpen={isCreateSignModalOpen}
        onOpenChange={() => setIsCreateSignModalOpen(false)}
        size="2xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Tạo yêu cầu ký duyệt</h3>
                <p className="text-sm text-default-500 font-normal">
                  {selectedItemForSign?.formCode ||
                    selectedItemForSign?.formNumber}
                </p>
              </ModalHeader>
              <ModalBody className="py-4">
                {/* Thông tin quyết toán */}
                <Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200">
                  <CardBody className="gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Mã đơn
                        </p>
                        <p className="font-semibold text-default-900 mt-1">
                          {selectedItemForSign?.formCode ||
                            selectedItemForSign?.formNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Ngày đăng ký
                        </p>
                        <p className="font-semibold text-default-900 mt-1">
                          {selectedItemForSign?.registrationAt}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Nội dung công việc
                        </p>
                        <p className="font-medium text-default-900 mt-1">
                          {selectedItemForSign?.jobContent}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Địa chỉ
                        </p>
                        <p className="font-medium text-default-900 mt-1">
                          {selectedItemForSign?.address}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-2" />

                {/* Chọn người ký */}
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-default-700">
                    Chọn người ký duyệt
                  </p>

                  <CustomSelect
                    label="Nhân viên khảo sát"
                    options={surveyStaff.map((emp) => ({
                      label: emp.fullName,
                      value: emp.id,
                    }))}
                    selectedKeys={surveyStaffId ? [surveyStaffId] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]?.toString() || "";
                      setSurveyStaffId(selectedKey);
                    }}
                  />

                  <CustomSelect
                    label="Trưởng phòng Kế hoạch Kỹ thuật"
                    options={planningHead.map((emp) => ({
                      label: emp.name,
                      value: emp.id,
                    }))}
                    selectedKeys={planningHeadId ? [planningHeadId] : []}
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]?.toString() || "";
                      setPlanningHeadId(selectedKey);
                    }}
                  />

                  <CustomSelect
                    label="Lãnh đạo công ty"
                    options={companyLeadership.map((emp) => ({
                      label: emp.name,
                      value: emp.id,
                    }))}
                    selectedKeys={
                      companyLeadershipId ? [companyLeadershipId] : []
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]?.toString() || "";
                      setCompanyLeadershipId(selectedKey);
                    }}
                  />

                  {/* <CustomSelect
                    label="Giám đốc chi nhánh Xây lắp"
                    options={constructionPresident.map((emp) => ({
                      label: emp.name,
                      value: emp.id,
                    }))}
                    selectedKeys={
                      constructionPresidentId ? [constructionPresidentId] : []
                    }
                    onSelectionChange={(keys) => {
                      const selectedKey = Array.from(keys)[0]?.toString() || "";
                      setConstructionPresidentId(selectedKey);
                    }}
                  /> */}
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton variant="flat" onPress={onClose}>
                  Hủy
                </CustomButton>
                <CustomButton
                  color="primary"
                  onPress={handleConfirmCreateSignatureRequest}
                  isLoading={isProcessing}
                >
                  Tạo yêu cầu
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSignModalOpen}
        onOpenChange={() => setIsSignModalOpen(false)}
        size="2xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h3 className="text-xl font-semibold">Ký duyệt quyết toán</h3>
                <p className="text-sm text-default-500 font-normal">
                  {selectedItemForSigning?.formCode ||
                    selectedItemForSigning?.formNumber}
                </p>
              </ModalHeader>
              <ModalBody className="py-4">
                <Card className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200">
                  <CardBody className="gap-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Mã đơn
                        </p>
                        <p className="font-semibold text-default-900 mt-1">
                          {selectedItemForSigning?.formCode ||
                            selectedItemForSigning?.formNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Nội dung công việc
                        </p>
                        <p className="font-semibold text-default-900 mt-1">
                          {selectedItemForSigning?.jobContent}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-default-500 uppercase tracking-wider">
                          Địa chỉ
                        </p>
                        <p className="font-medium text-default-900 mt-1">
                          {selectedItemForSigning?.address}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Divider className="my-2" />

                <Card className="border border-default-200">
                  <CardBody className="gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-default-900 text-lg">
                          {currentUser?.fullname || "Đang tải..."}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="flat" color="primary">
                            {currentUser?.role
                              ? getRoleVietnamese(
                                  currentUser.role.toUpperCase(),
                                )
                              : "..."}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {currentUser?.significanceUrl ? (
                      <div className="flex items-center gap-2 p-3 bg-success-50 dark:bg-success-900/20 rounded-lg border border-success-200">
                        <CheckCircleIcon className="w-5 h-5 text-success" />
                        <span className="text-success-700 dark:text-success-300 text-sm">
                          Đã có chữ ký điện tử sẵn sàng
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-warning-50 dark:bg-warning-900/20 rounded-lg border border-warning-200">
                        <XCircleIcon className="w-5 h-5 text-warning" />
                        <span className="text-warning-700 dark:text-warning-300 text-sm">
                          Chưa có chữ ký điện tử. Vui lòng cập nhật thông tin cá
                          nhân.
                        </span>
                      </div>
                    )}
                  </CardBody>
                </Card>

                <div className="bg-default-50 p-4 rounded-lg">
                  <p className="text-sm text-default-600 flex items-start gap-2">
                    Bằng cách nhấn "Xác nhận ký", bạn đồng ý ký duyệt quyết toán
                    này bằng chữ ký điện tử của mình.
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <CustomButton variant="flat" onPress={onClose}>
                  Hủy
                </CustomButton>
                <CustomButton
                  color="success"
                  onPress={handleConfirmSign}
                  isLoading={isProcessing}
                  isDisabled={!currentUser?.significanceUrl}
                  startContent={
                    !isProcessing ? (
                      <CheckCircleIcon className="w-4 h-4" />
                    ) : undefined
                  }
                >
                  Xác nhận ký
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
