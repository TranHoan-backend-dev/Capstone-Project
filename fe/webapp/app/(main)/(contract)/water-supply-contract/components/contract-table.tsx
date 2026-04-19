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
import { CONTRACT_COLUMN } from "@/config/table-columns/customer/contract-column";
import { ConfirmDialog } from "@/components/ui/modal/ConfirmDialog";

interface ContractTableProps {
  filters?: any;
  refreshTrigger?: number;
  onDeleteSuccess?: () => void;
}

interface TableContractData {
  id: string;
  stt: number;
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
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
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
          (item: ContractResponse, index: number) => ({
            stt: (page - 1) * pageSize + index + 1,
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

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    setDeleteLoading(true);
    try {
      const res = await authFetch(`/api/customer/contracts/${deleteId}`, {
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

      // Reset page về 1 nếu là trang cuối và chỉ còn 1 item
      if (data.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        await fetchContracts();
      }

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
      setDeleteLoading(false);
      setDeleteId(null);
    }
  };

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  // const handleViewDetail = (id: string) => {
  //   router.push(`/contracts/${id}`);
  // };

  const handlePrint = (rawData: ContractResponse) => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Hợp đồng ${rawData.contractId}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 20px;
                margin: 0;
              }
              .container {
                max-width: 800px;
                margin: 0 auto;
              }
              .header { 
                text-align: center; 
                margin-bottom: 30px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .title {
                font-size: 24px;
                font-weight: bold;
                color: #333;
              }
              .subtitle {
                font-size: 18px;
                color: #666;
                margin-top: 10px;
              }
              .info { 
                margin-bottom: 15px;
                padding: 10px;
                border-bottom: 1px solid #eee;
              }
              .label { 
                font-weight: bold;
                display: inline-block;
                width: 150px;
              }
              .value {
                display: inline-block;
                color: #333;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #999;
              }
              @media print {
                .no-print {
                  display: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="title">HỢP ĐỒNG CẤP NƯỚC</div>
                <div class="subtitle">Mã hợp đồng: ${rawData.contractId}</div>
              </div>
              <div class="info">
                <span class="label">Tên khách hàng:</span>
                <span class="value">${rawData.customerName}</span>
              </div>
              <div class="info">
                <span class="label">Mã khách hàng:</span>
                <span class="value">${rawData.customerId}</span>
              </div>
              <div class="info">
                <span class="label">Mã form:</span>
                <span class="value">${rawData.installationFormId}</span>
              </div>
              <div class="info">
                <span class="label">Người đại diện:</span>
                <span class="value">${formatRepresentatives(rawData.representatives)}</span>
              </div>
              <div class="info">
                <span class="label">Ngày tạo:</span>
                <span class="value">${formatDate1(rawData.createdAt)}</span>
              </div>
              <div class="footer">
                <p>Hợp đồng được tạo từ hệ thống quản lý cấp nước</p>
                <p>Ngày in: ${new Date().toLocaleString("vi-VN")}</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const renderCell = (item: TableContractData, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span className="text-center">{item.stt}</span>;
      case "contractId":
        return (
          <span
            className="font-medium text-black-600"
            // onClick={() => handleViewDetail(item.contractId)}
          >
            {item.contractId}
          </span>
        );
      case "customerName":
        return (
          <span className="font-medium text-gray-900">{item.customerName}</span>
        );
      case "customerId":
        return <span>{item.customerId}</span>;
      case "installationFormId":
        return <span>{item.installationFormId}</span>;
      case "representatives":
        return <span>{item.representatives}</span>;
      case "createdAt":
        return <span>{formatDate1(item.createdAt)}</span>;
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {/* <Tooltip content="Xem chi tiết" closeDelay={0}>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-indigo-600 hover:bg-indigo-50 rounded-lg"
                onClick={() => handleViewDetail(item.contractId)}
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
            </Tooltip> */}
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
              >
                <TrashIcon className="w-5 h-5" />
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
    <>
      <GenericDataTable
        title="DANH SÁCH HỢP ĐỒNG"
        columns={CONTRACT_COLUMN}
        data={data}
        renderCellAction={renderCell}
        isCollapsible={false}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        headerSummary={`${totalItems}`}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Xác nhận xóa hợp đồng"
        message="Bạn có chắc chắn muốn xóa hợp đồng này không?"
        confirmText="Xóa"
        cancelText="Hủy"
        confirmColor="danger"
        isLoading={deleteLoading}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};
