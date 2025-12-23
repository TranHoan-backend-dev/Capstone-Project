"use client";

import React from "react";

interface ReportHeaderProps {
  title: string;
  dateRange: string;
}

export function ReportHeader({ title, dateRange }: ReportHeaderProps) {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-sm font-semibold">
        CÔNG TY CỔ PHẦN CẤP NƯỚC NAM ĐỊNH
      </h2>
      <h3 className="text-base font-bold uppercase">{title}</h3>
      <p className="text-xs text-gray-600">{dateRange}</p>
    </div>
  );
}
