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

export function DataTable({ columns, data = [] }: DataTableProps) {
  return (
    <div className="overflow-x-auto border">
      <table className="w-full min-w-[640px] md:min-w-0">
        <thead className="bg-gray-50">
          <tr className="border-b">
            {columns.map((column) => (
              <th
                key={column.key}
                className="border-r px-3 md:px-4 py-2 md:py-3 text-center text-xs md:text-sm font-medium tracking-wider text-gray-700 last:border-r-0"
                style={{ width: column.width }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-3 md:px-4 py-6 md:py-8 text-center text-xs md:text-sm text-gray-500"
              >
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="border-r px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm last:border-r-0"
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
}
