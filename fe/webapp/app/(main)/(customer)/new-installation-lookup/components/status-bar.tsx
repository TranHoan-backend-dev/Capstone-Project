"use client";

import type { OrderStage, OrderStatus } from "@/types";

import clsx from "clsx";
import { Tooltip } from "@heroui/react";

import { STAGES, STATUS_COLOR, STATUS_LABEL } from "@/constants/status-config";

interface StatusBarProps {
  stage: OrderStage;
  status: OrderStatus;
}

export const StatusBar = ({ stage, status }: StatusBarProps) => {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  if (currentIndex === -1) return null;

  return (
    <div className="w-full space-y-1">
      {/* ===== PROCESS BAR ===== */}
      <div className="flex items-center gap-1">
        {STAGES.map((s, idx) => {
          const isCurrent = idx === currentIndex;
          const isDone = idx < currentIndex;

          const tooltipColor = isDone
            ? "bg-green-500 text-white"
            : isCurrent
              ? clsx(STATUS_COLOR[status], "text-white")
              : "bg-gray-200 text-gray-600";

          return (
            <Tooltip
              key={s.key}
              closeDelay={0}
              classNames={{
                content: tooltipColor,
              }}
              content={
                <div className="text-sm">
                  <div className="font-semibold">{s.label}</div>
                  {isCurrent && (
                    <div className="text-xs opacity-80">
                      {STATUS_LABEL[status]}
                    </div>
                  )}
                </div>
              }
            >
              <div
                className={clsx(
                  "h-2 flex-1 rounded-full transition-all cursor-pointer",
                  isDone && "bg-green-500",
                  isCurrent && STATUS_COLOR[status],
                  idx > currentIndex && "bg-gray-200",
                )}
              />
            </Tooltip>
          );
        })}
      </div>

      {/* ===== TEXT UNDER BAR ===== */}
      <div className="grid grid-cols-4 text-[11px] text-gray-500">
        {STAGES.map((s, idx) => {
          const isCurrent = idx === currentIndex;

          return (
            <div key={s.key} className="text-center leading-tight">
              <div
                className={clsx("font-medium dark:text-white", isCurrent && "text-gray-800")}
              >
                {s.label}
              </div>

              {isCurrent && (
                <div
                  className={clsx(
                    "mt-0.5 font-semibold",
                    status === "approved" && "text-green-600",
                    status === "processing" && "text-blue-600",
                    status === "pending" && "text-yellow-600",
                    status === "rejected" && "text-red-600",
                  )}
                >
                  {STATUS_LABEL[status]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
