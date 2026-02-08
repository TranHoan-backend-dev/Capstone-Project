import React from "react";

import Header from "@/components/layout/Header";
import { siteConfig } from "@/config/site";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header menuItems={siteConfig.navItems}/>
      <main className="flex-1 p-4 md:p-8 max-w-[1600px] w-full mx-auto flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default layout;
