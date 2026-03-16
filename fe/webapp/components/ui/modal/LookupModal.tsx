"use client";

import React, { useEffect, useState } from "react";
import { Modal, ModalContent } from "@heroui/react";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { authFetch } from "@/utils/authFetch";

interface LookupModalProps<T> {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (item: T) => void;

  title: string;
  api: string;
  columns: { key: string; label: string }[];

  mapData: (item: any, index: number, page: number) => T;
  searchKey?: string;
}

export function LookupModal<T extends { id: string }>({
  isOpen,
  onClose,
  onSelect,
  title,
  api,
  columns,
  mapData,
  searchKey = "name",
}: LookupModalProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const pageSize = 10;

  const fetchData = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
      });
      if (search) {
        params.append(searchKey ?? "name", search);
      }
      const res = await authFetch(`${api}?${params.toString()}`);
      const json = await res.json();

      const items = json?.data?.content ?? [];
      const pageInfo = json?.data?.page;

      const mapped = items.map((item: any, index: number) =>
        mapData(item, index, page),
      );

      setData(mapped);
      setTotalPages(pageInfo?.totalPages ?? 1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchData();
  }, [page, search, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalContent>
        <GenericDataTable
          title={title}
          columns={columns}
          data={data}
          isLoading={loading}
          search={{
            value: search,
            onChange: (v) => {
              setSearch(v);
              setPage(1);
            },
          }}
          paginationProps={{
            total: totalPages,
            page,
            onChange: setPage,
            summary: `${data.length}`,
          }}
          renderCellAction={(item, columnKey) => (
            <span
              className="cursor-pointer text-blue-600"
              onClick={() => {
                onSelect(item);
                onClose();
              }}
            >
              {item[columnKey as keyof T] as React.ReactNode}
            </span>
          )}
        />
      </ModalContent>
    </Modal>
  );
}
