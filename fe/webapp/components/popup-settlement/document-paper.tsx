"use client";

import { ReactNode } from "react";

interface SignRole {
  title: string;
  name?: string;
}

interface DocumentPaperProps {
  children: ReactNode;
  signRoles?: SignRole[];
}

export const DocumentPaper = ({
  children,
  signRoles = [],
}: DocumentPaperProps) => {
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

      {signRoles.length > 0 && (
        <div
          className={`grid gap-4 mt-16`}
          style={{
            gridTemplateColumns: `repeat(${signRoles.length}, 1fr)`,
          }}
        >
          {signRoles.map((role, index) => (
            <div key={index} className="text-center">
              <p>{role.title}</p>
              {role.name && <p className="mt-1">{role.name}</p>}
              <p className="mt-8">________</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
