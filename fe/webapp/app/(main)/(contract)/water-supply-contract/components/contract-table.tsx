// app/contracts/components/contract-table.tsx
"use client";

import { useEffect, useState } from "react";
import { PrinterIcon, TrashIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Button, Tooltip, Spinner } from "@heroui/react";
import { useRouter } from "next/navigation";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { ContractResponse, Representative } from "@/types";
import { formatDate1 } from "@/utils/format";

interface ContractTableProps {
  filters?: any;
  refreshTrigger?: number;
  onDeleteSuccess?: () => void;
}

interface TableContractData {
  id: string;
  contractId: string;
  customerName: string;
  customerId: string;
  installationFormId: string;
  representatives: string;
  createdAt: string;
  rawData: ContractResponse;
}

export const ContractTable = ({
  filters = {},
  refreshTrigger = 0,
  onDeleteSuccess,
}: ContractTableProps) => {
  const router = useRouter();
  const [data, setData] = useState<TableContractData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const formatRepresentatives = (representatives: Representative[]): string => {
    if (!representatives || representatives.length === 0) return "-";
    return representatives
      .map((rep) => `${rep.name} (${rep.position})`)
      .join(", ");
  };

  const fetchContracts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
      });

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.append(key, String(value));
        }
      });

      const res = await authFetch(
        `/api/customer/contracts?${params.toString()}`,
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Không thể tải danh sách hợp đồng");
      }

      const json = await res.json();
      const pageData = json?.data;

      if (pageData?.content) {
        const transformedData: TableContractData[] = pageData.content.map(
          (item: ContractResponse) => ({
            id: item.contractId,
            contractId: item.contractId,
            customerName: item.customerName,
            customerId: item.customerId,
            installationFormId: item.installationFormId,
            representatives: formatRepresentatives(item.representatives),
            createdAt: item.createdAt,
            rawData: item,
          }),
        );

        setData(transformedData);
        setTotalItems(pageData.totalElements || 0);
        setTotalPages(pageData.totalPages || 1);
      } else {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error("Error fetching contracts:", error);
      CallToast({
        title: "Lỗi",
        message: error.message || "Không thể tải danh sách hợp đồng",
        color: "danger",
      });
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [page, refreshTrigger, JSON.stringify(filters)]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hợp đồng này?")) {
      return;
    }

    setDeleteLoading(id);
    try {
      const res = await authFetch(`/api/customer/contracts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Xóa hợp đồng thất bại");
      }

      CallToast({
        title: "Thành công",
        message: "Xóa hợp đồng thành công",
        color: "success",
      });

      await fetchContracts();

      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
    } catch (error: any) {
      console.error("Error deleting contract:", error);
      CallToast({
        title: "Lỗi",
        message: error.message || "Xóa hợp đồng thất bại",
        color: "danger",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleViewDetail = (id: string) => {
    router.push(`/contracts/${id}`);
  };

  const handlePrint = (rawData: ContractResponse) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hợp đồng ${rawData.contractId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .info { margin-bottom: 10px; }
              .label { font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>HỢP ĐỒNG CẤP NƯỚC</h1>
              <h2>Mã hợp đồng: ${rawData.contractId}</h2>
            </div>
            <div class="info">
              <p><span class="label">Tên khách hàng:</span> ${rawData.customerName}</p>
              <p><span class="label">Mã khách hàng:</span> ${rawData.customerId}</p>
              <p><span class="label">Mã form:</span> ${rawData.installationFormId}</p>
              <p><span class="label">Người đại diện:</span> ${formatRepresentatives(rawData.representatives)}</p>
              <p><span class="label">Ngày tạo:</span> ${formatDate1(rawData.createdAt)}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const columns = [
    { key: "contractId", label: "Mã hợp đồng" },
    { key: "customerName", label: "Tên khách hàng" },
    { key: "customerId", label: "Mã khách hàng" },
    { key: "installationFormId", label: "Mã form" },
    { key: "representatives", label: "Người đại diện" },
    { key: "createdAt", label: "Ngày tạo" },
    { key: "actions", label: "Hoạt động", align: "center" as const },
  ];

  const renderCell = (item: TableContractData, columnKey: string) => {
    switch (columnKey) {
      case "contractId":
        return (
          <span
            className="font-medium text-blue-600 cursor-pointer hover:underline"
            onClick={() => handleViewDetail(item.contractId)}
          >
            {item.contractId}
          </span>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900">{item.customerName}</span>
        );
      case "installationFormId":
        return <span>{item.installationFormId}</span>;
      case "representatives":
        return <span>{item.representatives}</span>;
      case "createdAt":
        return <span>{formatDate1(item.createdAt)}</span>;
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Xem chi tiết" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                onClick={() => handleViewDetail(item.contractId)}
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
            <Tooltip content="In hợp đồng" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-blue-600 hover:bg-blue-50 rounded-lg"
                onClick={() => handlePrint(item.rawData)}
              >
                <PrinterIcon className="w-5 h-5" />
              </Button>
            </Tooltip>
            <Tooltip content="Xóa" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-red-500 hover:bg-red-50 rounded-lg"
                onClick={() => handleDelete(item.contractId)}
                isLoading={deleteLoading === item.contractId}
              >
                {deleteLoading !== item.contractId && (
                  <TrashIcon className="w-5 h-5" />
                )}
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return (item as any)[columnKey] || "-";
    }
  };

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <GenericDataTable
      title="DANH SÁCH HỢP ĐỒNG"
      columns={columns}
      data={data}
      renderCellAction={renderCell}
      isCollapsible={false}
      paginationProps={{
        total: totalPages,
        page: page,
        onChange: setPage,
        summary: `${totalItems}`,
      }}
      headerSummary={`${totalItems}`}
    />
  );
};
