"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Chip, Link, Tooltip, Button, Spinner } from "@heroui/react";
import {
  CalculatorIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

import { SettlementDetailModal } from "./settlement-detail-modal";
import { SettlementDocumentModal } from "./settlement-document-modal";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import {
  DarkGreenChip,
  DarkRedChip,
  DarkYellowChip,
  DeleteIcon,
  EditIcon,
  TitleDarkColor,
  ApprovalIcon,
} from "@/config/chip-and-icon";
import {
  SettlementItem,
  SettlementDetail,
  SettlementResponse,
  SettlementTableProps,
  SettlementStatus,
} from "@/types";
import { authFetch } from "@/utils/authFetch";
import { SETLEMENT_LOOKUP_COLUMN } from "@/config/table-columns";
import { CallToast } from "@/components/ui/CallToast";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";
import BaseModal from "@/components/ui/modal/BaseModal";
import CustomButton from "@/components/ui/custom/CustomButton";

const statusMap = {
  APPROVED: {
    label: "Đã duyệt quyết toán",
    color: "success" as const,
    bg: DarkGreenChip,
  },
  REJECTED: {
    label: "Lập lại quyết toán",
    color: "danger" as const,
    bg: DarkRedChip,
  },
  PROCESSING: {
    label: "Đang xử lý",
    color: "default" as const,
    bg: "bg-blue-100 text-blue-800",
  },
  PENDING_FOR_APPROVAL: {
    label: "Chờ duyệt",
    color: "warning" as const,
    bg: DarkYellowChip,
  },
};

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
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });

  // State cho SettlementDetailModal
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

  // State cho user hiện tại
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    fullname: string;
    role: string;
    significanceUrl: string;
  } | null>(null);

  // State cho modal tạo yêu cầu ký duyệt
  const [isCreateSignModalOpen, setIsCreateSignModalOpen] = useState(false);
  const [selectedItemForSign, setSelectedItemForSign] =
    useState<SettlementItem | null>(null);
  const [surveyStaffId, setSurveyStaffId] = useState("");
  const [planningHeadId, setPlanningHeadId] = useState("");
  const [companyLeadershipId, setCompanyLeadershipId] = useState("");
  const [constructionPresidentId, setConstructionPresidentId] = useState("");

  // State cho modal ký duyệt
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [selectedItemForSigning, setSelectedItemForSigning] =
    useState<SettlementItem | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // All employees for dropdowns
  const [allEmployees, setAllEmployees] = useState<
    { id: string; fullName: string; departmentName?: string; role?: string }[]
  >([]);

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await authFetch("/api/auth/me");
        const json = await res.json();
        if (json) {
          setCurrentUser({
            id: json.id,
            fullname: json.fullname,
            role: json.role,
            significanceUrl: json.significanceUrl || "",
          });
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Fetch all employees for dropdowns
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await authFetch("/api/auth/employees?size=1000");
        const json = await res.json();
        const employees = json?.data?.content || [];

        const mappedEmployees = employees.map((emp: any) => ({
          id: emp.id,
          fullName: emp.fullName,
          departmentName: emp.departmentName,
          role: emp.role,
        }));

        setAllEmployees(mappedEmployees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setAllEmployees([]);
      }
    };

    fetchEmployees();
  }, []);

  // Fetch data khi filter thay đổi
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
        });
        if (keyword?.trim()) {
          params.append("keyword", keyword.trim());
        }

        if (from) {
          params.append("fromDate", from);
        }

        if (to) {
          params.append("toDate", to);
        }

        if (status) {
          params.append("status", status);
        }
        const res = await authFetch(
          `/api/construction/settlements?${params.toString()}`,
        );
        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }
        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const totalElements = pageData?.totalElements ?? 0;
        const totalPagesValue = pageData?.totalPages ?? 1;
        setTotalItems(totalElements);
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
          registrationAt: item.registrationAt,
          connectionFee: item.connectionFee,
          note: item.note,
          status: item.status,
        }));
        setData(mapped);
      } catch (error: any) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, keyword, reloadKey, sort, from, to, status]);

  // Hàm fetch chi tiết quyết toán
  const fetchSettlementDetail = async (settlementId: string) => {
    try {
      setIsDetailLoading(true);
      const res = await authFetch(
        `/api/construction/settlements/${settlementId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch settlement detail");
      }

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

  const handleSortChange = (columnKey: string) => {
    setPage(1);

    setSort((prev) => {
      const direction =
        prev.field === columnKey && prev.direction === "asc" ? "desc" : "asc";

      return {
        field: columnKey === "stt" ? "createdAt" : columnKey,
        direction,
      };
    });
  };

  const fetchSettlementDocument = async (id: string) => {
    try {
      setDocumentLoading(true);

      const res = await authFetch(`/api/construction/settlements/${id}`);

      if (!res.ok) throw new Error("Fetch failed");

      const json = await res.json();
      const detail = json?.data.data;

      const mapped = mapToDocumentRows(detail);

      setDocumentData(mapped);
      setSelectedSettlementId(id);
      setSelectedFormNumber(detail.formNumber);
      setIsDocumentModalOpen(true);
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message,
        color: "danger",
      });
    } finally {
      setDocumentLoading(false);
    }
  };

  const mapToDocumentRows = (detail: SettlementDetail) => {
    return [
      {
        id: detail.id || detail.id,
        stt: 1,
        formNumber: detail.formNumber,
        jobContent: detail.jobContent,
        note: detail.note,
        connectionFee: detail.connectionFee,
        address: detail.address,
        registrationAt: detail.registrationAt,
        status: detail.status,
      },
    ];
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

  // Handle create signature request (gửi yêu cầu ký đến các bên)
  const handleCreateSignatureRequest = (item: SettlementItem) => {
    setSelectedItemForSign(item);
    setSurveyStaffId("");
    setPlanningHeadId("");
    setCompanyLeadershipId("");
    setConstructionPresidentId("");
    setIsCreateSignModalOpen(true);
  };

  const handleConfirmCreateSignatureRequest = async () => {
    if (!selectedItemForSign) return;

    // Validate at least one signer is selected
    if (
      !surveyStaffId &&
      !planningHeadId &&
      !companyLeadershipId &&
      !constructionPresidentId
    ) {
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
        ptHead: planningHeadId || null,
        president: companyLeadershipId || null,
        constructionPresident: constructionPresidentId || null,
      };

      const res = await authFetch(`/api/construction/settlements/sign`, {
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
        message: "Gửi yêu cầu ký duyệt quyết toán thành công",
        color: "success",
      });

      setIsCreateSignModalOpen(false);
      onDeleted(); // Refresh data
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

  // Handle sign action (người được phân công thực hiện ký)
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

    // Xác định field ký dựa trên role của user
    let signatureField = "";
    switch (currentUser.role) {
      case "COMPANY_LEADERSHIP":
        signatureField = "president";
        break;
      case "PLANNING_TECHNICAL_DEPARTMENT_HEAD":
        signatureField = "ptHead";
        break;
      case "survey_staff":
        signatureField = "surveyStaff";
        break;
      case "CONSTRUCTION_DEPARTMENT_HEAD":
        signatureField = "constructionPresident";
        break;
      default:
        CallToast({
          title: "Thất bại",
          message: "Bạn không có quyền ký duyệt quyết toán này",
          color: "danger",
        });
        return;
    }

    setIsProcessing(true);
    try {
      const requestBody: any = {};
      requestBody[signatureField] = currentUser.significanceUrl;

      const res = await authFetch(
        `/api/construction/settlements/sign/${selectedItemForSigning.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("Bạn không có quyền thực hiện hành động này");
        }
        if (res.status === 404) {
          throw new Error("Không tìm thấy bản quyết toán");
        }
        const err = await res.json();
        throw new Error(err.message || "Ký duyệt thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Ký duyệt quyết toán thành công",
        color: "success",
      });

      setIsSignModalOpen(false);
      onDeleted(); // Refresh data
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

  // Lọc nhân viên theo role cho từng dropdown
  const surveyStaffOptions = allEmployees.filter(
    (emp) => emp.role === "SURVEY_STAFF",
  );
  const planningHeadOptions = allEmployees.filter(
    (emp) => emp.role === "PLANNING_TECHNICAL_DEPARTMENT_HEAD",
  );
  const companyLeadershipOptions = allEmployees.filter(
    (emp) => emp.role === "COMPANY_LEADERSHIP",
  );
  const constructionPresidentOptions = allEmployees.filter(
    (emp) => emp.role === "CONSTRUCTION_DEPARTMENT_HEAD",
  );

  // Kiểm tra xem user có role được phép ký không
  // const canSign =
  //   currentUser?.role &&
  //   [
  //     "COMPANY_LEADERSHIP",
  //     "PLANNING_TECHNICAL_DEPARTMENT_HEAD",
  //     "SURVEY_STAFF",
  //     "CONSTRUCTION_DEPARTMENT_HEAD",
  //   ].includes(currentUser.role);

  const actionItems = useMemo(() => {
    return [
      // Nút ký duyệt - chỉ hiển thị khi user có quyền ký
      // ...(canSign
      //   ? [
      {
        content: "Ký duyệt",
        icon: ApprovalIcon,
        className: "text-green-600 hover:bg-green-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) handleSignAction(found);
        },
      },
      //   ]
      // : []),
      // Nút tạo yêu cầu ký
      {
        content: "Tạo yêu cầu ký",
        icon: PencilSquareIcon,
        className: "text-blue-600 hover:bg-blue-50",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) handleCreateSignatureRequest(found);
        },
      },
      {
        content: "Chỉnh sửa",
        icon: EditIcon,
        className:
          "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);
          if (found) onEdit(found);
        },
      },
      {
        content: "Xem chi tiết",
        icon: CalculatorIcon,
        className: "text-blue-600 hover:bg-blue-50",
        onClick: (id: string) => {
          fetchSettlementDetail(id);
        },
      },
    ];
  }, [data, onEdit]);

  const renderCell = (item: SettlementItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip key={idx} content={action.content} closeDelay={0}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className={`${action.className} rounded-lg`}
                  onPress={() => action.onClick(item.id)}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </Tooltip>
            ))}
          </div>
        );
      default:
        const value = item[columnKey as keyof SettlementItem];

        if (value && typeof value === "object") {
          console.warn(`Object found in column ${columnKey}:`, value);
          return <span className="text-gray-600">-</span>;
        }

        return (
          <span className="text-gray-600 dark:text-default-600">
            {String(value || "")}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spinner label="Đang tải dữ liệu..." />
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

      {/* Settlement Detail Modal */}
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

      {/* Modal for creating signature request */}
      <BaseModal
        isOpen={isCreateSignModalOpen}
        onOpenChange={() => setIsCreateSignModalOpen(false)}
        title={`Tạo yêu cầu ký duyệt - ${selectedItemForSign?.formCode || selectedItemForSign?.formNumber}`}
        size="2xl"
      >
        <div className="space-y-6 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mã đơn
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItemForSign?.formCode ||
                    selectedItemForSign?.formNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nội dung công việc
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItemForSign?.jobContent}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phí kết nối
                </p>
                {/* <p className="font-semibold text-primary">
                  {selectedItemForSign?.connectionFee?.toLocaleString("vi-VN")}{" "}
                  ₫
                </p> */}
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Địa chỉ
                </p>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {selectedItemForSign?.address}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Nhân viên khảo sát ký (SURVEY_STAFF)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={surveyStaffId}
                onChange={(e) => setSurveyStaffId(e.target.value)}
              >
                <option value="">-- Chọn nhân viên khảo sát --</option>
                {surveyStaffOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trưởng phòng Kế hoạch Kỹ thuật
                (PLANNING_TECHNICAL_DEPARTMENT_HEAD)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={planningHeadId}
                onChange={(e) => setPlanningHeadId(e.target.value)}
              >
                <option value="">-- Chọn trưởng phòng --</option>
                {planningHeadOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Lãnh đạo công ty (COMPANY_LEADERSHIP)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={companyLeadershipId}
                onChange={(e) => setCompanyLeadershipId(e.target.value)}
              >
                <option value="">-- Chọn lãnh đạo --</option>
                {companyLeadershipOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Giám đốc chi nhánh Xây lắp (CONSTRUCTION_DEPARTMENT_HEAD)
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={constructionPresidentId}
                onChange={(e) => setConstructionPresidentId(e.target.value)}
              >
                <option value="">-- Chọn giám đốc --</option>
                {constructionPresidentOptions.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.fullName}
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
        title={`Ký duyệt quyết toán - ${selectedItemForSigning?.formCode || selectedItemForSigning?.formNumber}`}
        size="2xl"
      >
        <div className="space-y-4 py-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Mã đơn
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItemForSigning?.formCode ||
                    selectedItemForSigning?.formNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nội dung công việc
                </p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {selectedItemForSigning?.jobContent}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Phí kết nối
                </p>
                {/* <p className="font-semibold text-primary">
                  {selectedItemForSigning?.connectionFee?.toLocaleString(
                    "vi-VN",
                  )}{" "}
                  ₫
                </p> */}
              </div>
            </div>
          </div>

          {/* Hiển thị thông tin người ký */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-xl font-semibold">
                  {currentUser?.fullname?.charAt(0) || "?"}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {currentUser?.fullname || "Đang tải..."}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Vai trò: {currentUser?.role?.replace(/_/g, " ") || "..."}
                </p>
              </div>
            </div>

            {currentUser?.significanceUrl ? (
              <div className="mt-3 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  Đã có chữ ký điện tử sẵn sàng
                </p>
              </div>
            ) : (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Chưa có chữ ký điện tử. Vui lòng cập nhật thông tin cá nhân.
                </p>
              </div>
            )}
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            <p>
              Bằng cách nhấn "Xác nhận ký", bạn đồng ý ký duyệt quyết toán này
              bằng chữ ký điện tử của mình.
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
            isDisabled={!currentUser?.significanceUrl}
          >
            Xác nhận ký
          </CustomButton>
        </div>
      </BaseModal>
    </>
  );
};
