"use client";

import { TIME_REFESH_TOKEN } from "@/constants/auth.constants";
import { useEffect } from "react";

export function useAuthRefresh() {
  useEffect(() => {
    const interval = setInterval(async () => {
      await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });
    }, TIME_REFESH_TOKEN);

    return () => clearInterval(interval);
  }, []);
}
