"use client";
import { Button } from "@heroui/react";
import Link from "next/link";
import Footer from "./Footer";
import { siteConfig } from "@/config/site";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const menuItems = [
  { icon: 1, label: "Trang chủ", href: "/" },
  { icon: 2, label: "Khách hàng", href: "/customers" },
  { icon: 3, label: "Khảo sát thị hiếu kỳ", href: "/survey" },
  { icon: 4, label: "Thị công", href: "/market" },
  { icon: 5, label: "Chi chí số & Hóa đơn", href: "/invoices" },
  { icon: 6, label: "Báo cáo", href: "/reports" },
  { icon: 7, label: "Cài đặt", href: "/settings" },
];

export default function Sidebar() {
  return (
    <div
      className={`relative bg-blue-50 border-r border-blue-100 transition-all duration-300 ease-in-out flex flex-col h-full w-64`}
    >
      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-2">
          {siteConfig.navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <Button
                    fullWidth
                    variant="light"
                    className={`justify-start gap-3 text-blue-600 hover:bg-blue-100 transition-colors px-4`}
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                  </Button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <Footer />
    </div>
  );
}
