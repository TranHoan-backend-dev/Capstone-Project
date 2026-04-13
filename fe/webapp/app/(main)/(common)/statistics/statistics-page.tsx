"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Spinner } from "@heroui/react";

import { useHasAnyRole } from "@/hooks/useHasRole";
import { useProfile } from "@/hooks/useLogin";
import { authFetch } from "@/utils/authFetch";

type StatKey =
  | "installation"
  | "estimate"
  | "settlement"
  | "customer"
  | "contract";

const LABELS: Record<StatKey, string> = {
  installation: "Đơn lắp đặt",
  estimate: "Dự toán",
  settlement: "Quyết toán",
  customer: "Khách hàng",
  contract: "Hợp đồng",
};

const COLORS: Record<StatKey, string> = {
  installation: "hsl(214 88% 48%)",
  estimate: "hsl(160 62% 38%)",
  settlement: "hsl(280 68% 48%)",
  customer: "hsl(35 92% 48%)",
  contract: "hsl(340 72% 50%)",
};

const ORDER: StatKey[] = [
  "installation",
  "estimate",
  "settlement",
  "customer",
  "contract",
];

function parseInstallationTotal(json: {
  data?: { page?: { totalElements?: number } };
}) {
  return json?.data?.page?.totalElements ?? 0;
}

function parsePagedTotal(json: {
  data?: { totalElements?: number; page?: { totalElements?: number } };
}) {
  const d = json?.data;
  return d?.totalElements ?? d?.page?.totalElements ?? 0;
}

async function fetchAllCounts(): Promise<Record<StatKey, number>> {
  const base = new URLSearchParams({ page: "0", size: "1" });

  const [instRes, estRes, setRes, custRes, contRes] = await Promise.all([
    authFetch(`/api/construction/installation-forms?${base}`),
    authFetch(
      `/api/construction/estimates?${base}&sort=${encodeURIComponent("createdAt,desc")}`,
    ),
    authFetch(
      `/api/construction/settlements?${base}&sort=${encodeURIComponent("createdAt,desc")}`,
    ),
    authFetch(
      `/api/customer/customer?${base}&sort=${encodeURIComponent("name,desc")}`,
    ),
    authFetch(`/api/customer/contracts?${base}`),
  ]);

  const results: Record<StatKey, number> = {
    installation: 0,
    estimate: 0,
    settlement: 0,
    customer: 0,
    contract: 0,
  };

  if (instRes.ok) {
    results.installation = parseInstallationTotal(await instRes.json());
  } else {
    throw new Error("Không tải được số đơn lắp đặt.");
  }

  if (estRes.ok) {
    results.estimate = parsePagedTotal(await estRes.json());
  } else {
    throw new Error("Không tải được số dự toán.");
  }

  if (setRes.ok) {
    results.settlement = parsePagedTotal(await setRes.json());
  } else {
    throw new Error("Không tải được số quyết toán.");
  }

  if (custRes.ok) {
    results.customer = parseInstallationTotal(await custRes.json());
  } else {
    throw new Error("Không tải được số khách hàng.");
  }

  if (contRes.ok) {
    results.contract = parsePagedTotal(await contRes.json());
  } else {
    throw new Error("Không tải được số hợp đồng.");
  }

  return results;
}

function BarChartBlock({
  data,
  max,
}: {
  data: { key: StatKey; value: number }[];
  max: number;
}) {
  const scale = max > 0 ? max : 1;
  const maxBarPx = 320; // Tăng chiều cao tối đa

  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-h-[360px] items-end justify-between gap-4 sm:gap-6 px-0">
        {data.map(({ key, value }) => {
          const h = Math.round((value / scale) * maxBarPx);
          return (
            <div key={key} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-base font-semibold text-foreground tabular-nums">
                {value.toLocaleString("vi-VN")}
              </span>
              <div
                className="flex w-full flex-1 flex-col justify-end"
                style={{ minHeight: maxBarPx }}
              >
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80"
                  style={{
                    height: value > 0 ? Math.max(h, 6) : 0,
                    backgroundColor: COLORS[key],
                  }}
                  title={`${LABELS[key]}: ${value.toLocaleString("vi-VN")}`}
                />
              </div>
              <span className="text-center text-sm font-medium leading-tight text-default-600">
                {LABELS[key]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DonutChartBlock({
  data,
}: {
  data: { key: StatKey; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  const gradient = useMemo(() => {
    if (total <= 0) return "conic-gradient(hsl(210 16% 90%) 0% 100%)";
    let acc = 0;
    const parts: string[] = [];
    for (const { key, value } of data) {
      if (value <= 0) continue;
      const pct = (value / total) * 100;
      const start = acc;
      acc += pct;
      parts.push(`${COLORS[key]} ${start}% ${acc}%`);
    }
    return `conic-gradient(${parts.join(", ")})`;
  }, [data, total]);

  return (
    <div className="flex flex-col items-center gap-8 md:flex-row md:items-center md:justify-center md:gap-16">
      <div className="relative h-72 w-72 shrink-0">
        <div
          className="absolute inset-0 rounded-full shadow-lg transition-transform hover:scale-105"
          style={{ background: gradient }}
        />
        <div className="absolute inset-[22%] z-10 flex flex-col items-center justify-center rounded-full bg-content1 px-2 text-center shadow-inner">
          <span className="text-sm font-medium text-default-600">Tổng số</span>
          <span className="text-3xl font-bold text-foreground tabular-nums">
            {total.toLocaleString("vi-VN")}
          </span>
        </div>
      </div>
      <ul className="flex w-full max-w-lg flex-col gap-3 text-sm">
        {data.map(({ key, value }) => {
          const pct = total > 0 ? Math.round((value / total) * 1000) / 10 : 0;
          return (
            <li
              key={key}
              className="flex items-center justify-between gap-3 rounded-lg border border-default-200 px-4 py-2.5 hover:bg-default-50 transition-colors"
            >
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: COLORS[key] }}
                />
                <span className="truncate text-default-700 font-medium">
                  {LABELS[key]}
                </span>
              </span>
              <span className="shrink-0 tabular-nums text-default-700 font-semibold">
                {value.toLocaleString("vi-VN")}
                {total > 0 && (
                  <span className="ml-1 text-default-500 font-normal">
                    ({pct}%)
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function StatisticsPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { hasRole: canView, loading: roleLoading } = useHasAnyRole([
    "IT_STAFF",
    "COMPANY_LEADERSHIP",
  ]);

  const [counts, setCounts] = useState<Record<StatKey, number> | null>(null);
  const [loadStats, setLoadStats] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoadStats(true);
    setError(null);
    try {
      setCounts(await fetchAllCounts());
    } catch (e) {
      setCounts(null);
      setError(e instanceof Error ? e.message : "Không tải được thống kê.");
    } finally {
      setLoadStats(false);
    }
  }, []);

  useEffect(() => {
    if (!profileLoading && !roleLoading && profile && canView) {
      void load();
    }
  }, [profile, canView, profileLoading, roleLoading, load]);

  const chartRows = useMemo(() => {
    if (!counts) return [];
    return ORDER.map((key) => ({ key, value: counts[key] }));
  }, [counts]);

  const maxValue = useMemo(() => {
    if (!counts) return 1;
    return Math.max(...ORDER.map((k) => counts[k]), 1);
  }, [counts]);

  const loading = profileLoading || roleLoading;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-sm text-default-500">
          <Spinner size="sm" />
          <span>Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-default-500">
          Không thể xác định tài khoản. Vui lòng đăng nhập lại.
        </p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-danger">
          Không có quyền truy cập
        </h1>
        <p className="mt-2 max-w-md text-default-500">
          Trang thống kê chỉ dành cho nhân viên IT và lãnh đạo công ty.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full px-0 py-6 space-y-4">
      <div className="px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground">
          Thống kê tổng quan
        </h1>
        <p className="mt-2 text-base text-default-500">
          Số lượng hồ sơ theo từng loại (đồng bộ với dữ liệu hệ thống)
        </p>
      </div>

      {loadStats && (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Spinner size="sm" />
            <span>Đang tải số liệu...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="px-4 md:px-6 lg:px-8">
          <Card className="border-danger-200 bg-danger-50/40">
            <CardBody className="text-danger">{error}</CardBody>
          </Card>
        </div>
      )}

      {counts && !loadStats && (
        <>
          {/* Stat Cards Grid - Chiếm toàn bộ chiều rộng */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 px-4 md:px-6 lg:px-8">
            {ORDER.map((key) => (
              <Card
                key={key}
                className="border border-default-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader className="flex flex-col items-start gap-1 pb-0">
                  <span className="text-sm font-medium text-default-500">
                    {LABELS[key]}
                  </span>
                </CardHeader>
                <CardBody className="pt-2 pb-4">
                  <p
                    className="text-4xl font-bold tabular-nums tracking-tight"
                    style={{ color: COLORS[key] }}
                  >
                    {counts[key].toLocaleString("vi-VN")}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          {/* Charts Section - Chiếm toàn bộ chiều rộng, bỏ khoảng trống */}
          <div className="grid gap-8">
            <Card className="border border-default-200 shadow-sm rounded-none">
              <CardHeader className="pb-2 px-4 md:px-6 lg:px-8">
                <div className="w-full">
                  <h2 className="text-xl font-semibold">Biểu đồ cột</h2>
                  <p className="text-sm font-normal text-default-500">
                    So sánh nhanh số lượng theo loại
                  </p>
                </div>
              </CardHeader>
              <CardBody className="pt-4 px-4 md:px-6 lg:px-8">
                <BarChartBlock data={chartRows} max={maxValue} />
              </CardBody>
            </Card>

            <Card className="border border-default-200 shadow-sm rounded-none">
              <CardHeader className="pb-2 px-4 md:px-6 lg:px-8">
                <div className="w-full">
                  <h2 className="text-xl font-semibold">
                    Biểu đồ tròn (tỷ lệ)
                  </h2>
                  <p className="text-sm font-normal text-default-500">
                    Phần trăm đóng góp của từng loại trên tổng số
                  </p>
                </div>
              </CardHeader>
              <CardBody className="pt-4 px-4 md:px-6 lg:px-8">
                <DonutChartBlock data={chartRows} />
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
