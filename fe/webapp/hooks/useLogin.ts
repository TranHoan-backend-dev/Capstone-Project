import axiosBase from "@/lib/axios/axios-base";
import { EmployeeProfileData } from "@/types";
import { useEffect, useState } from "react";

export const useProfile = () => {
  const [profile, setProfile] = useState<EmployeeProfileData | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setProfile(JSON.parse(user));
    }
  }, []);

  return { profile };
};
