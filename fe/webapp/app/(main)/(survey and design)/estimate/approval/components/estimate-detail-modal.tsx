"use client";

import React from "react";
import { Spinner } from "@heroui/react";

import { ModalHeader } from "@/components/popup-status/modal-header";
import { DocumentPaper } from "@/components/popup-settlement/document-paper";

interface EstimateDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: any;
  loading?: boolean;
}

export const EstimateDetailModal = ({
  isOpen,
  onClose,
  data,
  loading = false,
}: EstimateDetailModalProps) => {
  if (!isOpen) return null;

  const generalInformation = data?.generalInformation ?? {};
  const significance = generalInformation?.significance ?? {};

  const parseNumber = (value: unknown) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    const str = String(value).trim();
    if (!str) return 0;
    const normalized = str.replace(/[^\d.-]/g, "");
    const num = Number(normalized);
    return Number.isFinite(num) ? num : 0;
  };

  const formatNumber = (value: unknown, maximumFractionDigits = 3) => {
    const num = parseNumber(value);
    return num.toLocaleString("vi-VN", { maximumFractionDigits });
  };

  const formatHeaderDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return null;
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
    const [day, month, year] = formattedDate.split("/");
    if (!day || !month || !year) return null;
    return { day, month, year };
  };

  const materialsCandidate = data?.materials ?? data?.baseMaterials ?? [];
  const materials = Array.isArray(materialsCandidate) ? materialsCandidate : [];

  const headerDate = formatHeaderDate(
    generalInformation?.createdAt ?? generalInformation?.registrationAt,
  );

  const formCode =
    generalInformation?.installationFormId?.formNumber ??
    generalInformation?.installationFormId?.formCode ??
    generalInformation?.formCode ??
    "-";

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <ModalHeader title="Thông tin dự toán" onClose={onClose} />

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner label="Đang tải thông tin..." />
              </div>
            ) : data ? (
              <div className="flex justify-center">
                <DocumentPaper>
                  <div className="text-xs">
                    <div className="grid grid-cols-2 gap-8 mb-2">
                      <div>
                        <div className="font-bold uppercase">
                          CÔNG TY CỔ PHẦN CẤP NƯỚC NAM ĐỊNH
                        </div>
                        <div className="mt-1 font-bold uppercase">
                          CHI NHÁNH XÂY LẮP
                        </div>
                        <div className="mt-3">
                          <span className="font-semibold">Số đơn:</span>{" "}
                          {formCode}
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="font-bold uppercase">
                          CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                        </div>
                        <div className="font-semibold underline">
                          Độc lập - Tự do - Hạnh phúc
                        </div>
                        {headerDate ? (
                          <div className="italic mt-6">
                            Nam Định, Ngày {headerDate.day} tháng{" "}
                            {headerDate.month} năm {headerDate.year}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <h1 className="text-center font-bold uppercase mt-2 mb-3">
                      DỰ TOÁN XÂY DỰNG CÔNG TRÌNH
                    </h1>

                    <div className="mb-3">
                      <div className="flex justify-between gap-4">
                        <div>
                          <span className="font-semibold">Khách hàng:</span>{" "}
                          <span>{generalInformation?.customerName ?? "-"}</span>
                        </div>
                        <div>
                          <span className="font-semibold">
                            Địa điểm lắp đặt:
                          </span>{" "}
                          <span>{generalInformation?.address ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    <h2 className="text-center font-bold uppercase mb-3">
                      BẢNG TỔNG HỢP KHỐI LƯỢNG
                    </h2>

                    <table
                      className="w-full border-collapse text-[10px] border border-black"
                      style={{ tableLayout: "auto" }}
                    >
                      <thead>
                        <tr>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            STT
                          </th>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            Tên vật tư
                          </th>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-left font-semibold"
                          >
                            Ghi chú
                          </th>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            Đơn vị tính
                          </th>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            Khối lượng
                          </th>
                          <th
                            colSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            Đơn giá
                          </th>
                          <th
                            colSpan={2}
                            className="border border-black px-1 py-1 text-center font-semibold"
                          >
                            Thành tiền
                          </th>
                        </tr>
                        <tr>
                          <th className="border border-black px-1 py-1 text-center font-semibold">
                            VL
                          </th>
                          <th className="border border-black px-1 py-1 text-center font-semibold">
                            NC
                          </th>
                          <th className="border border-black px-1 py-1 text-center font-semibold">
                            VL
                          </th>
                          <th className="border border-black px-1 py-1 text-center font-semibold">
                            NC
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {materials.length > 0 ? (
                          materials.map((row: any, index: number) => (
                            <tr key={row?.materialCode ?? index}>
                              <td className="border border-black px-1 py-1 text-center">
                                {index + 1}
                              </td>
                              <td className="border border-black px-1 py-1 text-center">
                                {row?.jobContent ?? row?.materialName ?? "-"}
                              </td>
                              <td className="border border-black px-1 py-1 text-left">
                                {row?.note || "-"}
                              </td>
                              <td className="border border-black px-1 py-1 text-center">
                                {row?.unit ?? row?.uom ?? "-"}
                              </td>
                              <td className="border border-black px-1 py-1 text-right">
                                {formatNumber(row?.mass ?? row?.quantity ?? 0)}
                              </td>
                              <td className="border border-black px-1 py-1 text-right">
                                {formatNumber(row?.materialCost ?? 0)}
                              </td>
                              <td className="border border-black px-1 py-1 text-right">
                                {formatNumber(
                                  row?.laborPriceAtRuralCommune ??
                                    row?.laborPrice ??
                                    0,
                                )}
                              </td>
                              <td className="border border-black px-1 py-1 text-right">
                                {formatNumber(row?.totalMaterialPrice ?? 0)}
                              </td>
                              <td className="border border-black px-1 py-1 text-right">
                                {formatNumber(row?.totalLaborPrice ?? 0)}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={9}
                              className="border border-black px-1 py-3 text-center text-gray-400 italic"
                            >
                              Không có dữ liệu vật tư
                            </td>
                          </tr>
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="font-semibold">
                          <td
                            colSpan={7}
                            className="border border-black px-1 py-1 text-right"
                          >
                            Tổng tiền:
                          </td>
                          <td
                            colSpan={2}
                            className="border border-black px-1 py-1 text-right"
                          >
                            {formatNumber(
                              generalInformation?.totalAmount ??
                                generalInformation?.totalPrice ??
                                0,
                              0,
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {generalInformation?.note ? (
                      <div className="mt-3">
                        <span className="font-semibold">Ghi chú:</span>{" "}
                        <span>{generalInformation.note}</span>
                      </div>
                    ) : null}

                    <div className="mt-8 grid grid-cols-3 gap-4 text-center text-xs">
                      <div>
                        <div className="font-semibold mb-1">
                          Nhân viên khảo sát
                        </div>
                        {significance?.surveyStaff ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {significance.surveyStaff}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400 italic">
                            Chưa ký
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold mb-1">
                          Trưởng phòng KH-KT
                        </div>
                        {significance?.planningTechnicalHead ?? significance?.ptHead ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {significance.planningTechnicalHead ?? significance.ptHead}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400 italic">
                            Chưa ký
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold mb-1">Giám đốc</div>
                        {significance?.companyLeaderShip ?? significance?.constructionPresident ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {significance.companyLeaderShip ?? significance.constructionPresident}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400 italic">
                            Chưa ký
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </DocumentPaper>
              </div>
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
