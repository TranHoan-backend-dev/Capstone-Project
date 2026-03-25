"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import CustomButton from "@/components/ui/custom/CustomButton";
import EstimateInfoCard from "./estimate-info-card";
import SignerSelector from "./signer-selector";
import { EstimateOrder } from "./estimate-table";

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
          <SignerSelector
            label="Nhân viên khảo sát"
            value={surveyStaffId}
            employees={employees}
            onChange={onSurveyStaffChange}
            placeholder="-- Chọn nhân viên khảo sát --"
          />

          <SignerSelector
            label="Trưởng phòng Kế hoạch - Kỹ thuật"
            value={planningHeadId}
            employees={employees}
            onChange={onPlanningHeadChange}
            placeholder="-- Chọn trưởng phòng --"
          />

          <SignerSelector
            label="Giám đốc"
            value={companyLeadershipId}
            employees={employees}
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
