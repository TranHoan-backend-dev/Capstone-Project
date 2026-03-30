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

interface AssignConstructionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  formCode: string;
  formNumber: string;
  contractId?: string;
  id: string;
}

interface Employee {
  id: string;
  name: string;
  code?: string;
  position?: string;
}

export const AssignConstructionPopup = ({
  isOpen,
  onClose,
  onSuccess,
  id,
  formCode,
  formNumber,
  contractId: propContractId,
}: AssignConstructionPopupProps) => {
  const [selectedConstructionStaff, setSelectedConstructionStaff] = useState<
    Set<string>
  >(new Set());
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
      fetchConstructionStaff();
      // Nếu chưa có contractId, có thể fetch từ API
      if (!propContractId && formCode) {
        fetchContractByFormCode();
      }
    }
  }, [isOpen, formCode, formNumber, propContractId]);

  const fetchConstructionStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/auth/employees/construction-staff");
      if (!res.ok) {
        throw new Error("Không thể tải danh sách nhân viên");
      }

      const json = await res.json();
      const allEmployees = json?.data || json || [];

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

  const fetchContractByFormCode = async () => {
    setFetchingContract(true);
    try {
      // API để lấy contractId từ formCode
      const res = await authFetch(
        `/api/construction/contract/by-form-code/${formCode}`,
      );
      if (res.ok) {
        const data = await res.json();
        setContractId(data?.contractId || data?.id);
      }
    } catch (err) {
      console.error("Error fetching contract:", err);
    } finally {
      setFetchingContract(false);
    }
  };

  const handleSelectionChange = (keys: Set<string>) => {
    setSelectedConstructionStaff(keys);
    setError(null);
  };

  const handleSubmit = async () => {
    if (selectedConstructionStaff.size === 0) {
      setError("Vui lòng chọn đội trưởng đội thi công");
      return;
    }

    if (!contractId && !formCode) {
      setError("Không tìm thấy thông tin hợp đồng, vui lòng thử lại");
      return;
    }

    const constructionStaffId = Array.from(selectedConstructionStaff)[0];

    setSubmitting(true);
    setError(null);

    try {
      let endpoint = "";
      if (contractId) {
        endpoint = `/api/construction/constructions/pending-requests/${id}/${constructionStaffId}`;
      } else {
        throw new Error("Không có thông tin để giao thi công");
      }

      const res = await authFetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Giao thi công thất bại");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      console.error("Submit error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const selectOptions = teamLeaders.map((leader) => ({
    label: `${leader.name}${leader.code ? ` (${leader.code})` : ""}`,
    value: leader.id,
  }));

  const isLoading = loading || fetchingContract;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Giao thi công
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                {/* Thông tin đơn hàng */}
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Mã đơn</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {formNumber || formCode}
                  </p>
                </div>

                {contractId && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 mb-1">Mã hợp đồng</p>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {contractId}
                    </p>
                  </div>
                )}

                {isLoading && !fetchingContract ? (
                  <div className="flex justify-center py-8">
                    <Spinner
                      size="lg"
                      label="Đang tải danh sách nhân viên..."
                    />
                  </div>
                ) : (
                  <CustomSelect
                    label="Chọn đội trưởng đội thi công"
                    options={selectOptions}
                    selectedKeys={selectedConstructionStaff}
                    onSelectionChange={handleSelectionChange}
                    isRequired
                    isDisabled={
                      submitting || teamLeaders.length === 0 || fetchingContract
                    }
                  />
                )}

                {error && (
                  <div className="text-sm text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <span className="font-medium">Lỗi: </span>
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
                  selectedConstructionStaff.size === 0 ||
                  teamLeaders.length === 0 ||
                  (!contractId && !formCode)
                }
              >
                Xác nhận giao
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AssignConstructionPopup;
