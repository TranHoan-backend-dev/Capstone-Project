import { SettlementDocumentRow } from "@/types";

export const DocumentTable = ({ data }: { data: SettlementDocumentRow[] }) => {
  return (
    <table className="w-full border-collapse text-xs border border-black">
      <thead>
        <tr>
          <th className="border border-black text-center" rowSpan={2}>
            STT
          </th>
          <th className="border border-black text-center" rowSpan={2}>
            Mã hiệu
          </th>
          <th className="border border-black text-center" rowSpan={2}>
            Tên công việc
          </th>
          <th className="border border-black text-center" rowSpan={2}>
            ĐVT
          </th>
          <th className="border border-black text-center" rowSpan={2}>
            KL
          </th>
          <th className="border border-black text-center" colSpan={2}>
            Đơn giá
          </th>
          <th className="border border-black text-center" colSpan={2}>
            Thành tiền
          </th>
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
