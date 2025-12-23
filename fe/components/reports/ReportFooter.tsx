"use client";

import React from "react";

export function ReportFooter() {
  const today = new Date();
  const formattedDate = `, Ngày ${today.getDate().toString().padStart(2, "0")} tháng ${(today.getMonth() + 1).toString().padStart(2, "0")} năm ${today.getFullYear()}`;

  return (
    <div className="mt-10">
      <div className="flex justify-end">
        <div className="mr-20 w-64">
          <div className="text-end">
            <p className="text-sm text-gray-600 italic">{formattedDate}</p>
          </div>
          <div className="text-center">
            <p className="mt-5 mb-40 text-sm font-semibold">NGƯỜI LẬP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
