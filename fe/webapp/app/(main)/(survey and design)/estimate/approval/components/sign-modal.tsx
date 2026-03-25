"use client";

import React from "react";
import BaseModal from "@/components/ui/modal/BaseModal";
import CustomButton from "@/components/ui/custom/CustomButton";
import EstimateInfoCard from "./estimate-info-card";
import UserInfoCard from "./user-info-card";
import { EstimateOrder } from "./estimate-table";

interface SignModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  selectedItem: EstimateOrder | null;
  currentUser: {
    fullname: string;
    role: string;
    significanceUrl: string;
  } | null;
  isProcessing: boolean;
  onConfirm: () => void;
}

const SignModal = ({
  isOpen,
  onOpenChange,
  selectedItem,
  currentUser,
  isProcessing,
  onConfirm,
}: SignModalProps) => {
  const handleClose = () => {
    onOpenChange();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={`Ký duyệt dự toán - ${selectedItem?.code}`}
      size="2xl"
    >
      <div className="space-y-4 py-4">
        <EstimateInfoCard
          customerName={selectedItem?.designProfileName}
          totalAmount={selectedItem?.totalAmount}
          showAddress={false}
        />

        <UserInfoCard
          fullname={currentUser?.fullname || ""}
          role={currentUser?.role || ""}
          significanceUrl={currentUser?.significanceUrl}
        />

        <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          <p>
            Bằng cách nhấn "Xác nhận ký", bạn đồng ý ký duyệt dự toán này bằng
            chữ ký điện tử của mình.
          </p>
        </div>
      </div>

      <div className="flex gap-3 pt-6 border-t border-divider">
        <CustomButton onPress={handleClose} color="default" variant="bordered">
          Hủy
        </CustomButton>
        <CustomButton
          onPress={onConfirm}
          isLoading={isProcessing}
          color="success"
          isDisabled={!currentUser?.significanceUrl}
        >
          Xác nhận ký
        </CustomButton>
      </div>
    </BaseModal>
  );
};

export default SignModal;
