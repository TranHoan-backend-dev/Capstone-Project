"use client";
import { ConstructionProcessor } from "./components/construction-processor";
import { ApprovedTable, PendingTable } from "./components/construction-tables";

export default function PendingConstructionPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen space-y-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-gray-800">Xử lý Đơn Chờ Thi Công</h1>
        
        <ConstructionProcessor />
        
        <div className="space-y-10">
          <PendingTable />
          <ApprovedTable />
        </div>
      </div>
    </main>
  );
}