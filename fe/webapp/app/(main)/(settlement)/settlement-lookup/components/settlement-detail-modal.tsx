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

  const getSignerName = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return (
      value.fullName ??
      value.name ??
      value.username ??
      value.signerName ??
      value.id ??
      ""
    );
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

  const signRoles = [
    {
      title: "Nhân viên khảo sát",
      name: getSignerName((data as any)?.significance?.surveyStaff),
    },
    {
      title: "Trưởng phòng KHKT",
      name: getSignerName((data as any)?.significance?.ptHead),
    },
    {
      title: "Giám Đốc",
      name: getSignerName((data as any)?.significance?.president),
    },
    {
      title: "Nhân viên xây dựng",
      name:
        getSignerName((data as any)?.significance?.constructionPresident) ||
        getSignerName((data as any)?.significance?.constructionStaff),
    },
  ];

  const headerDate = formatHeaderDate(
    (data as any)?.createdAt ?? (data as any)?.registrationAt,
  );

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

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {loading ? (
              <div className="flex justify-center items-center py-10">
                <Spinner label="Đang tải thông tin..." />
              </div>
            ) : data ? (
              <div className="flex justify-center">
                <DocumentPaper signRoles={signRoles}>
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
                          <span className="font-semibold">Mã đơn:</span>{" "}
                          {(data as any)?.formCode ??
                            generalInformation?.settlementId ??
                            (data as any)?.formNumber ??
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
                            Nam Định, Ngày {headerDate.day} tháng {headerDate.month}{" "}
                            năm {headerDate.year}
                          </div>
                        ) : (
                          <div className="italic mt-6">
                            {formatDate(
                              (data as any)?.createdAt ??
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
                            {((data as any)?.customerName as string) ? (
                              <span className="font-normal">
                                ({(data as any)?.customerName})
                              </span>
                            ) : null}
                          </span>
                        </div>
                        <div>
                          <span className="font-semibold">Địa điểm lắp đặt:</span>{" "}
                          <span>{(data as any)?.address ?? "-"}</span>
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
                            Mã Hiệu
                          </th>
                          <th
                            rowSpan={2}
                            className="border border-black px-1 py-1 text-left font-semibold"
                          >
                            Tên công việc
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
                              {row?.materialCode ?? "-"}
                            </td>
                            <td className="border border-black px-1 py-1 text-left">
                              {row?.jobContent ?? row?.note ?? "-"}
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
                              {formatNumber(row?.laborPriceAtRuralCommune ?? row?.laborPrice ?? 0)}
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
                    </table>

                    <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
                      <div className="col-span-2 flex justify-end gap-6">
                        <div>
                          <div className="font-semibold">Tổng VL</div>
                          <div>{formatNumber(sumVL, 3)}</div>
                        </div>
                        <div>
                          <div className="font-semibold">Tổng NC</div>
                          <div>{formatNumber(sumNC, 3)}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">Tổng cộng</div>
                        <div>{formatNumber(sumVL + sumNC, 3)}</div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex gap-6 text-xs">
                        <div className="flex-1">
                          <span className="font-semibold">Phí kết nối:</span>{" "}
                          {formatNumber((data as any)?.connectionFee ?? 0, 3)}
                        </div>
                      </div>
                      {(data as any)?.note ? (
                        <div className="mt-2">
                          <span className="font-semibold">Ghi chú:</span>{" "}
                          <span>{(data as any)?.note}</span>
                        </div>
                      ) : null}
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
