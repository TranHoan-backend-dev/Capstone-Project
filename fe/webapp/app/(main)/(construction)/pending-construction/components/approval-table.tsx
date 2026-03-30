"use client";

import { Button, Tooltip, Spinner, Chip } from "@heroui/react";
import React, { useEffect, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { ApprovalIcon, RejectIcon } from "@/config/chip-and-icon";
import { authFetch } from "@/utils/authFetch";
import { useProfile } from "@/hooks/useLogin";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { BackendConstructionData } from "@/types";
import { PENDING_TABLE_COLUMNS } from "@/config/table-columns";
import { getStatusColor, getStatusText } from "@/utils/statusHelper";
import { CallToast } from "@/components/ui/CallToast";

interface ApprovedTableProps {
  refreshTrigger?: number;
  onApprove?: () => void;
}

export const ApprovedTable = ({
  refreshTrigger = 0,
  onApprove,
}: ApprovedTableProps) => {
  const { profile, loading: profileLoading, hasRole } = useProfile();
  const [data, setData] = useState<BackendConstructionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "approve" | "reject";
    item: BackendConstructionData | null;
    message: string;
  }>({
    isOpen: false,
    type: "approve",
    item: null,
    message: "",
  });

  const pageSize = 10;

  const canView = hasRole("survey_staff");
  const canApprove = hasRole("survey_staff");

  useEffect(() => {
    if (canView) {
      fetchApprovedData();
    }
  }, [page, refreshTrigger, canView]);

  const fetchApprovedData = async () => {
    setLoading(true);
    try {
      const res = await authFetch(
        `/api/construction/constructions?page=${page - 1}&size=${pageSize}&isApproved=false`,
      );

      if (!res.ok) {
        console.error("Failed to fetch approved data");
        CallToast({
          title: "Lỗi",
          message: "Không thể tải dữ liệu",
          color: "danger",
        });
        return;
      }

      const json = await res.json();
      const pageData = json?.data;
      const items = pageData?.content ?? [];
      setTotalItems(pageData?.page?.totalElements ?? 0);
      setTotalPages(pageData?.page?.totalPages ?? 1);

      const mapped = items.map(
        (item: BackendConstructionData, index: number) => ({
          ...item,
          stt: (page - 1) * pageSize + index + 1,
          contractId: item.contractId || "",
          formCode: item.installationForm?.formCode || "",
          formNumber: item.installationForm?.formNumber || "",
          customerName:
            item.installationForm?.customerName || "Chưa có thông tin",
          phoneNumber: item.installationForm?.phoneNumber || "",
          address: item.installationForm?.address || "",
          createdAt: formatDate(item.createdAt),
          registrationAt: item.installationForm?.registrationAt,
          constructedByFullName:
            item.installationForm?.constructedByFullName || "Chưa phân công",
          statusText: getStatusText(
            item.installationForm?.status?.construction,
          ),
          statusColor: getStatusColor(
            item.installationForm?.status?.construction,
          ),
          rawStatus: item.installationForm?.status?.construction,
          isApproved: item.isApproved,
          installationForm: item.installationForm,
        }),
      );

      setData(mapped);
    } catch (error) {
      console.error("Error fetching approved data:", error);
      CallToast({
        title: "Lỗi",
        message: "Không thể tải dữ liệu",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("vi-VN");
    } catch {
      return dateString;
    }
  };

  const openConfirmModal = (
    type: "approve" | "reject",
    item: BackendConstructionData,
  ) => {
    const customerName =
      item.installationForm?.customerName || "công trình này";
    const message =
      type === "approve"
        ? `Bạn có chắc chắn muốn DUYỆT đơn thi công cho công trình "${customerName}"?`
        : `Bạn có chắc chắn muốn TỪ CHỐI đơn thi công cho công trình "${customerName}"?`;

    setConfirmModal({
      isOpen: true,
      type,
      item,
      message,
    });
  };

  const handleConfirm = async () => {
    const { type, item } = confirmModal;
    if (!item) return;

    if (type === "approve") {
      await handleReview(item, true);
    } else {
      await handleReview(item, false);
    }

    setConfirmModal({ ...confirmModal, isOpen: false });
  };

  const handleReview = async (
    item: BackendConstructionData,
    status: boolean,
  ) => {
    setProcessingId(item.id);
    try {
      const response = await authFetch(
        `/api/construction/review/${item.id}/${status}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.ok) {
        await fetchApprovedData();
        if (onApprove) {
          onApprove();
        }
        const message = status
          ? "Duyệt đơn thi công thành công"
          : "Từ chối đơn thi công thành công";
        CallToast({
          title: "Thành công",
          message: message,
          color: "success",
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        const message = status
          ? errorData?.message || "Duyệt đơn thất bại"
          : errorData?.message || "Từ chối đơn thất bại";
        CallToast({
          title: "Lỗi",
          message: message,
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Error reviewing:", error);
      const message = status
        ? "Có lỗi xảy ra khi duyệt đơn"
        : "Có lỗi xảy ra khi từ chối đơn";
      CallToast({
        title: "Lỗi",
        message: message,
        color: "danger",
      });
    } finally {
      setProcessingId(null);
    }
  };

  const renderCell = (item: any, columnKey: string) => {
    switch (columnKey) {
      case "formCode":
        return (
          <span className="font-medium text-blue-600">
            {item.installationForm?.formCode}
          </span>
        );

      case "contractId":
        return <span className="font-medium">{item.contractId || "--"}</span>;

      case "customerName":
        return (
          <span className="font-semibold">
            {item.installationForm?.customerName || "Chưa có thông tin"}
          </span>
        );

      case "phoneNumber":
        return <span>{item.installationForm?.phoneNumber || "--"}</span>;

      case "address":
        return (
          <span
            className="max-w-[200px] truncate block"
            title={item.installationForm?.address}
          >
            {item.installationForm?.address || "--"}
          </span>
        );

      case "constructedByFullName":
        const constructedByName = item.installationForm?.constructedByFullName;
        return (
          <span
            className={
              constructedByName === "Chưa phân công" || !constructedByName
                ? "text-orange-500"
                : "text-green-600"
            }
          >
            {constructedByName || "Chưa phân công"}
          </span>
        );

      case "status":
        return (
          <Chip color={item.statusColor} variant="flat" size="sm">
            {item.statusText}
          </Chip>
        );

      case "createdAt":
        return <span className="text-gray-600">{item.createdAt || "--"}</span>;

      case "actions":
        if (!canApprove) return null;

        // Chỉ hiển thị nút duyệt/từ chối khi status là PENDING_FOR_APPROVAL
        if (item.rawStatus !== "PENDING_FOR_APPROVAL") {
          return (
            <div className="flex items-center justify-center">
              <span className="text-gray-400 text-sm">Không thể thao tác</span>
            </div>
          );
        }

        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Duyệt đơn" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-green-600 hover:bg-green-50 rounded-lg"
                onPress={() => openConfirmModal("approve", item)}
                isLoading={processingId === item.id}
                isDisabled={processingId === item.id}
              >
                <ApprovalIcon className="w-5 h-5" />
              </Button>
            </Tooltip>

            <Tooltip content="Từ chối" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-red-600 hover:bg-red-50 rounded-lg"
                onPress={() => openConfirmModal("reject", item)}
                isLoading={processingId === item.id}
                isDisabled={processingId === item.id}
              >
                <RejectIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return (item as any)[columnKey];
    }
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <GenericDataTable
        title="Danh sách đơn chờ duyệt thi công"
        columns={PENDING_TABLE_COLUMNS}
        data={data}
        isCollapsible
        renderCellAction={renderCell}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length} / ${totalItems}`,
        }}
      />

      <Modal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            Xác nhận {confirmModal.type === "approve" ? "duyệt" : "từ chối"} đơn
          </ModalHeader>
          <ModalBody>
            <p>{confirmModal.message}</p>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() =>
                setConfirmModal({ ...confirmModal, isOpen: false })
              }
            >
              Hủy
            </Button>
            <Button
              color={confirmModal.type === "approve" ? "primary" : "danger"}
              onPress={handleConfirm}
            >
              {confirmModal.type === "approve" ? "Duyệt" : "Từ chối"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
