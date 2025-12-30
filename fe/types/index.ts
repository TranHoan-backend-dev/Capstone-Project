import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export interface EstimateItem {
  id: number;
  code: string;
  customerName: string;
  phone: string;
  address: string;
  registerDate: string;
  status: "pending_estimate" | "rejected";
}
