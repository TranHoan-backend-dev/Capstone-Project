"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { authFetch } from "@/utils/authFetch";

interface LookupModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;

  dataKey?: string;
  title: string;
  api: string;
  columns: { key: string; label: string }[];

  mapData: (item: any, index: number, page: number) => T;
  searchKey?: string;
  enableSearch?: boolean;
  /** Trả về true nếu row bị disable (không cho chọn) */
  isRowDisabled?: (item: T) => boolean;
  /** Tooltip hiển thị khi hover vào row bị disable */
  disabledRowTooltip?: string;
}

export function LookupModal<T extends { id: string }>({
  isOpen,
  onClose,
  onSelect,
  dataKey,
  title,
  api,
  columns,
  mapData,
  searchKey = "name",
  enableSearch = true,
  isRowDisabled,
  disabledRowTooltip = "Không thể chọn mục này",
}: LookupModalProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const pageSize = 10;

  useEffect(() => {
    if (!isOpen) {
      setPage(1);
      setSearch("");
      setData([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
        });

        if (enableSearch && search) {
          params.append(searchKey, search);
        }

        const res = await authFetch(`${api}?${params.toString()}`);
        const json = await res.json();

        const items: any[] = dataKey
          ? (json?.data?.[dataKey] ?? [])
          : (json?.data ?? []);

        const pageInfo = json?.data?.page ?? json?.data;

        const mapped = items.map((item: any, index: number) =>
          mapData(item, index, page),
        );

        setData(mapped);

        const computedTotalPages =
          pageInfo?.totalPages != null
            ? pageInfo.totalPages
            : Math.ceil((pageInfo?.totalElements ?? 0) / pageSize);
        setTotalPages(computedTotalPages || 1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, search, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <GenericDataTable
          isLoading={loading}
          title={title}
          columns={columns}
          data={data}
          showCloseButton={true}
          onClose={onClose}
          search={
            enableSearch
              ? {
                  value: search,
                  onChange: (v) => {
                    setSearch(v);
                    setPage(1);
                  },
                }
              : undefined
          }
          paginationProps={{
            total: totalPages,
            page,
            onChange: setPage,
            summary: `${data.length}`,
          }}
          renderCellAction={(item, columnKey) => {
            const disabled = isRowDisabled ? isRowDisabled(item) : false;
            const cell = (
              <span
                className={
                  disabled
                    ? "cursor-not-allowed text-gray-400 select-none"
                    : "cursor-pointer text-black-600"
                }
                onClick={() => {
                  if (disabled) return;
                  onSelect(item);
                  onClose();
                }}
              >
                {item[columnKey as keyof T] as React.ReactNode}
              </span>
            );

            if (disabled) {
              return (
                <span title={disabledRowTooltip} className="block">
                  {cell}
                </span>
              );
            }

            return cell;
          }}
        />
      </ModalContent>
    </Modal>
  );
}
