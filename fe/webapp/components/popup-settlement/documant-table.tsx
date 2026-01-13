"use client";

import { SettlementDocumentRow } from "@/types";

export const DocumentTable = ({ data }: { data: SettlementDocumentRow[] }) => {
  const rowStyle = "border border-black text-center";

  return (
    <table className="w-full border-collapse text-xs border border-black">
      <thead>
        <tr>
          {[
            "STT",
            "Mã hiệu",
            "Tên công việc",
            "ĐVT",
            "KL",
            "Đơn giá",
            "Thành tiền",
          ].map((title, idx) => (
            <th key={idx} className={rowStyle} rowSpan={2}>
              {title}
            </th>
          ))}
        </tr>
        <tr>
          {["VL", "NC", "VL", "NC"].map((title, idx) => (
            <th key={idx} className={rowStyle}>
              {title}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td className={rowStyle}>{row.stt}</td>
            <td className={rowStyle}>{row.code}</td>
            <td className="border border-black px-1">{row.name}</td>
            <td className={rowStyle}>{row.unit}</td>
            <td className={rowStyle}>{row.quantity}</td>
            {[row.priceVL, row.priceNC, row.totalVL, row.totalNC].map(
              (item, idx) => (
                <td key={idx} className="border border-black text-right">
                  {item}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};
