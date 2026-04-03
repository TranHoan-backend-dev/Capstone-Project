"use client";

import {
  Avatar,
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
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import NestedDropdown from "../ui/nested-dropdown";
import { ThemeSwitch } from "../ui/theme-switch";

import Sidebar from "./sidebar";
import NotificationDropdown from "./NotificationDropdown";
import { CallToast } from "../ui/CallToast";
import axios from "axios";
import { useProfile } from "@/hooks/useLogin";
import { filterNavItems, siteConfig } from "@/config/site";

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

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { profile } = useProfile();
  const filteredMenu = profile?.role
    ? filterNavItems(siteConfig.navItems, profile?.role)
    : [];

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

  const handleMenuClick = (key: string) => {
    setActiveMenu(key);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      localStorage.removeItem("user");
      CallToast({
        title: "Thành công",
        message: "Đăng xuất thành công!",
        color: "success",
      });

      router.replace("/login");
    } catch (err: any) {
      CallToast({
        title: "Thất bại",
        message:
          err.response?.data?.message || "Đăng xuất thất bại, vui lòng thử lại",
        color: "danger",
      });
    }
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
            <span className="text-lg font-bold">CMSN</span>
          </NavbarBrand>
        </NavbarContent>

        <div className="hidden md:flex items-center w-full">
          <div className="flex-shrink-0 px-4">
            <div className="flex items-center">
              <Bars3Icon className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold ml-2">CMSN</span>
            </div>
          </div>

          <div className="flex-1 flex items-center">
            <div className="flex items-center gap-2 font-bold">
              {filteredMenu.map((item) => {
                const isActive = isMenuItemActive(item);

                if (item.items && item.items.length > 0) {
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleMenuClick(item.key)}
                    >
                      <NestedDropdown item={item} />
                    </div>
                  );
                } else {
                  return (
                    <Link
                      key={item.key}
                      className={`text-sm px-4 py-2 whitespace-nowrap rounded-lg transition-colors cursor-pointer ${
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
          </div>

          <div className="flex-shrink-0 flex items-center gap-4">
            {profile?.fullname && (
              <>
                <ThemeSwitch />
                <NotificationDropdown />

                <Dropdown placement="bottom-end">
                  <DropdownTrigger>
                    <div className="flex items-center gap-2 px-2 py-2 cursor-pointer rounded-lg transition-colors hover:bg-default-100">
                      <Tooltip
                        className="max-w-xs"
                        content={profile.fullname}
                        delay={500}
                        placement="bottom"
                      >
                        <span className="hidden md:block text-sm font-bold">
                          {profile.fullname}
                        </span>
                      </Tooltip>

                      <Avatar
                        src={profile.avatarUrl}
                        name={profile.fullname}
                        size="sm"
                        className="bg-primary-100 text-primary-600"
                        fallback={
                          <span className="font-semibold">
                            {profile.fullname.charAt(0).toUpperCase()}
                          </span>
                        }
                      />
                    </div>
                  </DropdownTrigger>

                  <DropdownMenu
                    aria-label="User menu"
                    variant="flat"
                    onAction={(key) => {
                      if (key === "logout") handleLogout();
                    }}
                  >
                    <DropdownItem
                      key="profile"
                      as={Link}
                      className={`${
                        pathname === "/profile-employee"
                          ? "bg-primary-100 text-primary-800 dark:text-primary-200"
                          : ""
                      }`}
                      href="/profile-employee"
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
              </>
            )}
          </div>
        </div>
      </HeroUINavbar>

      <Sidebar
        isOpen={sidebarOpen}
        menuItems={filteredMenu}
        onClose={() => setSidebarOpen(false)}
      />
    </>
  );
};

export default Header;
