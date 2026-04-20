"use client";

import React from "react";
import { Spinner } from "@heroui/react";

import { ModalHeader } from "@/components/popup-status/modal-header";
import { DocumentPaper } from "@/components/popup-settlement/document-paper";
import { SettlementDetail } from "@/types";

interface SettlementDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data?: SettlementDetail;
  loading?: boolean;
}

export const SettlementDetailModal = ({
  isOpen,
  onClose,
  data,
  loading = false,
}: SettlementDetailModalProps) => {
  if (!isOpen) return null;

  const generalInformation = (data as any)?.generalInformation ?? {};

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("vi-VN");
  };

  const formatHeaderDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "";
    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);

    const [day, month, year] = formattedDate.split("/");
    if (!day || !month || !year) return "";
    return { day, month, year };
  };

  const baseMaterialsCandidate =
    (data as any)?.baseMaterials ??
    (data as any)?.data?.baseMaterials ??
    (data as any)?.content ??
    [];

  const baseMaterials = Array.isArray(baseMaterialsCandidate)
    ? baseMaterialsCandidate
    : [];

  const sumVL = baseMaterials.reduce((sum, row) => {
    const v =
      row?.totalMaterialPrice ??
      row?.totalPriceVL ??
      row?.totalMaterialCost ??
      row?.totalVL;
    return sum + parseNumber(v);
  }, 0);

  const sumNC = baseMaterials.reduce((sum, row) => {
    const v =
      row?.totalLaborPrice ??
      row?.totalPriceNC ??
      row?.totalLaborCost ??
      row?.totalNC;
    return sum + parseNumber(v);
  }, 0);

  const headerDate = formatHeaderDate(
    generalInformation?.createdAt ??
      generalInformation?.registrationAt ??
      (data as any)?.createdAt ??
      (data as any)?.registrationAt,
  );

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
          <ModalHeader title="Thông tin quyết toán" onClose={onClose} />

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
                          <span className="font-semibold">Mã quyết toán:</span>{" "}
                          {generalInformation?.settlementId ??
                            (data as any)?.settlementId ??
                            generalInformation?.formCode ??
                            generalInformation?.formNumber ??
                            "-"}
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
                        ) : (
                          <div className="italic mt-6">
                            {formatDate(
                              (data as any)?.createdAt ??
                                generalInformation?.createdAt ??
                                (data as any)?.registrationAt,
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <h1 className="text-center font-bold uppercase mt-2 mb-3">
                      QUYẾT TOÁN XÂY DỰNG CÔNG TRÌNH
                    </h1>

                    <div className="mb-3">
                      <div className="flex justify-between gap-4">
                        <div>
                          <span className="font-semibold">Tên công trình:</span>{" "}
                          <span>
                            {generalInformation?.jobContent ??
                              (data as any)?.jobContent ??
                              "-"}{" "}
                            {(generalInformation?.customerName as string) ? (
                              <span className="font-normal">
                                ({generalInformation?.customerName})
                              </span>
                            ) : null}
                          </span>
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
                        {baseMaterials.map((row: any, index: number) => (
                          <tr key={row?.materialCode ?? row?.id ?? index}>
                            <td className="border border-black px-1 py-1 text-center">
                              {index + 1}
                            </td>
                            <td className="border border-black px-1 py-1 text-center">
                              {row?.jobContent ?? "-"}
                            </td>
                            <td className="border border-black px-1 py-1 text-left">
                              {row?.note ?? row?.note ?? "-"}
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
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="font-semibold">
                          <td
                            colSpan={7}
                            className="border border-black px-1 py-1 text-right"
                          >
                            Tổng chi phí:
                          </td>
                          <td
                            colSpan={2}
                            className="border border-black px-1 py-1 text-right"
                          >
                            {formatNumber(
                              generalInformation?.connectionFee ?? 0,
                              0,
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>

                    {generalInformation?.note ? (
                      <div className="mt-3">
                        <span className="font-semibold">Ghi chú:</span>{" "}
                        <span>{generalInformation?.note}</span>
                      </div>
                    ) : null}

                    {/* Phần chữ ký */}
                    <div className="mt-8 grid grid-cols-4 gap-4 text-center text-xs">
                      <div>
                        <div className="font-semibold mb-1">
                          Nhân viên khảo sát
                        </div>
                        {generalInformation?.significance?.surveyStaff ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {generalInformation.significance.surveyStaff}
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
                        {generalInformation?.significance?.ptHead ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {generalInformation.significance.ptHead}
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400 italic">
                            Chưa ký
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold mb-1">
                          Giám đốc xây lắp
                        </div>
                        {generalInformation?.significance
                          ?.constructionPresident ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {
                              generalInformation.significance
                                .constructionPresident
                            }
                          </div>
                        ) : (
                          <div className="h-16 flex items-center justify-center text-gray-400 italic">
                            Chưa ký
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="font-semibold mb-1">Tổng giám đốc</div>
                        {generalInformation?.significance?.president ? (
                          <div className="h-16 flex items-center justify-center font-medium">
                            {generalInformation.significance.president}
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
