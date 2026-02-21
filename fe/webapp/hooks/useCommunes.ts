import axiosBase from "@/lib/axios/axios-base";
import { CommuneItem } from "@/types";
import { useEffect, useState } from "react";

export const useCommune = () => {
  const [communes, setCommunes] = useState<CommuneItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/construction/communes", { withCredentials: true })
      .then((res) => setCommunes(res.data))
      .catch(() => setCommunes([]))
      .finally(() => setLoading(false));
  }, []);

  return { communes, loading };
};
