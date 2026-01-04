"use client";

import { Link } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
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
  const [closing, setClosing] = useState(false);

  const mainMenuRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);
  const nestedCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

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
      return subItem.children.some((child) => isItemActive(child.key));
    }

    return false;
  };

  const handleMouseEnterMain = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (closing) {
      setClosing(false);
    }
    setIsOpen(true);
  };

  const handleMouseLeaveMain = () => {
    closeTimerRef.current = setTimeout(() => {
      const isMouseInSubMenu = subMenuRef.current?.contains(
        document.activeElement ||
          document.elementFromPoint(...getMousePosition()),
      );

      if (!isMouseInSubMenu) {
        setClosing(true);
        setTimeout(() => {
          setIsOpen(false);
          setNestedOpen(null);
        }, 100);
      }
    }, 150);
  };

  const handleMouseEnterSub = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const handleMouseLeaveSub = () => {
    nestedCloseTimerRef.current = setTimeout(() => {
      setNestedOpen(null);
    }, 100);
  };

  const handleSubMenuMouseEnter = (key: string) => {
    if (nestedCloseTimerRef.current) {
      clearTimeout(nestedCloseTimerRef.current);
      nestedCloseTimerRef.current = null;
    }
    setNestedOpen(key);
  };

  const getMousePosition = (): [number, number] => {
    return [0, 0];
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      if (nestedCloseTimerRef.current)
        clearTimeout(nestedCloseTimerRef.current);
    };
  }, []);

  return (
    <div
      ref={mainMenuRef}
      className="relative"
      onMouseEnter={handleMouseEnterMain}
      onMouseLeave={handleMouseLeaveMain}
    >
      <div className="flex items-center whitespace-nowrap">
        {item.href ? (
          <Link
            as={NextLink}
            className={`text-sm px-3 py-2 rounded transition-colors ${
              isItemActive(item.key)
                ? "bg-primary-100 text-primary-800 dark:text-white font-medium"
                : "text-foreground-700 hover:bg-default-100"
            }`}
            href={item.href}
            onClick={() => handleItemClick(item.key)}
          >
            {item.label}
          </Link>
        ) : (
          <span
            className={`text-sm px-3 py-2 rounded cursor-pointer ${
              isItemActive(item.key)
                ? "bg-primary-100 text-primary-800 dark:text-white font-medium"
                : "text-foreground-700 hover:bg-default-100"
            }`}
          >
            {item.label}
          </span>
        )}
      </div>

      {isOpen && (
        <div
          ref={subMenuRef}
          className={`absolute top-full left-0 mt-1 z-50 min-w-[220px] bg-content1 shadow-lg rounded-lg border border-divider py-1 transition-opacity duration-100 ${
            closing ? "opacity-0" : "opacity-100"
          }`}
          onMouseEnter={handleMouseEnterSub}
          onMouseLeave={handleMouseLeaveSub}
        >
          {item.items?.map((subItem) => {
            const isSubItemActive = isAnyChildActive(subItem);

            return (
              <div
                key={subItem.key}
                className="relative"
                onMouseEnter={() => handleSubMenuMouseEnter(subItem.key)}
                onMouseLeave={() => !subItem.children && setNestedOpen(null)}
              >
                {subItem.href ? (
                  <Link
                    className={`flex items-center justify-between px-3 py-2 text-sm transition-colors whitespace-nowrap ${
                      isItemActive(subItem.key)
                        ? "bg-primary-100 text-primary-800 dark:text-white font-medium"
                        : "text-foreground-700 hover:bg-default-100"
                    }`}
                    href={subItem.href}
                    onClick={() => handleItemClick(subItem.key)}
                  >
                    {subItem.label}
                  </Link>
                ) : (
                  <div
                    className={`flex items-center justify-between px-3 py-2 text-sm transition-colors cursor-pointer whitespace-nowrap ${
                      isSubItemActive
                        ? "bg-primary-50 text-primary"
                        : "text-foreground-700 hover:bg-default-50"
                    }`}
                  >
                    <span>{subItem.label}</span>
                    {subItem.children && (
                      <span className="text-sm ml-2">›</span>
                    )}
                  </div>
                )}

                {subItem.children && nestedOpen === subItem.key && (
                  <div
                    className="absolute left-full top-0 ml-1 z-50 min-w-[280px] bg-content1 shadow-lg rounded-lg border border-divider py-1"
                    onMouseEnter={handleMouseEnterSub}
                    onMouseLeave={handleMouseLeaveSub}
                  >
                    {subItem.children.map((child) => (
                      <Link
                        key={child.key}
                        className={`block px-3 py-2 text-sm transition-colors whitespace-nowrap ${
                          isItemActive(child.key)
                            ? "bg-primary-100 text-primary-800 dark:text-white font-medium"
                            : "text-foreground-700 hover:bg-default-100"
                        }`}
                        href={child.href || "#"}
                        onClick={() => handleItemClick(child.key)}
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
