import { SettlementDocumentRow } from "@/types";

export const DocumentTable = ({ data }: { data: SettlementDocumentRow[] }) => {
  return (
    <table className="w-full border-collapse text-xs border border-black">
      <thead>
        <tr>
          <th rowSpan={2} className="border border-black text-center">STT</th>
          <th rowSpan={2} className="border border-black text-center">Mã hiệu</th>
          <th rowSpan={2} className="border border-black text-center">
            Tên công việc
          </th>
          <th rowSpan={2} className="border border-black text-center">ĐVT</th>
          <th rowSpan={2} className="border border-black text-center">KL</th>
          <th colSpan={2} className="border border-black text-center">Đơn giá</th>
          <th colSpan={2} className="border border-black text-center">Thành tiền</th>
        </tr>
        <tr>
          <th className="border border-black text-center">VL</th>
          <th className="border border-black text-center">NC</th>
          <th className="border border-black text-center">VL</th>
          <th className="border border-black text-center">NC</th>
        </tr>
      </thead>

      <tbody>
        {data.map((row) => (
          <tr key={row.id}>
            <td className="border border-black text-center">{row.stt}</td>
            <td className="border border-black text-center">{row.code}</td>
            <td className="border border-black px-1">{row.name}</td>
            <td className="border border-black text-center">{row.unit}</td>
            <td className="border border-black text-center">{row.quantity}</td>
            <td className="border border-black text-right">{row.priceVL}</td>
            <td className="border border-black text-right">{row.priceNC}</td>
            <td className="border border-black text-right">{row.totalVL}</td>
            <td className="border border-black text-right">{row.totalNC}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
