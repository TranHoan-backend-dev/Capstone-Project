"use client";

import {
  Button,
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
import NestedDropdown from "../ui/NestedDropdown";
import { useState } from "react";
import Sidebar from "./Sidebar";

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

export default function Header({ menuItems, userName }: NavigationProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            className="p-2 hover:bg-gray-100 rounded-lg"
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
            {menuItems.map((item) =>
              item.items && item.items.length > 0 ? (
                <NestedDropdown key={item.key} item={item} />
              ) : (
                <Link
                  key={item.key}
                  href={item.href || "#"}
                  className="text-sm text-gray-700 hover:text-gray-900 px-2 py-1 whitespace-nowrap hover:bg-gray-100 rounded transition-colors"
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </NavbarContent>

        <NavbarContent as="div" justify="end" className="flex-none">
          {userName && (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  endContent={<ChevronDownIcon className="w-5 h-5" />}
                  className="hidden md:flex"
                >
                  <Tooltip
                    content={userName}
                    placement="bottom"
                    delay={500}
                    className="max-w-xs"
                  >
                    <div className="flex flex-col items-center max-w-[120px]">
                      <span className="text-black text-sm mt-1 truncate w-full text-right">
                        {userName}
                      </span>
                    </div>
                  </Tooltip>
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="User menu" variant="flat">
                <DropdownItem key="profile">Thông tin cá nhân</DropdownItem>
                <DropdownItem
                  key="change-password"
                  as={Link}
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
          )}

          {userName && (
            <div className="md:hidden flex items-center">
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button variant="light" isIconOnly className="min-w-10">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">
                        {userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu" variant="flat">
                  <DropdownItem key="profile">Thông tin cá nhân</DropdownItem>
                  <DropdownItem
                    key="change-password"
                    as={Link}
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
}
