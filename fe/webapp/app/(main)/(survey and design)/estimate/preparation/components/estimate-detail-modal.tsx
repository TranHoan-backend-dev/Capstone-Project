"use client";

import React, { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { ModalHeader } from "@/components/popup-status/modal-header";
import { InfoRow } from "@/components/popup-status/info-row";
import { PriceBox } from "@/components/popup-status/price-box";
import { NoteField } from "@/components/popup-status/note-field";
import { numberToVietnamese } from "@/utils/numberToVietnamese";
import { Chip } from "@heroui/react";
import { authFetch } from "@/utils/authFetch";

export const statusLabelMap: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PROCESSING: "Đang xử lý",
  WAITING_FOR_SIGNATURE: "Chờ ký duyệt",
  PARTIALLY_SIGNED: "Đang ký",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
  PENDING_FOR_APPROVAL: "Chờ lập dự toán",
};

export const statusColorMap: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  PENDING: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-600",
  },
  PROCESSING: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-600",
  },
  WAITING_FOR_SIGNATURE: {
    bg: "bg-purple-50",
    text: "text-purple-700",
    dot: "bg-purple-600",
  },
  PARTIALLY_SIGNED: {
    bg: "bg-indigo-50",
    text: "text-indigo-700",
    dot: "bg-indigo-600",
  },
  APPROVED: {
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-600",
  },
  REJECTED: {
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-600",
  },
  PENDING_FOR_APPROVAL: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-600",
  },
};

const roleNameMap: Record<string, string> = {
  survey_staff: "Nhân viên khảo sát",
  planning_technical_head: "Trưởng phòng Kế hoạch Kỹ thuật",
  company_leader: "Lãnh đạo công ty",
};

export const EstimateDetailModal = ({ isOpen, onClose, data }: any) => {
  if (!isOpen) return null;
  const [creatorName, setCreatorName] = useState("Đang tải...");
  const [isLoadingCreator, setIsLoadingCreator] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      // Nếu không có creator hoặc creator là null/undefined
      if (
        !data?.creator ||
        data.creator === null ||
        data.creator === undefined
      ) {
        setCreatorName("Chưa có người lập");
        return;
      }

      setIsLoadingCreator(true);
      try {
        const res = await authFetch(`/api/auth/employees/${data.creator}/name`);

        // Kiểm tra response status
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        const emp = json?.data;

        // Kiểm tra dữ liệu trả về
        if (emp && emp !== null) {
          setCreatorName(emp);
        } else {
          setCreatorName("Không tìm thấy thông tin");
        }
      } catch (err) {
        console.error("Error fetching creator:", err);
        setCreatorName("Không lấy được thông tin");
      } finally {
        setIsLoadingCreator(false);
      }
    };

    fetchCreator();
  }, [data?.creator]);

  const getSignerDisplayName = (roleValue?: string) => {
    if (!roleValue || roleValue === "") return "Chưa có thông tin";
    return roleNameMap[roleValue] || roleValue;
  };

  const statusColors = statusColorMap[data.status] || {
    bg: "bg-gray-50",
    text: "text-gray-700",
    dot: "bg-gray-600",
  };

  const significance = data?.significance || {};

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin dự toán" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <InfoRow
              label="Mã đơn đăng ký"
              value={
                <span className="text-black-600 font-medium">
                  {data.code || "Chưa có mã"}
                </span>
              }
            />

            <InfoRow
              label="Địa chỉ lắp đặt"
              value={data.address || "Chưa có địa chỉ"}
            />

            <InfoRow
              label="Ngày đăng ký"
              value={data.registerDate || "Chưa có ngày"}
            />

            <InfoRow
              label="Trạng thái"
              value={
                <Chip
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 ${statusColors.bg} ${statusColors.text} rounded-md`}
                >
                  <span
                    className={`w-1.5 h-1.5 ${statusColors.dot} rounded-full`}
                  />
                  {statusLabelMap[data.status] ??
                    data.status ??
                    "Không xác định"}
                </Chip>
              }
            />

            <div className="border-t border-gray-200 my-4" />

            <InfoRow
              label="Người lập chiết tính"
              value={
                isLoadingCreator ? (
                  <span className="text-gray-500">Đang tải...</span>
                ) : (
                  creatorName
                )
              }
            />
            <InfoRow
              label="Ngày lập chiết tính"
              value={data.createDate || "Chưa có ngày"}
            />

            <div className="border-t border-gray-200 my-4" />

            <InfoRow
              label="Tổng giá trị công trình"
              value={
                <PriceBox
                  text={numberToVietnamese(data.totalPrice) + " đồng"}
                  value={data.totalPrice}
                />
              }
            />

            {/* Thêm phần thông tin ký duyệt */}
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
                      {significance?.surveyStaff || "Chưa có thông tin"}
                    </span>
                  </div>
                }
              />

              <InfoRow
                label="Trưởng phòng Kế hoạch Kỹ thuật"
                value={
                  <div className="flex items-center gap-2">
                    <span>
                      {significance?.planningTechnicalHead ||
                        "Chưa có thông tin"}
                    </span>
                  </div>
                }
              />

              <InfoRow
                label="Lãnh đạo công ty"
                value={
                  <div className="flex items-center gap-2">
                    {significance?.companyLeaderShip || "Chưa có thông tin"}
                  </div>
                }
              />
            </div>

            <div className="border-t border-gray-200 my-4" />

            <InfoRow label="Ghi chú" value={<NoteField value={data.note} />} />
          </div>
        </div>
      </div>
    </>
  );
};
