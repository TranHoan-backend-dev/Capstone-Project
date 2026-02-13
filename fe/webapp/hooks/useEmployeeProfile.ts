import axiosBase from "@/lib/axios/axios-base";
import { EmployeeProfileData } from "@/types";
import { useEffect, useState } from "react";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  return { profile, loading };
};
