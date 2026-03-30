"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";

interface AssignConstructionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formCode: string;
  formNumber: string;
  customerName: string;
  customerId?: string;
  contractId?: string;
}

interface Employee {
  id: string;
  name: string;
}

export const AssignConstructionPopup = ({
  isOpen,
  onClose,
  onSuccess,
  formCode,
  formNumber,
  customerName,
  customerId,
  contractId: propContractId,
}: AssignConstructionPopupProps) => {
  const [selectedLeader, setSelectedLeader] = useState<Set<string>>(new Set());
  const [teamLeaders, setTeamLeaders] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contractId, setContractId] = useState<string | undefined>(
    propContractId,
  );
  const [fetchingContract, setFetchingContract] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchConstructionHead();
      if (!propContractId && formCode && formNumber) {
        fetchContractId();
      }
    }
  }, [isOpen, formCode, formNumber, propContractId]);

  const fetchContractId = async () => {
    setFetchingContract(true);
    setError(null);
    try {
      const res = await authFetch(
        `/api/customer/contracts/ids?formCode=${encodeURIComponent(formCode)}&formNumber=${encodeURIComponent(formNumber)}`,
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData?.message || "Không thể lấy thông tin hợp đồng",
        );
      }

      const json = await res.json();

      let fetchedContractId = null;

      if (json.data && Array.isArray(json.data) && json.data.length > 0) {
        fetchedContractId = json.data[0];
      } else if (json.data && typeof json.data === "string") {
        fetchedContractId = json.data;
      } else if (json.id) {
        fetchedContractId = json.id;
      }

      console.log("Parsed contractId:", fetchedContractId);

      if (!fetchedContractId) {
        throw new Error("Không tìm thấy hợp đồng cho đơn này");
      }

      setContractId(fetchedContractId);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi lấy thông tin hợp đồng",
      );
      console.error("Error fetching contract id:", err);
    } finally {
      setFetchingContract(false);
    }
  };

  const fetchConstructionHead = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/auth/employees/construction-staff");
      if (!res.ok) {
        throw new Error("Không thể tải danh sách nhân viên");
      }
      const json = await res.json();
      const allEmployees = json?.data ?? json?.data ?? [];

      setTeamLeaders(allEmployees);

      if (allEmployees.length === 0) {
        setError("Không tìm thấy đội trưởng đội thi công");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedLeader(keys);
    setError(null);
  };

  const handleSubmit = async () => {
    if (selectedLeader.size === 0) {
      setError("Vui lòng chọn đội trưởng đội thi công");
      return;
    }

    if (!contractId) {
      setError("Không tìm thấy thông tin hợp đồng, vui lòng thử lại");
      return;
    }

    const teamLeaderId = Array.from(selectedLeader)[0];

    setSubmitting(true);
    setError(null);

    try {
      const res = await authFetch(
        `/api/construction/constructions/${teamLeaderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formCode: formCode,
            formNumber: formNumber,
            contractId: contractId,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Giao thi công thất bại");
      }
      CallToast({
        title: "Thành công",
        message: "Giao nhiệm vụ thi công thành công!",
        color: "success",
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const selectOptions = teamLeaders.map((leader) => ({
    label: `${leader.name}`,
    value: leader.id,
  }));

  const isLoading = loading || fetchingContract;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Giao thi công</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">Mã đơn</p>
              <p className="font-medium">{formNumber}</p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <p className="text-sm text-gray-500">Tên công trình</p>
              <p className="font-medium">{customerName}</p>
            </div>

            {/* Hiển thị trạng thái fetching contractId nếu cần */}
            {fetchingContract && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Spinner size="sm" />
                <span>Đang tải thông tin hợp đồng...</span>
              </div>
            )}

            {isLoading && !fetchingContract ? (
              <div className="flex justify-center py-4">
                <Spinner size="lg" />
              </div>
            ) : (
              <CustomSelect
                label="Đội trưởng đội thi công"
                options={selectOptions}
                selectedKeys={selectedLeader}
                onSelectionChange={handleSelectionChange}
                isRequired
                isDisabled={
                  submitting || teamLeaders.length === 0 || fetchingContract
                }
              />
            )}

            {error && (
              <div className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                {error}
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="light"
            onPress={onClose}
            disabled={submitting || fetchingContract}
          >
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={submitting}
            isDisabled={
              submitting ||
              fetchingContract ||
              selectedLeader.size === 0 ||
              teamLeaders.length === 0 ||
              !contractId
            }
          >
            Xác nhận giao
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
