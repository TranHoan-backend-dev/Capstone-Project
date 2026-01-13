"use client";

import React from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data?: any[];
}

export const DataTable = ({ columns, data = [] }: DataTableProps) => {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full min-w-[640px] md:min-w-0">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-r border-gray-200 px-3 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-bold tracking-wider text-gray-700 last:border-r-0"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y bg-white dark:bg-zinc-200">
          {data.length === 0 ? (
            <tr>
              <td
                className="px-3 md:px-4 py-8 md:py-12 text-center text-xs md:text-sm text-gray-500 font-medium"
                colSpan={columns.length}
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border-r border-gray-200 px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900 last:border-r-0"
                  >
                    {row[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
