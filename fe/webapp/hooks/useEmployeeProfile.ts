"use client";

import { useEffect, useState } from "react";
import { getProfileEmployee } from "@/services/auth.service";
import { EmployeeProfileData } from "@/types";
import { CallToast } from "@/components/ui/CallToast";

export function useEmployeeProfile() {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      try {
        const data = await getProfileEmployee();
        if (!cancelled) setProfile(data);
      } catch (err: any) {
        if (!cancelled) {
          CallToast({
            title: "Thất bại",
            message:
              err.response?.data?.message ||
              "Không thể tải thông tin người dùng",
            color: "danger",
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, []);

  return { profile, loading };
}
