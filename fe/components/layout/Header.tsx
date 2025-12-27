"use client";

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  Tooltip,
} from "@heroui/react";
import Link from "next/link";
import { Bars3Icon, ChevronDownIcon } from "@heroicons/react/24/solid";
import NestedDropdown from "../ui/nested-dropdown";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import NotificationDropdown from "./NotificationDropdown";

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

interface NavigationProps {
  menuItems: MenuItem[];
  userName?: string;
  onUserMenuAction?: (key: string) => void;
}

const Header = ({ menuItems, userName }: NavigationProps) => {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const isMenuItemActive = (item: MenuItem) => {
    if (item.href && pathname === item.href) {
      return true;
    }

    if (item.items) {
      for (const subItem of item.items) {
        if (subItem.href && pathname === subItem.href) {
          return true;
        }

        if (subItem.children) {
          for (const child of subItem.children) {
            if (child.href && pathname === child.href) {
              return true;
            }
          }
        }
      }
    }

    return false;
  };

  const isLinkActive = (href?: string) => {
    return href && pathname === href;
  };

  const handleMenuClick = (key: string) => {
    setActiveMenu(key);
  };

  return (
    <>
      <HeroUINavbar
        isBordered
        maxWidth="full"
        className="bg-white px-4 md:px-6"
        classNames={{
          wrapper: "max-w-full px-0",
        }}
      >
        <NavbarContent className="md:hidden" justify="start">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bars3Icon className="w-6 h-6 text-blue-600" />
          </button>
          <NavbarBrand className="ml-2">
            <span className="text-lg font-bold text-gray-900">CRM</span>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex flex-1 gap-8" justify="start">
          <NavbarBrand className="px-4">
            <Bars3Icon className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 ml-2">CRM</span>
          </NavbarBrand>

          <div className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const isActive = isMenuItemActive(item);

              if (item.items && item.items.length > 0) {
                return (
                  <div key={item.key} onClick={() => handleMenuClick(item.key)}>
                    <NestedDropdown item={item} />
                  </div>
                );
              } else {
                return (
                  <Link
                    key={item.key}
                    href={item.href || "#"}
                    onClick={() => handleMenuClick(item.key)}
                    className={`text-sm px-3 py-2 whitespace-nowrap rounded transition-colors cursor-pointer ${isActive
                      ? "bg-blue-200 text-blue-800 font-medium"
                      : "text-gray-700 hover:text-gray-900 hover:bg-blue-100"
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="flex-none gap-2">
          {userName && (
            <>
              <NotificationDropdown />

              {/* Desktop version */}
              <Dropdown placement="bottom-end" className="hidden md:block">
                <DropdownTrigger>
                  <div className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-gray-100">
                    <Tooltip
                      content={userName}
                      placement="bottom"
                      delay={500}
                      className="max-w-xs"
                    >
                      <div className="flex flex-col items-center max-w-[120px]">
                        <span className="text-black text-sm truncate w-full">
                          {userName}
                        </span>
                      </div>
                    </Tooltip>
                    <ChevronDownIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu" variant="flat">
                  <DropdownItem
                    key="profile"
                    as={Link}
                    href="/profile"
                    className={`${pathname === "/profile" ? "bg-blue-100" : ""
                      }`}
                  >
                    Thông tin cá nhân
                  </DropdownItem>
                  <DropdownItem
                    key="change-password"
                    as={Link}
                    href="/change-password"
                    className={`${pathname === "/change-password" ? "bg-blue-100" : ""
                      }`}
                  >
                    Đổi mật khẩu
                  </DropdownItem>
                  <DropdownItem
                    key="logout"
                    className="text-danger"
                    color="danger"
                  >
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* Mobile version */}
              <div className="md:hidden flex items-center">
                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="min-w-10 p-1 cursor-pointer rounded-full hover:bg-blue-50 transition-colors">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu" variant="flat">
                    <DropdownItem
                      key="profile"
                      as={Link}
                      href="/profile"
                      className={`${pathname === "/profile" ? "bg-blue-100" : ""
                        }`}
                    >
                      Thông tin cá nhân
                    </DropdownItem>
                    <DropdownItem
                      key="change-password"
                      as={Link}
                      href="/change-password"
                      className={`${pathname === "/change-password" ? "bg-blue-100" : ""
                        }`}
                    >
                      Đổi mật khẩu
                    </DropdownItem>
                    <DropdownItem
                      key="logout"
                      className="text-danger"
                      color="danger"
                    >
                      Đăng xuất
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
            </>
          )}
        </NavbarContent>
      </HeroUINavbar>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        menuItems={menuItems}
      />
    </>
  );
};

export default Header;
