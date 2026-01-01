interface PriceBoxProps {
  value: number | string;
  text?: string;
}

import { formatVND } from "@/utils/format";

export const PriceBox = ({ value, text }: PriceBoxProps) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="text-2xl font-bold text-gray-900">
      {formatVND(value)}
    </div>
    {text && <div className="text-xs text-gray-500 mt-1">{text}</div>}
  </div>
);
