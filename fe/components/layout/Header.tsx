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
import { useState } from "react";
import { usePathname } from "next/navigation";

import NestedDropdown from "../ui/nested-dropdown";
import { ThemeSwitch } from "../ui/theme-switch";

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
        className="px-4 md:px-6"
        classNames={{
          wrapper: "max-w-full px-0",
        }}
        maxWidth="full"
      >
        <NavbarContent className="md:hidden" justify="start">
          <button
            className="p-2 hover:bg-default-100 rounded-lg transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="w-6 h-6 text-primary" />
          </button>
          <NavbarBrand className="ml-2">
            <span className="text-lg font-bold">CRM</span>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden md:flex flex-1 gap-8" justify="start">
          <NavbarBrand className="px-4">
            <Bars3Icon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold ml-2">CRM</span>
          </NavbarBrand>

          <div className="hidden md:flex items-center gap-6 font-bold">
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
                    className={`text-sm px-3 py-2 whitespace-nowrap rounded transition-colors cursor-pointer ${
                      isActive
                        ? "bg-primary-100 text-primary-800 dark:text-white font-medium"
                        : "text-foreground-700 hover:bg-default-100"
                    }`}
                    href={item.href || "#"}
                    onClick={() => handleMenuClick(item.key)}
                  >
                    {item.label}
                  </Link>
                );
              }
            })}
          </div>
        </NavbarContent>

        <NavbarContent as="div" className="flex-none gap-4" justify="end">
          {userName && (
            <>
              <ThemeSwitch />
              <NotificationDropdown />

              {/* Desktop version */}
              <Dropdown className="hidden md:block" placement="bottom-end">
                <DropdownTrigger>
                  <div className="flex items-center gap-1 px-3 py-2 cursor-pointer rounded-lg transition-colors hover:bg-default-100">
                    <Tooltip
                      className="max-w-xs"
                      content={userName}
                      delay={500}
                      placement="bottom"
                    >
                      <div className="flex flex-col items-center max-w-[120px]">
                        <span className="text-foreground text-sm truncate w-full font-bold">
                          {userName}
                        </span>
                      </div>
                    </Tooltip>
                    <ChevronDownIcon className="w-4 h-4 text-default-500 flex-shrink-0" />
                  </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu" variant="flat">
                  <DropdownItem
                    key="profile"
                    as={Link}
                    className={`${
                      pathname === "/profile"
                        ? "bg-primary-100 text-primary-800 dark:text-primary-200"
                        : ""
                    }`}
                    href="/profile"
                  >
                    Thông tin cá nhân
                  </DropdownItem>
                  <DropdownItem
                    key="change-password"
                    as={Link}
                    className={`${
                      pathname === "/change-password"
                        ? "bg-primary-100 text-primary-800 dark:text-primary-200"
                        : ""
                    }`}
                    href="/change-password"
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
                    <div className="min-w-10 p-1 cursor-pointer rounded-full hover:bg-primary-50 transition-colors">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-sm">
                          {userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="User menu" variant="flat">
                    <DropdownItem
                      key="profile"
                      as={Link}
                      className={`${
                        pathname === "/profile"
                          ? "bg-primary-100 text-primary-800 dark:text-primary-200"
                          : ""
                      }`}
                      href="/profile"
                    >
                      Thông tin cá nhân
                    </DropdownItem>
                    <DropdownItem
                      key="change-password"
                      as={Link}
                      className={`${
                        pathname === "/change-password"
                          ? "bg-primary-100 text-primary-800 dark:text-primary-200"
                          : ""
                      }`}
                      href="/change-password"
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
        menuItems={menuItems}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Header;
