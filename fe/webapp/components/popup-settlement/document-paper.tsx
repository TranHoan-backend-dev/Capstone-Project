"use client";

import { ReactNode } from "react";

export const DocumentPaper = ({ children }: { children: ReactNode }) => {
  return (
    <div
      className="bg-white shadow-lg mx-auto border border-gray-300"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "20mm 15mm",
        boxSizing: "border-box",
      }}
    >
      {children}
    </div>
  );
};
