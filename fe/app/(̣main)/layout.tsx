import React from "react";
import Header  from "@/components/layout/Header";
import { siteConfig } from "@/config/site"

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-black-50">
      <Header menuItems={siteConfig.navItems} userName="Dung"/>
      <div className="flex flex-1">
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}