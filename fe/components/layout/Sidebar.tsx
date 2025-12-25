"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { MenuItem } from "./navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

export default function Sidebar({
  isOpen,
  onClose,
  menuItems,
}: SidebarProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  const toggleSubmenu = (key: string) => {
    const newSet = new Set(openSubmenus);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setOpenSubmenus(newSet);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <span className="text-lg font-bold text-gray-900">CRM</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-140px)]">
          <nav className="p-2">
            {menuItems.map((item) => (
              <div key={item.key} className="mb-1">
                {item.items && item.items.length > 0 ? (
                  <>
                    <button
                      onClick={() => toggleSubmenu(item.key)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 transition-colors ${pathname === item.href
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-700"
                        }`}
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${openSubmenus.has(item.key) ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {openSubmenus.has(item.key) && (
                      <div className="ml-4 mt-1 space-y-1">
                        {item.items.map((subItem) => (
                          <div key={subItem.key}>
                            {subItem.children && subItem.children.length > 0 ? (
                              <>
                                <button
                                  onClick={() => toggleSubmenu(subItem.key)}
                                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-gray-100 text-sm ${pathname === subItem.href
                                      ? "bg-blue-50 text-blue-600"
                                      : "text-gray-600"
                                    }`}
                                >
                                  <span>{subItem.label}</span>
                                  <ChevronDownIcon
                                    className={`w-3 h-3 transition-transform ${openSubmenus.has(subItem.key)
                                        ? "rotate-180"
                                        : ""
                                      }`}
                                  />
                                </button>

                                {openSubmenus.has(subItem.key) && (
                                  <div className="ml-4 mt-1 space-y-1">
                                    {subItem.children.map((child) => (
                                      <Link
                                        key={child.key}
                                        href={child.href || "#"}
                                        onClick={onClose}
                                        className={`block p-2 rounded-lg hover:bg-gray-100 text-sm ${pathname === child.href
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-gray-600"
                                          }`}
                                      >
                                        {child.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                href={subItem.href || "#"}
                                onClick={onClose}
                                className={`block p-2 rounded-lg hover:bg-gray-100 text-sm ${pathname === subItem.href
                                    ? "bg-blue-50 text-blue-600"
                                    : "text-gray-600"
                                  }`}
                              >
                                {subItem.label}
                              </Link>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href || "#"}
                    onClick={onClose}
                    className={`block p-3 rounded-lg hover:bg-gray-100 font-medium ${pathname === item.href
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-700"
                      }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
