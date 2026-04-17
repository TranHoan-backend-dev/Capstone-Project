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
  const [pendingCount, setPendingCount] = useState(0);
  const [assignedCount, setAssignedCount] = useState(0);

  const hasHandoverByValue = (handoverBy: any): boolean => {
    return handoverBy && handoverBy.toString().trim() !== "";
  };

  useEffect(() => {
    setLoading(true);

    const fetchAllData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
        });

        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) params.append("keyword", trimmedKeyword);
        if (from) params.append("from", formatDateValueToString(from));
        if (to) params.append("to", formatDateValueToString(to));

        const pendingUrl = `/api/construction/installation-forms/registration/pending?${params.toString()}`;
        const assignedUrl = `/api/construction/installation-forms?${params.toString()}`;

        const [pendingRes, assignedRes] = await Promise.all([
          authFetch(pendingUrl),
          authFetch(assignedUrl),
        ]);

        if (pendingRes.ok) {
          const pendingJson = await pendingRes.json();
          const pendingPageData = pendingJson?.data;

          setPendingCount(pendingPageData?.page?.totalElements ?? 0);

          if (activeTab === "pending") {
            const items = pendingPageData?.content ?? [];
            setTotalItems(pendingPageData?.page?.totalElements ?? 0);
            setTotalPages(pendingPageData?.page?.totalPages ?? 1);

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
          }
        }

        if (assignedRes.ok) {
          const assignedJson = await assignedRes.json();
          const assignedPageData = assignedJson?.data;

          const items = assignedPageData?.content ?? [];
          setTotalItems(assignedPageData?.page?.totalElements ?? 0);
          setTotalPages(assignedPageData?.page?.totalPages ?? 1);

          const filteredItems = items.filter(
            (item: SurveyAssignmentFormResponse) =>
              hasHandoverByValue(item.handoverBy),
          );

          setAssignedCount(filteredItems.length);

          if (activeTab === "assigned") {
            const mapped = filteredItems.map(
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
          }
        }
      } catch (e) {
        console.error("Fetch error:", e);
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [page, keyword, reloadKey, sort, pageSize, from, to, activeTab]);

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
          onChange={(tab) => {
            setActiveTab(tab);
            setPage(1);
          }}
          pendingCount={pendingCount}
          assignedCount={assignedCount}
        />
        <SurveyAssignmentTable
          data={data}
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
