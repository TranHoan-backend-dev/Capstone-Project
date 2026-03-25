import axiosBase from "@/lib/axios/axios-base";
import { EmployeeProfileData } from "@/types";
import { useEffect, useState } from "react";

export const useEmployeeProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axiosBase.get("/api/auth/me", {
          withCredentials: true,
        });

        // Handle response format
        if (res.data && res.data.data) {
          setProfile(res.data.data);
        } else if (res.data && !res.data.data) {
          setProfile(res.data);
        } else {
          setProfile(null);
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(
          err.response?.data?.message || "Không thể tải thông tin người dùng",
        );
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
};
