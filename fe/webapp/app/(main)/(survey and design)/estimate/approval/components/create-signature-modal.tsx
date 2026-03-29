"use client";

import React, { useMemo } from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import CustomButton from "@/components/ui/custom/CustomButton";
import EstimateInfoCard from "./estimate-info-card";
import SignerSelector from "./signer-selector";
import { EstimateOrder } from "@/types";

interface Employee {
  id: string;
  fullName: string;
  departmentName?: string;
  role?: string;
}

interface CreateSignatureModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedItem: EstimateOrder | null;
  surveyStaffId: string;
  planningHeadId: string;
  companyLeadershipId: string;
  employees: Employee[];
  isProcessing: boolean;
  onSurveyStaffChange: (value: string) => void;
  onPlanningHeadChange: (value: string) => void;
  onCompanyLeadershipChange: (value: string) => void;
  onConfirm: () => void;
}

const CreateSignatureModal = ({
  isOpen,
  onOpenChange,
  selectedItem,
  surveyStaffId,
  planningHeadId,
  companyLeadershipId,
  employees,
  isProcessing,
  onSurveyStaffChange,
  onPlanningHeadChange,
  onCompanyLeadershipChange,
  onConfirm,
}: CreateSignatureModalProps) => {
  const handleClose = () => {
    onOpenChange();
  };

  // Lọc nhân viên khảo sát
  const surveyStaffList = useMemo(() => {
    return employees.filter((emp) => emp.departmentName === "Khảo sát");
  }, [employees]);

  // Lọc trưởng phòng kế hoạch - kỹ thuật
  const planningHeadList = useMemo(() => {
    return employees.filter(
      (emp) => emp.departmentName === "Kế hoạch - Kỹ thuật",
    );
  }, [employees]);

  // Lọc ban lãnh đạo
  const leadershipList = useMemo(() => {
    return employees.filter((emp) => emp.departmentName === "Ban lãnh đạo");
  }, [employees]);

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Tạo yêu cầu ký duyệt - ${selectedItem?.code}`}
      size="2xl"
    >
      <div className="space-y-6 py-4">
        <EstimateInfoCard
          customerName={selectedItem?.designProfileName}
          totalAmount={selectedItem?.totalAmount}
          installationAddress={selectedItem?.installationAddress}
        />

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Nhân viên khảo sát:</span>
            <span className="text-gray-700">
              {surveyStaffList[0]?.fullName ||
                "Chưa có thông tin"}
            </span>
          </div>

          <SignerSelector
            label="Trưởng phòng Kế hoạch - Kỹ thuật"
            value={planningHeadId}
            employees={planningHeadList}
            onChange={onPlanningHeadChange}
            placeholder="-- Chọn trưởng phòng --"
          />

          <SignerSelector
            label="Giám đốc"
            value={companyLeadershipId}
            employees={leadershipList}
            onChange={onCompanyLeadershipChange}
            placeholder="-- Chọn giám đốc --"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-divider">
        <CustomButton
          onPress={handleClose}
          className="font-medium"
          color="default"
          variant="bordered"
        >
          Hủy
        </CustomButton>
        <CustomButton
          onPress={onConfirm}
          isLoading={isProcessing}
          className="text-white font-medium"
          color="primary"
        >
          Tạo yêu cầu
        </CustomButton>
      </div>
    </BaseModal>
  );
};

export default CreateSignatureModal;
