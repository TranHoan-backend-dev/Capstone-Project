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
    <div className="overflow-x-auto border border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden">
      <table className="w-full min-w-[640px] md:min-w-0">
        <thead className="bg-gray-50 dark:bg-zinc-800/50">
          <tr className="border-b border-gray-200 dark:border-zinc-700">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-r border-gray-200 dark:border-zinc-700 px-3 md:px-4 py-3 md:py-4 text-center text-xs md:text-sm font-bold tracking-wider text-gray-700 dark:text-zinc-300 last:border-r-0"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 md:px-4 py-8 md:py-12 text-center text-xs md:text-sm text-gray-500 dark:text-zinc-500 font-medium"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border-r border-gray-200 dark:border-zinc-700 px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900 dark:text-zinc-300 last:border-r-0"
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
