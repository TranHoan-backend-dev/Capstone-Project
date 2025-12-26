"use client";

import { Button, Link } from "@heroui/react";
import { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [nestedOpen, setNestedOpen] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (item.href && pathname === item.href) {
      setActiveItem(item.key);
      return;
    }

    if (item.items) {
      for (const subItem of item.items) {

        if (subItem.href && pathname === subItem.href) {
          setActiveItem(subItem.key);
          return;
        }
        
        if (subItem.children) {
          for (const child of subItem.children) {
            if (child.href && pathname === child.href) {
              setActiveItem(child.key);
              return;
            }
          }
        }
      }
    }
    
    setActiveItem(null);
  }, [pathname, item]);

  const handleItemClick = (key: string) => {
    setActiveItem(key);
    setIsOpen(false);
    setNestedOpen(null);
  };

  const isItemActive = (key: string) => {
    return activeItem === key;
  };

  const isAnyChildActive = (subItem: SubMenuItem) => {
    if (isItemActive(subItem.key)) return true;
    
    if (subItem.children) {
      return subItem.children.some(child => isItemActive(child.key));
    }
    
    return false;
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => {
        setIsOpen(false);
        setNestedOpen(null);
      }}
    >
      <div className="flex items-center whitespace-nowrap">
        {item.href ? (
          <Link
            as={NextLink}
            href={item.href}
            onClick={() => handleItemClick(item.key)}
            className={`text-sm px-3 py-2 rounded transition-colors ${
              isItemActive(item.key)
                ? "bg-blue-200 text-blue-800 font-medium"
                : "text-gray-700 hover:text-gray-900 hover:bg-blue-100"
            }`}
          >
            {item.label}
          </Link>
        ) : (
          <span 
            className={`text-sm px-3 py-2 rounded cursor-default ${
              isItemActive(item.key)
                ? "bg-blue-200 text-blue-800 font-medium"
                : "text-gray-700"
            }`}
          >
            {item.label}
          </span>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-white shadow-lg rounded-lg border border-gray-200 py-1">
          {item.items?.map((subItem) => {
            const isSubItemActive = isAnyChildActive(subItem);
            
            return (
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
                    onClick={() => handleItemClick(subItem.key)}
                    className={`flex items-center justify-between px-3 py-2 text-sm transition-colors whitespace-nowrap ${
                      isItemActive(subItem.key)
                        ? "bg-blue-200 text-blue-800 font-medium"
                        : "text-gray-700 hover:text-gray-900 hover:bg-blue-100"
                    }`}
                  >
                    {subItem.label}
                  </Link>
                ) : (
                  <div className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap ${
                    isSubItemActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-700 hover:text-gray-900 hover:bg-blue-50"
                  }`}>
                    <span>{subItem.label}</span>
                    {subItem.children && <span className="text-sm ml-2">›</span>}
                  </div>
                )}

                {subItem.children && nestedOpen === subItem.key && (
                  <div className="absolute left-full top-0 ml-1 z-50 min-w-[280px] bg-white shadow-lg rounded-lg border border-gray-200 py-1">
                    {subItem.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href || "#"}
                        onClick={() => handleItemClick(child.key)}
                        className={`block px-3 py-2 text-sm transition-colors whitespace-nowrap ${
                          isItemActive(child.key)
                            ? "bg-blue-200 text-blue-800 font-medium"
                            : "text-gray-700 hover:text-gray-900 hover:bg-blue-100"
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NestedDropdown;
