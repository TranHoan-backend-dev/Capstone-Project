// components/AssignConstructionPopup.tsx
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
  customerName: string;
  customerId?: string;
  contractId?: string;
}

interface Employee {
  id: string;
  fullName: string;
  departmentName: string;
  email?: string;
  phoneNumber?: string;
}

export const AssignConstructionPopup = ({
  isOpen,
  onClose,
  onSuccess,
  formCode,
  formNumber,
  customerName,
  customerId,
  contractId,
}: AssignConstructionPopupProps) => {
  const [selectedLeader, setSelectedLeader] = useState<Set<string>>(new Set());
  const [teamLeaders, setTeamLeaders] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách đội trưởng đội thi công
  useEffect(() => {
    if (isOpen) {
      fetchConstructionHead();
    }
  }, [isOpen]);

  const fetchConstructionHead = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch("/api/auth/employees");
      if (!res.ok) {
        throw new Error("Không thể tải danh sách nhân viên");
      }
      const json = await res.json();
      const allEmployees = json?.data?.content ?? json?.data ?? [];

      // Lọc chỉ lấy nhân viên thuộc phòng Xây dựng hoặc có role phù hợp
      // Bạn có thể điều chỉnh điều kiện lọc theo nghiệp vụ
      const constructionStaff = allEmployees.filter((emp: Employee) => {
        // Lọc theo departmentName hoặc fullName chứa từ khóa "xây dựng", "thi công"
        return (
          emp.departmentName?.toLowerCase().includes("xây dựng") ||
          emp.departmentName?.toLowerCase().includes("thi công") ||
          emp.fullName?.toLowerCase().includes("đội trưởng") ||
          emp.fullName?.toLowerCase().includes("thi công")
        );
      });

      setTeamLeaders(constructionStaff);

      // Nếu không có nhân viên nào được lọc, hiển thị thông báo
      if (constructionStaff.length === 0) {
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
            customerId: customerId,
            contractId: contractId,
          }),
        },
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Giao thi công thất bại");
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  // Chuyển đổi danh sách đội trưởng thành options cho CustomSelect
  const selectOptions = teamLeaders.map((leader) => ({
    label: `${leader.fullName}${leader.departmentName ? ` - ${leader.departmentName}` : ""}`,
    value: leader.id,
  }));

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

            {loading ? (
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
                isDisabled={submitting || teamLeaders.length === 0}
              />
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose} disabled={submitting}>
            Hủy
          </Button>
          <Button
            color="primary"
            onPress={handleSubmit}
            isLoading={submitting}
            isDisabled={
              submitting ||
              selectedLeader.size === 0 ||
              teamLeaders.length === 0
            }
          >
            Xác nhận giao
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
