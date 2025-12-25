import { Metadata } from "next";
import clsx from "clsx";
import { Providers } from "./providers";
import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import "@/styles/globals.css";
import Header from "@/components/layout/header";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

const RootLayout = async ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <html suppressHydrationWarning>
      <body
        className={clsx(
          "min-h-screen font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <div className="min-h-screen flex flex-col bg-black-50">
            <Header menuItems={siteConfig.navItems} userName="Dung" />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
