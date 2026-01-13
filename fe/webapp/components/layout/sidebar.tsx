"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MenuItem } from "./Header";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}

const Sidebar = ({ isOpen, onClose, menuItems }: SidebarProps) => {
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
        className={`fixed top-0 left-0 h-full w-64 bg-content1 shadow-lg z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <span className="text-lg font-bold">CRM</span>
          </div>
          <button
            className="p-2 hover:bg-default-100 rounded-lg"
            onClick={onClose}
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
                      className={`w-full flex items-center justify-between p-3 rounded-lg hover:bg-default-100 transition-colors ${
                        pathname === item.href
                          ? "bg-primary-50 text-primary"
                          : "text-foreground-700"
                      }`}
                      onClick={() => toggleSubmenu(item.key)}
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDownIcon
                        className={`w-4 h-4 transition-transform ${
                          openSubmenus.has(item.key) ? "rotate-180" : ""
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
                                  className={`w-full flex items-center justify-between p-2 rounded-lg hover:bg-default-100 text-sm ${
                                    pathname === subItem.href
                                      ? "bg-primary-50 text-primary"
                                      : "text-foreground-600"
                                  }`}
                                  onClick={() => toggleSubmenu(subItem.key)}
                                >
                                  <span>{subItem.label}</span>
                                  <ChevronDownIcon
                                    className={`w-3 h-3 transition-transform ${
                                      openSubmenus.has(subItem.key)
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
                                        className={`block p-2 rounded-lg hover:bg-default-100 text-sm ${
                                          pathname === child.href
                                            ? "bg-primary-50 text-primary"
                                            : "text-foreground-600"
                                        }`}
                                        href={child.href || "#"}
                                        onClick={onClose}
                                      >
                                        {child.label}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </>
                            ) : (
                              <Link
                                className={`block p-2 rounded-lg hover:bg-default-100 text-sm ${
                                  pathname === subItem.href
                                    ? "bg-primary-50 text-primary"
                                    : "text-foreground-600"
                                }`}
                                href={subItem.href || "#"}
                                onClick={onClose}
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
                    className={`block p-3 rounded-lg hover:bg-default-100 font-medium ${
                      pathname === item.href
                        ? "bg-primary-50 text-primary"
                        : "text-foreground-700"
                    }`}
                    href={item.href || "#"}
                    onClick={onClose}
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
};

export default Sidebar;
