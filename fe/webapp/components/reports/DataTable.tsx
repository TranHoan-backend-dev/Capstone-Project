"use client";

import React, { useMemo } from "react";

interface Column {
  key: string;
  label: string;
  width?: string;
}

interface DataTableProps {
  columns: Column[];
  data?: any[];
  searchQuery?: string;
}

export const DataTable = ({
  columns,
  data = [],
  searchQuery = "",
}: DataTableProps) => {
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key]?.toString().toLowerCase();
        return value?.includes(query);
      }),
    );
  }, [data, searchQuery, columns]);

  const allColumns = useMemo(() => {
    return [{ key: "stt", label: "STT", width: "60px" }, ...columns];
  }, [columns]);

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-xl overflow-hidden">
      <table className="w-full min-w-[640px] md:min-w-0">
        <thead className="bg-gray-50">
          <tr className="border-b border-gray-200">
            {allColumns.map((column) => (
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
          {filteredData.length === 0 ? (
            <tr>
              <td
                className="px-3 md:px-4 py-8 md:py-12 text-center text-xs md:text-sm text-gray-500 font-medium"
                colSpan={allColumns.length}
              >
                {data.length === 0
                  ? "Không có dữ liệu"
                  : "Không tìm thấy kết quả"}
              </td>
            </tr>
          ) : (
            filteredData.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                <td className="border-r border-gray-200 px-3 md:px-4 py-3 md:py-4 text-xs md:text-sm text-gray-900 text-center">
                  {idx + 1}
                </td>
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
      {filteredData.length > 0 && (
        <div className="bg-gray-50 px-3 md:px-4 py-3 text-xs md:text-sm text-gray-600">
          Hiển thị {filteredData.length} của {data.length} bản ghi
        </div>
      )}
    </div>
  );
};
