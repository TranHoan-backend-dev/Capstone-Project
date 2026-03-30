import { EmployeeProfileData } from "@/types";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setProfile(parsedUser);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setProfile(null);
      }
    }
    setLoading(false);
  }, []);

  const hasRole = (role: string | string[]): boolean => {
    if (!profile?.role) return false;

    const roleList = Array.isArray(role) ? role : [role];
    const userRoles = Array.isArray(profile.role)
      ? profile.role
      : [profile.role];

    return roleList.some((role) => userRoles.includes(role));
  };

  return { profile, loading, hasRole };
};
