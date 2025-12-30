"use client";

import React from "react";

interface ReportHeaderProps {
  title: string;
  dateRange: string;
}

export const ReportHeader = ({ title, dateRange }: ReportHeaderProps) => {
  return (
    <div className="space-y-6 text-center">
      <h2 className="text-sm font-bold text-gray-700 dark:text-zinc-400">
        CÔNG TY CỔ PHẦN CẤP NƯỚC NAM ĐỊNH
      </h2>
      <h3 className="text-lg md:text-xl font-bold uppercase text-gray-900 dark:text-white transition-colors">{title}</h3>
      <p className="text-xs md:text-sm text-gray-600 dark:text-zinc-500 italic">{dateRange}</p>
    </div>
  );
};
