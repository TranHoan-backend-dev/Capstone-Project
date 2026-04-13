"use client";

import { InformationCircleIcon } from "@heroicons/react/24/solid";
import React from "react";
import { Spinner } from "@heroui/react";

import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { PriceBox } from "@/components/popup-status/price-box";
import { NoteField } from "@/components/popup-status/note-field";
import { SettlementDetail } from "@/types";

interface SettlementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: SettlementDetail;
  loading?: boolean;
}

const roleNameMap: Record<string, string> = {
  survey_staff: "Nhân viên khảo sát",
  technical_planning_head: "Trưởng phòng Kế hoạch Kỹ thuật",
  company_leader: "Lãnh đạo công ty",
};

export const SettlementDetailModal = ({
  isOpen,
  onClose,
  data,
  loading = false,
}: SettlementDetailModalProps) => {
  if (!isOpen) return null;

  const formatCurrency = (value?: number) => {
    if (!value && value !== 0) return "0 VNĐ";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Chưa cập nhật";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getSignerDisplayName = (roleValue?: string) => {
    if (!roleValue || roleValue === "") return "Chưa có thông tin";
    return roleNameMap[roleValue] || roleValue;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin quyết toán" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner label="Đang tải thông tin..." />
              </div>
            ) : data ? (
              <>
                <InfoRow
                  label="Mã đơn đăng ký"
                  value={
                    <span className="text-black-600 font-medium">
                      {data.formNumber || data.formCode}
                    </span>
                  }
                />

                <InfoRow label="Địa chỉ lắp đặt" value={data.address} />

                <InfoRow
                  label="Ngày đăng ký"
                  value={formatDate(data.registrationAt)}
                />

                <InfoRow label="Nội dung công việc" value={data.jobContent} />

                <div className="border-t border-gray-200 my-4" />

                <InfoRow
                  label="Ngày tạo quyết toán"
                  value={formatDate(data.createdAt)}
                />

                <InfoRow
                  label="Phí kết nối"
                  value={
                    <PriceBox
                      text="Phí kết nối"
                      value={formatCurrency(data.connectionFee)}
                    />
                  }
                />

                <div className="border-t border-gray-200 my-4" />

                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-700">
                    Thông tin ký duyệt
                  </h4>

                  <InfoRow
                    label="Nhân viên khảo sát"
                    value={
                      <div className="flex items-center gap-2">
                        <span>
                          {getSignerDisplayName(data.significance?.surveyStaff)}
                        </span>
                        {/* {data.significance?.surveyStaff && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            Đã chỉ định
                          </span>
                        )} */}
                      </div>
                    }
                  />

                  <InfoRow
                    label="Trưởng phòng Kế hoạch Kỹ thuật"
                    value={
                      <div className="flex items-center gap-2">
                        <span>
                          {getSignerDisplayName(data.significance?.ptHead)}
                        </span>
                        {/* {data.significance?.ptHead && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            Đã chỉ định
                          </span>
                        )} */}
                      </div>
                    }
                  />

                  <InfoRow
                    label="Lãnh đạo công ty"
                    value={
                      <div className="flex items-center gap-2">
                        <span>
                          {getSignerDisplayName(data.significance?.president)}
                        </span>
                        {/* {data.significance?.president && (
                          <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                            Đã chỉ định
                          </span>
                        )} */}
                      </div>
                    }
                  />
                </div>
                <div className="border-t border-gray-200 my-4" />
                <InfoRow
                  label="Ghi chú"
                  value={<NoteField value={data.note || "Không có ghi chú"} />}
                />
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Không tìm thấy thông tin chi tiết
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
