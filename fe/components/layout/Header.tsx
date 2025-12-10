"use client";

import Image from "next/image";
import {
  Avatar,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Tooltip,
} from "@heroui/react";
import { useState } from "react";
import { ThemeSwitch } from "../ui/theme-switch";

export const Header = () => {
  const [activeTab, setActiveTab] = useState("home");

  const user = {
    name: "DungND dfagsafasfasgasgaa",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  const mainNavItems = [
    { key: "home", label: "Trang chủ" },
    { key: "customers", label: "Khách hàng" },
  ];

  const dropdownNavItems = [
    { key: "leads", label: "Khách sát thái kỳ" },
    { key: "calls", label: "Tin công" },
    { key: "stats", label: "Gần chỉ số & Hoạt động" },
  ];

  return (
    <HeroUINavbar isBordered maxWidth="full" className="bg-blue-500">
      <NavbarBrand>
        <Image
          src="/next.svg"
          width={40}
          height={40}
          alt="CRM Logo"
          className="rounded"
        />
        <p className="font-bold text-white ml-2">CRM</p>
      </NavbarBrand>

      <NavbarContent as="div" justify="end" className="gap-4">
        <ThemeSwitch />
        <Dropdown backdrop="blur" placement="bottom-end">
          <DropdownTrigger>
            <div className="flex flex-col items-center cursor-pointer hover:opacity-80 transition-opacity">
              <Tooltip
                content={user.name}
                placement="bottom"
                delay={500}
                className="max-w-xs"
              >
                <div className="flex flex-col items-center max-w-[120px]">
                  <Avatar
                    isBordered
                    as="button"
                    className="transition-transform hover:scale-110 cursor-pointer"
                    color="primary"
                    size="sm"
                    src={user.avatar}
                  />
                  <span className="text-white text-xs mt-1 truncate w-full text-right">{user.name}</span>
                </div>
              </Tooltip>
            </div>
          </DropdownTrigger>

          <DropdownMenu
            aria-label="User menu actions"
            className="w-56"
            variant="flat"
          >
            <DropdownItem key="change-password">Đổi mật khẩu</DropdownItem>
            <DropdownItem key="logout" color="danger">
              Đăng xuất
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </NavbarContent>
    </HeroUINavbar>
  );
};
