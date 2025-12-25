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
        <Breadcrumbs variant="light" size="sm" className="text-gray-400">
            {items.map((item, index) => (
                <BreadcrumbItem
                    key={index}
                    href={item.href}
                    className={`${item.isCurrent ? "font-bold text-[#2563eb]" : ""}`}
                >
                    {item.label}
                </BreadcrumbItem>
            ))}
        </Breadcrumbs>
    );
};
