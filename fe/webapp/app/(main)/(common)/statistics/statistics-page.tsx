"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, CardBody, CardHeader, Spinner, Button } from "@heroui/react";
import Link from "next/link";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

import { useHasAnyRole } from "@/hooks/useHasRole";
import { useProfile } from "@/hooks/useLogin";
import { authFetch } from "@/utils/authFetch";

type StatKey =
  | "installation"
  | "estimate"
  | "settlement"
  | "contract"
  | "estimatePending"
  | "estimateApproved"
  | "estimateRejected"
  | "installationAssigned"
  | "processed"
  | "pendingReview"
  | "unassigned";

const LABELS: Record<StatKey, string> = {
  installation: "Đơn lắp đặt",
  estimate: "Dự toán",
  settlement: "Quyết toán",
  contract: "Hợp đồng",
  estimatePending: "Đang chờ phê duyệt",
  estimateApproved: "Đã phê duyệt",
  estimateRejected: "Bị từ chối",
  installationAssigned: "Đã giao khảo sát",
  processed: "Đã xử lý xong",
  pendingReview: "Chưa phê duyệt",
  unassigned: "Chưa giao khảo sát",
};

const COLORS: Record<StatKey, string> = {
  installation: "hsl(214 88% 48%)",
  estimate: "hsl(160 62% 38%)",
  settlement: "hsl(280 68% 48%)",
  contract: "hsl(340 72% 50%)",
  estimatePending: "hsl(45 92% 50%)",
  estimateApproved: "hsl(145 60% 45%)",
  estimateRejected: "hsl(0 75% 55%)",
  installationAssigned: "hsl(190 85% 45%)",
  processed: "hsl(210 20% 85%)",
  pendingReview: "hsl(210 20% 85%)",
  unassigned: "hsl(210 20% 85%)",
};

const ORDER: (keyof DetailedStats)[] = [
  "installation",
  "estimate",
  "settlement",
  "contract",
];

interface DetailedStats {
  installation: number;
  estimate: number;
  settlement: number;
  contract: number;
  estimatePending: number;
  estimateApproved: number;
  estimateRejected: number;
  installationAssigned: number;
}

const parsePagedTotal = (json: any, endpointName?: string) => {
  // Trường hợp Page object lồng trong field 'page' (Cấu trúc mới bạn vừa thêm)
  if (json?.data?.page?.totalElements !== undefined) {
    return json.data.page.totalElements;
  }

  // Ưu tiên lấy totalElements từ Page object của Spring Data (Cấu trúc chuẩn)
  if (json?.data?.totalElements !== undefined) {
    return json.data.totalElements;
  }

  // Trường hợp data trả về là mảng trực tiếp
  if (Array.isArray(json?.data)) {
    return json.data.length;
  }

  // Trường hợp đặc biệt của endpoint reviewed (Trả về object {approved, rejected})
  if (
    json?.data?.approved !== undefined &&
    json?.data?.rejected !== undefined
  ) {
    return {
      approved: Array.isArray(json.data.approved)
        ? json.data.approved.length
        : 0,
      rejected: Array.isArray(json.data.rejected)
        ? json.data.rejected.length
        : 0,
    };
  }

  // Log cảnh báo nếu không tìm thấy cấu trúc dữ liệu mong muốn
  if (json?.data && endpointName) {
    console.warn(
      `[Stats] Unknown data structure for ${endpointName}:`,
      json.data,
    );
  }

  return 0; // Luôn trả về 0 thay vì undefined để tránh lỗi toLocaleString
};

const fetchAllCounts = async (): Promise<DetailedStats> => {
  const base = "page=0&size=1";

  try {
    const [
      instRes,
      estRes,
      setRes,
      contRes,
      estPendRes,
      estRevRes,
      instAssignRes,
    ] = await Promise.all([
      authFetch("/api/construction/installation-forms?page=0&size=1"),
      authFetch(`/api/construction/estimates?${base}&sort=createdAt,desc`),
      authFetch(`/api/construction/settlements?${base}&sort=createdAt,desc`),
      authFetch("/api/customer/contracts?page=0&size=1"),
      authFetch(
        "/api/construction/installation-forms/estimate/pending?page=0&size=1",
      ),
      authFetch("/api/construction/installation-forms/reviewed"),
      authFetch("/api/construction/installation-forms/assigned?page=0&size=1"),
    ]);

    const reviewedJson = await estRevRes.json();
    const reviewed = parsePagedTotal(reviewedJson, "reviewed");

    const stats: DetailedStats = {
      installation: parsePagedTotal(await instRes.json(), "installation"),
      estimate: parsePagedTotal(await estRes.json(), "estimate"),
      settlement: parsePagedTotal(await setRes.json(), "settlement"),
      contract: parsePagedTotal(await contRes.json(), "contract"),
      estimatePending: parsePagedTotal(
        await estPendRes.json(),
        "estimatePending",
      ),
      estimateApproved: (reviewed as any)?.approved ?? 0,
      estimateRejected: (reviewed as any)?.rejected ?? 0,
      installationAssigned: parsePagedTotal(
        await instAssignRes.json(),
        "installationAssigned",
      ),
    };

    console.log("[Dashboard Stats] Final counts:", stats);
    return stats;
  } catch (error) {
    console.error("[Dashboard Stats] Critical error fetching counts:", error);
    throw error;
  }
};

function BarChartBlock({
  data,
  max: propMax,
}: {
  data: { key: StatKey; value: number }[];
  max?: number;
}) {
  const max = propMax ?? Math.max(...data.map((d) => d.value), 1);
  const scale = max > 0 ? max : 1;
  const maxBarPx = 300;

  return (
    <div className="flex flex-1 items-end justify-around gap-4 pt-4 border-b border-default-200 min-h-[350px]">
      {data.map((d) => {
        const height = (d.value / scale) * maxBarPx;
        return (
          <div
            key={d.key}
            className="group relative flex flex-col items-center gap-3"
          >
            <div className="flex flex-col items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-xs font-bold text-default-500 bg-default-100 px-2 py-1 rounded-md">
                {d.value.toLocaleString("vi-VN")}
              </span>
            </div>
            <div
              className="w-16 rounded-t-lg transition-all duration-500 ease-out hover:brightness-110 shadow-lg"
              style={{
                height: `${Math.max(height, 8)}px`,
                backgroundColor: COLORS[d.key],
                boxShadow: `0 -4px 12px -2px ${COLORS[d.key]}40`,
              }}
            />
            <span className="text-[11px] font-bold text-default-500 uppercase tracking-tight text-center max-w-[80px] leading-tight">
              {LABELS[d.key]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChartBlock({
  data,
}: {
  data: { key: StatKey; value: number }[];
}) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-12 w-full min-h-[350px]">
      <div className="relative h-56 w-56 lg:h-64 lg:w-64 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={window.innerWidth < 768 ? 65 : 75}
              outerRadius={105}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.key]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-bold text-foreground tabular-nums">
            {total.toLocaleString("vi-VN")}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-default-500 font-bold">
            TỔNG SỐ
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 min-w-[200px] w-full md:w-auto px-4">
        {data.map(({ key, value }) => {
          const pct = total > 0 ? (value / total) * 100 : 0;
          return (
            <div
              key={key}
              className="flex items-center justify-between gap-6 p-3 rounded-xl border border-default-100 hover:bg-default-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: COLORS[key] }}
                />
                <span className="text-sm font-semibold text-default-700">
                  {LABELS[key]}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold tabular-nums">
                  {value.toLocaleString("vi-VN")}
                </span>
                <span className="text-[11px] text-default-400 font-bold">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ReportSection({
  title,
  description,
  number,
  barData,
  donutData,
  colorClass,
  href,
}: {
  title: string;
  description: string;
  number: number;
  barData: any[];
  donutData: any[];
  colorClass: string;
  href: string;
}) {
  return (
    <div className={`space-y-6 pb-2 border-l-4 ${colorClass} pl-6`}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-default-100 text-default-600 font-bold text-sm">
            {number}
          </span>
          <h2 className="text-xl font-bold text-default-900">{title}</h2>
        </div>
        <p className="text-sm text-default-500 ml-11">{description}</p>
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2 ml-4">
        <Card className="border border-default-200 shadow-sm bg-content1/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-0 pt-6 px-6 border-b border-default-100/50 pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-default-500">
                So sánh số lượng
              </h3>
              <p className="text-xs text-default-400 italic">
                Hiển thị giá trị tuyệt đối giữa các nhóm đơn
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-8">
            <BarChartBlock data={barData} />
          </CardBody>
        </Card>

        <Card className="border border-default-200 shadow-sm bg-content1/50 backdrop-blur-md overflow-hidden">
          <CardHeader className="pb-0 pt-6 px-6 border-b border-default-100/50 pb-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-default-500">
                Cấu trúc tỉ lệ (%)
              </h3>
              <p className="text-xs text-default-400 italic">
                Phân tích trọng số của từng thành phần
              </p>
            </div>
          </CardHeader>
          <CardBody className="p-8 flex items-center justify-center">
            <DonutChartBlock data={donutData} />
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-start ml-11 pt-4">
        <Button
          as={Link}
          href={href}
          variant="light"
          color="primary"
          className="font-bold rounded-full group pl-0 pr-8 min-w-0 bg-transparent data-[hover=true]:bg-transparent data-[pressed=true]:bg-transparent"
          endContent={
            <span className="group-hover:translate-x-3 transition-transform duration-300">
              »
            </span>
          }
        >
          Xem chi tiết
        </Button>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const { profile, loading: profileLoading } = useProfile();
  const { hasRole: canView, loading: roleLoading } = useHasAnyRole([
    "IT_STAFF",
    "COMPANY_LEADERSHIP",
  ]);

  const [counts, setCounts] = useState<DetailedStats | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllCounts();
      setCounts(data);
    } catch (err) {
      console.error("Error fetching statistics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!profileLoading && !roleLoading && profile && canView) {
      void load();
    }
  }, [profile, canView, profileLoading, roleLoading, load]);

  if (profileLoading || roleLoading || loading || !counts) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Spinner size="lg" label="Đang tải dữ liệu thống kê..." />
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
          Trang thống kê chỉ dành cho IT và lãnh đạo.
        </p>
      </div>
    );
  }

  // Báo cáo 1: Dự toán chờ phê duyệt
  const report1Bar = [
    { key: "estimatePending", value: counts.estimatePending },
    { key: "estimate", value: counts.estimate },
  ];
  const report1Donut = [
    { key: "estimatePending", value: counts.estimatePending },
    {
      key: "processed",
      value: Math.max(0, counts.estimate - counts.estimatePending),
    },
  ];

  // Báo cáo 2: Tỉ lệ phê duyệt thành công
  // Tính trên tổng số dự toán để biết đã phê duyệt được bao nhiêu % trên tổng số
  const report2Bar = [
    { key: "estimateApproved", value: counts.estimateApproved },
    { key: "estimate", value: counts.estimate },
  ];
  const report2Donut = [
    { key: "estimateApproved", value: counts.estimateApproved },
    {
      key: "pendingReview",
      value: Math.max(0, counts.estimate - counts.estimateApproved),
    },
  ];

  // Báo cáo 3: Chi tiết phê duyệt
  const report3Bar = [
    { key: "estimateApproved", value: counts.estimateApproved },
    { key: "estimateRejected", value: counts.estimateRejected },
  ];
  const report3Donut = [
    { key: "estimateApproved", value: counts.estimateApproved },
    { key: "estimateRejected", value: counts.estimateRejected },
  ];

  // Báo cáo 4: Tình trạng phân công xử lý (Mục 4)
  const report4Bar = [
    { key: "installationAssigned", value: counts.installationAssigned },
    { key: "installation", value: counts.installation },
  ];
  const report4Donut = [
    { key: "installationAssigned", value: counts.installationAssigned },
    {
      key: "unassigned",
      value: Math.max(0, counts.installation - counts.installationAssigned),
    },
  ];

  return (
    <div className="p-8 space-y-12 max-w-[1600px] mx-auto min-h-screen pb-24">
      {/* Header Section */}
      <div className="flex flex-col gap-2 border-b border-default-200 pb-10">
        <h1 className="text-2xl font-extrabold tracking-tight text-default-900">
          Thống Kê Chi Tiết
        </h1>
        <p className="text-default-500 text-lg max-w-2xl font-medium">
          Hệ thống theo dõi và phân tích hiệu suất xử lý hồ sơ, dự toán và thi
          công thời gian thực.
        </p>
      </div>

      {/* Top Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {ORDER.map((key) => (
          <Card
            key={key}
            className="border border-default-200 shadow-sm overflow-hidden"
          >
            <div
              className="h-1 w-full"
              style={{ backgroundColor: COLORS[key] }}
            />
            <CardBody className="p-6">
              <span className="text-sm font-bold text-default-400 uppercase tracking-widest">
                {LABELS[key]}
              </span>
              <p
                className="text-4xl font-black mt-2 tabular-nums"
                style={{ color: COLORS[key] }}
              >
                {counts[key].toLocaleString("vi-VN")}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="space-y-24 pt-8">
        <ReportSection
          number={1}
          title="Báo cáo đơn chờ lập dự toán"
          description="So sánh số lượng đơn đề nghị lắp đặt mới đang đợi lập dự toán so với tổng số dự toán hiện có."
          colorClass="border-warning-400"
          barData={report1Bar}
          donutData={report1Donut}
          href="/waiting-budget"
        />

        <ReportSection
          number={2}
          title="Báo cáo đơn chờ duyệt dự toán"
          description="Đánh giá số lượng dự toán đang chờ phê duyệt chính thức."
          colorClass="border-success-400"
          barData={report2Bar}
          donutData={report2Donut}
          href="/waiting-budget-approval"
        />

        <ReportSection
          number={3}
          title="Báo cáo dự toán đã được phê duyệt duyệt"
          description="Phân tích chất lượng lập dự toán thông qua tương quan giữa dự toán được duyệt và dự toán bị từ chối."
          colorClass="border-danger-400"
          barData={report3Bar}
          donutData={report3Donut}
          href="/reviewed-budget"
        />

        <ReportSection
          number={4}
          title="Báo cáo đơn đã giao khảo sát"
          description="Theo dõi tỉ lệ đơn lắp đặt mới đã được bàn giao cho nhân viên kỹ thuật triển khai khảo sát thực địa."
          colorClass="border-primary-400"
          barData={report4Bar}
          donutData={report4Donut}
          href="/assigned-survey"
        />
      </div>
    </div>
  );
}
