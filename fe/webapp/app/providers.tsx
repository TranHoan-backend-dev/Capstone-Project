"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SocketProvider } from "@/context/SocketContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { DataCacheProvider } from "@/context/DataCacheContext";
import { useAuthRefresh } from "@/hooks/useAuthRefresh";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export const Providers = ({ children, themeProps }: ProvidersProps) => {
  const router = useRouter();
  useAuthRefresh();
  return (
    <DataCacheProvider>
      <SocketProvider>
        <NotificationProvider>
          <HeroUIProvider navigate={router.push}>
            <NextThemesProvider {...themeProps}>
              <ToastProvider maxVisibleToasts={5} placement="bottom-right" />
              {children}
            </NextThemesProvider>
          </HeroUIProvider>
        </NotificationProvider>
      </SocketProvider>
    </DataCacheProvider>
  );
};
