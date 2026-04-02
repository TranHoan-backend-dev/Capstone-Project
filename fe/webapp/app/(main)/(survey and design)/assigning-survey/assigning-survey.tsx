"use client";

import React, { useEffect, useState } from "react";
import { DateValue } from "@heroui/react";

import { SurveyAssignmentTable } from "./components/results-table";
import SurveyTabs from "./components/survey-tabs";

import { FilterSection } from "@/components/ui/FilterSection";
import { SurveyAssignmentFormResponse, SurveyAssignmentItem } from "@/types";
import { formatDate1, formatDateValueToString } from "@/utils/format";
import { authFetch } from "@/utils/authFetch";

const AssigningSurveyPage = () => {
  const [reloadKey, setReloadKey] = useState(0);
  const [activeTab, setActiveTab] = useState<"pending" | "assigned">("pending");
  const [keyword, setKeyword] = useState("");
  const [from, setFrom] = useState<DateValue | null | undefined>(null);
  const [to, setTo] = useState<DateValue | null | undefined>(null);
  const [data, setData] = useState<SurveyAssignmentItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "",
    direction: "desc",
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

        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) {
          params.append("keyword", trimmedKeyword);
        }
        if (from) {
          params.append("from", formatDateValueToString(from)); // formatDate1 là hàm bạn đang dùng
        }
        if (to) {
          params.append("to", formatDateValueToString(to));
        }
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
          (item: SurveyAssignmentFormResponse, index: number) => ({
            id: item.formCode,
            stt: (page - 1) * pageSize + index + 1,
            formNumber: item.formNumber,
            customerName: item.customerName,
            phone: item.phoneNumber,
            address: item.address,

            handoverBy: item.handoverBy,
            handoverByFullName: item.handoverByFullName,

            constructedBy: item.constructedBy,
            constructedByFullName: item.constructedByFullName,

            registrationAt: formatDate1(item.registrationAt),
            scheduleSurveyAt: formatDate1(item.scheduleSurveyAt),

            creator: item.creator,
            creatorFullName: item.creatorFullName,
            overallWaterMeterId: item.overallWaterMeterId,
          }),
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
  }, [page, keyword, reloadKey, sort, pageSize, from, to]);

  const filteredData = data.filter((item) => {
    const hasValue =
      item.handoverBy && item.handoverBy.toString().trim() !== "";

    return activeTab === "pending" ? !hasValue : hasValue;
  });

  return (
    <>
      <FilterSection
        from={from}
        keyword={keyword}
        setFromAction={setFrom}
        setKeywordAction={setKeyword}
        setToAction={setTo}
        title="Phân công khảo sát thiết kế"
        to={to}
        actions={<></>}
      />

      <div>
        <SurveyTabs
          activeTab={activeTab}
          onChange={setActiveTab}
          pendingCount={data.filter((i) => !i.handoverBy).length}
          assignedCount={data.filter((i) => i.handoverBy).length}
        />
        <SurveyAssignmentTable
          data={filteredData}
          page={page}
          totalItem={totalItems}
          totalPage={totalPages}
          onPageChange={setPage}
          keyword={keyword}
          reloadKey={reloadKey}
          setReloadKey={setReloadKey}
        />
      </div>
    </>
  );
};

export default AssigningSurveyPage;
