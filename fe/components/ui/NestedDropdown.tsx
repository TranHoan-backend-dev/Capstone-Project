"use client";

import { Button, Link } from "@heroui/react";
import { useState } from "react";

export interface SubMenuItemChild {
  key: string;
  label: string;
  href?: string;
}

export interface SubMenuItem {
  key: string;
  label: string;
  href?: string;
  children?: SubMenuItemChild[];
}

export interface MenuItem {
  key: string;
  label: string;
  href?: string;
  items?: SubMenuItem[];
}

const NestedDropdown = ({ item }: { item: MenuItem }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState<string | null>(null);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setNestedOpen(null);
      }}
    >
      <Button
        disableRipple
        variant="light"
        className="text-sm text-gray-700 hover:text-gray-900 p-0 bg-transparent data-[hover=true]:bg-transparent h-auto min-w-0 px-2"
      >
        {item.label}
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-white shadow-lg rounded-lg border border-gray-200 py-1">
          {item.items?.map((subItem) => (
            <div
              key={subItem.key}
              className="relative"
              onMouseEnter={() =>
                subItem.children && setNestedOpen(subItem.key)
              }
              onMouseLeave={() => !subItem.children && setNestedOpen(null)}
            >
              {subItem.href ? (
                <Link
                  href={subItem.href}
                  className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                >
                  {subItem.label}
                </Link>
              ) : (
                <div className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer">
                  {subItem.label}
                  {subItem.children && <span className="text-sm ml-2">›</span>}
                </div>
              )}

              {subItem.children && nestedOpen === subItem.key && (
                <div className="absolute left-full top-0 ml-1 z-50 min-w-[280px] bg-white shadow-lg rounded-lg border border-gray-200 py-1">
                  {subItem.children.map((child) => (
                    <Link
                      key={child.key}
                      href={child.href || "#"}
                      className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors whitespace-nowrap"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;
