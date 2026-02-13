"use client";

import { Card, CardBody } from "@heroui/react";
import React from "react";

const WaterIndexMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { label: "Chỉ số kỳ trước", value: "1,245", unit: "m³" },
        { label: "Chỉ số kỳ này", value: "1,278", unit: "m³" },
        { label: "Tiêu thụ", value: "33", unit: "m³", isHighlight: true },
      ].map((item, idx) => (
        <Card
          key={idx}
          className="border-none rounded-2xl bg-white dark:bg-zinc-900"
          shadow="sm"
        >
          <CardBody className="p-8 flex flex-col items-center justify-center space-y-3 relative group overflow-hidden">
            <p className="text-xs font-bold text-gray-400 dark:text-white uppercase tracking-widest">
              {item.label}
            </p>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-4xl font-black ${item.isHighlight ? "text-blue-600 dark:text-blue-500" : "text-gray-800 dark:text-white"}`}
              >
                {item.value}
              </span>
              <span className="text-sm font-bold text-gray-400 dark:text-zinc-500">
                {item.unit}
              </span>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
};

export default WaterIndexMetrics;
