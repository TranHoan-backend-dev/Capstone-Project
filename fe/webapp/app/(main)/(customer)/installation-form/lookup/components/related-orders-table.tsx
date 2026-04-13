"use client";

import React, { useEffect, useState } from "react";
import NextLink from "next/link";
import { Link, Tooltip } from "@heroui/react";
import CustomButton from "@/components/ui/custom/CustomButton";
import { StatusBar } from "./status-bar";
import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { PencilIcon, TitleDarkColor } from "@/config/chip-and-icon";
import {
  NewInstallationLookupItem,
  NewInstallationLookupResponse,
} from "@/types";
import { NEW_INSTALLATION_LOOKUP_COLUMN } from "@/config/table-columns";
import { authFetch } from "@/utils/authFetch";
import { formatDate1 } from "@/utils/format";
import { AssignConstructionPopup } from "./assign-construction-popup";
import { InstallationFormDetailPopup } from "./installation-form-detail-popup";

interface ResultsTableProps {
  keyword?: string;
  reloadKey?: number;
  from?: string | null;
  to?: string | null;
}

export const RelatedOrdersTable = ({
  keyword,
  reloadKey,
  from,
  to,
}: ResultsTableProps) => {
  const [data, setData] = useState<NewInstallationLookupItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const [assignPopup, setAssignPopup] = useState<{
    isOpen: boolean;
    formCode: string;
    formNumber: string;
    customerName: string;
  }>({
    isOpen: false,
    formCode: "",
    formNumber: "",
    customerName: "",
  });

  const [detailPopup, setDetailPopup] = useState<{
    isOpen: boolean;
    formCode: string;
    formNumber: string;
  }>({
    isOpen: false,
    formCode: "",
    formNumber: "",
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
          sort: `${sort.field},${sort.direction}`,
        });
        if (from) params.append("from", from);
        if (to) params.append("to", to);
        if (keyword) params.append("keyword", keyword);

        const res = await authFetch(
          `/api/construction/installation-forms?${params.toString()}`,
        );

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        setTotalItems(pageData?.page.totalElements ?? 0);
        setTotalPages(pageData?.page.totalPages ?? 1);

        const mapped = items.map(
          (item: NewInstallationLookupResponse, index: number) => {
            const { stage, status, canAssign } = getStageAndStatus(item.status);
            return {
              id: item.formCode,
              stt: (page - 1) * pageSize + index + 1,
              formCode: item.formCode,
              formNumber: item.formNumber,
              customerName: item.customerName,
              registrationAt: formatDate1(item.registrationAt),
              address: item.address,
              stage: stage.toLowerCase(),
              status: status?.toLowerCase() ?? "pending",
              canAssign: canAssign,
              rawStatus: item.status,
            };
          },
        );

        setData(mapped);
      } catch (e) {
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, keyword, reloadKey, sort, from, to]);

  const handleSortChange = (columnKey: string) => {
    setPage(1);

    setSort((prev) => {
      const direction =
        prev.field === columnKey && prev.direction === "asc" ? "desc" : "asc";

      return {
        field: columnKey === "stt" ? "createdAt" : columnKey,
        direction,
      };
    });
  };

  const handleOpenAssignPopup = (item: any) => {
    setAssignPopup({
      isOpen: true,
      formCode: item.id,
      formNumber: item.formNumber,
      customerName: item.customerName,
    });
  };

  const mapStatus = (status: string) => {
    switch (status) {
      case "PENDING_FOR_APPROVAL":
        return "pending";
      case "PROCESSING":
        return "processing";
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "pending";
    }
  };

  const getStageAndStatus = (statusObj: any) => {
    if (!statusObj) {
      return { stage: "registration", status: "pending", canAssign: false };
    }

    // Kiểm tra điều kiện để hiển thị icon giao thi công
    const isReadyForConstruction =
      statusObj.registration === "APPROVED" &&
      statusObj.estimate === "APPROVED" &&
      statusObj.contract === "APPROVED" &&
      statusObj.construction === "PROCESSING";

    if (statusObj.registration !== "APPROVED") {
      return {
        stage: "registration",
        status: mapStatus(statusObj.registration),
        canAssign: false,
      };
    }

    if (statusObj.estimate !== "APPROVED") {
      return {
        stage: "estimate",
        status: mapStatus(statusObj.estimate),
        canAssign: false,
      };
    }

    if (statusObj.contract !== "APPROVED") {
      return {
        stage: "contract",
        status: mapStatus(statusObj.contract),
        canAssign: false,
      };
    }

    if (statusObj.construction !== "APPROVED") {
      return {
        stage: "construction",
        status: mapStatus(statusObj.construction),
        canAssign: true,
      };
    }

    return {
      stage: "construction",
      status: "approved",
      // stage: "contract",
      // status: mapStatus(statusObj.construction),
      canAssign: isReadyForConstruction,
    };
  };

  useEffect(() => {
    setPage(1);
  }, [keyword, from, to]);
  const hasAssignableOrders = data.some((item) => item.canAssign === true);
  const getColumns = () => {
    const baseColumns = [...NEW_INSTALLATION_LOOKUP_COLUMN];

    if (!hasAssignableOrders) {
      return baseColumns.filter((col) => col.key !== "actions");
    }

    return baseColumns;
  };

  const handleOpenDetailPopup = (item: any) => {
    setDetailPopup({
      isOpen: true,
      formCode: item.formCode,
      formNumber: item.formNumber,
    });
  };
  const renderCell = (item: any, key: string) => {
    switch (key) {
      case "stt":
        return (
          <span className="font-medium text-black dark:text-white">
            {item.stt}
          </span>
        );
      case "formNumber":
        return (
          <button
            onClick={() => handleOpenDetailPopup(item)}
            className="font-bold text-blue-600 hover:underline hover:text-blue-800 cursor-pointer"
          >
            {item.formNumber}
          </button>
        );
      case "customerName":
        return (
          <span className="font-bold text-gray-900 dark:text-foreground">
            {item.customerName}
          </span>
        );
      case "status":
        return <StatusBar stage={item.stage} status={item.status} />;
      case "actions":
        return (
          <div className="flex items-center gap-2 justify-center">
            {item.canAssign && (
              <Tooltip closeDelay={0} color="primary" content="Giao thi công">
                <CustomButton
                  isIconOnly
                  className="bg-transparent text-primary-500 data-[hover=true]:bg-primary-50"
                  size="lg"
                  variant="light"
                  onPress={() => handleOpenAssignPopup(item)}
                >
                  <PencilIcon className="w-5 h-5" />
                </CustomButton>
              </Tooltip>
            )}
          </div>
        );
      default:
        return item[key];
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Danh sách đơn"
        columns={getColumns()}
        isCollapsible
        data={data}
        renderCellAction={renderCell}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        onSortChange={handleSortChange}
      />
      <AssignConstructionPopup
        isOpen={assignPopup.isOpen}
        onClose={() =>
          setAssignPopup({
            isOpen: false,
            formCode: "",
            formNumber: "",
            customerName: "",
          })
        }
        onSuccess={() => {
          setPage(1);
        }}
        formCode={assignPopup.formCode}
        formNumber={assignPopup.formNumber}
        customerName={assignPopup.customerName}
      />
      <InstallationFormDetailPopup
        isOpen={detailPopup.isOpen}
        onClose={() =>
          setDetailPopup({
            isOpen: false,
            formCode: "",
            formNumber: "",
          })
        }
        formCode={detailPopup.formCode}
        formNumber={detailPopup.formNumber}
      />
    </>
  );
};
