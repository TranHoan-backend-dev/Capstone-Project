"use client";

import React from "react";
import { Breadcrumbs, BreadcrumbItem } from "@heroui/react";

interface BreadcrumbItemType {
  label: string;
  href?: string;
  isCurrent?: boolean;
}

interface CustomBreadcrumbProps {
  items: BreadcrumbItemType[];
}

export const CustomBreadcrumb = ({ items }: CustomBreadcrumbProps) => {
  return (
    <Breadcrumbs className="text-default-400" size="sm" variant="light">
      {items.map((item, index) => (
        <BreadcrumbItem
          key={index}
          className={`${item.isCurrent ? "font-bold text-primary" : ""}`}
          href={item.href}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};
