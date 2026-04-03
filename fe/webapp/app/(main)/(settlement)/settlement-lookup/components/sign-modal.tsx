"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  Divider,
} from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";
import { PencilIcon } from "@/config/chip-and-icon";

interface SignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  settlementInfo: {
    id: string;
    formCode: string;
    formNumber: string;
  } | null;
  isLoading: boolean;
  signatureUrl: string;
  userRole: string;
}

const roleMap: Record<string, string> = {
  COMPANY_LEADERSHIP: "Tổng giám đốc",
  PLANNING_TECHNICAL_DEPARTMENT_HEAD: "Trưởng phòng Kế hoạch Kỹ thuật",
  SURVEY_STAFF: "Nhân viên khảo sát",
  CONSTRUCTION_DEPARTMENT_HEAD: "Giám đốc chi nhánh Xây lắp",
};

export const SignModal = ({
  isOpen,
  onClose,
  onConfirm,
  settlementInfo,
  isLoading,
  signatureUrl,
  userRole,
}: SignModalProps) => {
  if (!settlementInfo) return null;

  const roleName = roleMap[userRole] || userRole;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <span>Ký duyệt quyết toán</span>
              <span className="text-sm font-normal text-gray-500">
                Mã đơn: {settlementInfo.formCode} - Số:{" "}
                {settlementInfo.formNumber}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Vai trò ký duyệt: <strong>{roleName}</strong>
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    Chữ ký điện tử của bạn:
                  </p>
                  {signatureUrl ? (
                    <div className="border rounded-lg p-2 bg-white">
                      <Image
                        src={signatureUrl}
                        alt="Chữ ký điện tử"
                        className="max-h-20 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="text-red-500 text-sm">
                      Chưa có chữ ký điện tử
                    </div>
                  )}
                </div>

                <Divider />

                <p className="text-xs text-gray-400 text-center">
                  Hành động này sẽ sử dụng chữ ký điện tử của bạn để xác nhận
                  duyệt quyết toán
                </p>
              </div>
            </ModalBody>
            <ModalFooter>
              <CustomButton variant="light" onPress={onClose}>
                Hủy
              </CustomButton>
              <CustomButton
                color="success"
                className="text-white hover:bg-success-600 disabled:bg-success-300 disabled:text-white/50"
                onPress={onConfirm}
                isLoading={isLoading}
                isDisabled={!signatureUrl}
                startContent={
                  !isLoading ? <PencilIcon className="w-4 h-4" /> : null
                }
              >
                Xác nhận ký
              </CustomButton>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
