"use client";
import React from "react";
import { FeeForm } from "./components/fee-form";
import { FeeTable } from "./components/fee-table";

export default function FeeCollectionPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen space-y-6 text-sm">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Khối Form */}
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <FeeForm />
        </div>
        
        {/* Khối Table */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <FeeTable />
        </div>
      </div>
    </main>
  );
}