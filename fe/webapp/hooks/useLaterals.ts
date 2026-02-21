import axiosBase from "@/lib/axios/axios-base";
import { useEffect, useState } from "react";

export const useLateral = () => {
  const [lateralOptions, setLateralOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/construction/laterals", { withCredentials: true })
      .then((res) =>
        setLateralOptions(
          res.data.data.content.map((item: any) => ({
            label: item.name,
            value: item.id,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { lateralOptions, loading };
};
