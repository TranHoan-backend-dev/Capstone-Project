import axiosBase from "@/lib/axios/axios-base";
import { useEffect, useState } from "react";

export const useCommune = () => {
  const [communeOptions, setCommuneOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/construction/communes", { withCredentials: true })
      .then((res) =>
        setCommuneOptions(
          res.data.data.content.map((item: any) => ({
            label: item.name,
            value: item.communeId,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { communeOptions, loading };
};
