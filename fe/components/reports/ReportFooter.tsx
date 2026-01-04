"use client";

import React from "react";

export const ReportFooter = () => {
  const today = new Date();
  const formattedDate = `Ngày ${today.getDate().toString().padStart(2, "0")} tháng ${(today.getMonth() + 1).toString().padStart(2, "0")} năm ${today.getFullYear()}`;

  return (
    <div className="mt-12 border-t border-gray-100 pt-8 dark:border-white-50">
      <div className="flex justify-end">
        <div className="mr-10 md:mr-20 w-64">
          <div className="text-end">
            <p className="text-sm text-gray-500 italic dark:text-white">
              {formattedDate}
            </p>
          </div>
          <div className="text-center">
            <p className="mt-6 mb-32 text-sm font-bold text-gray-800 dark:text-white">
              NGƯỜI LẬP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
