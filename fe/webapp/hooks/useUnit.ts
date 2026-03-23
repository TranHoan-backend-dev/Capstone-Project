import axiosBase from "@/lib/axios/axios-base";
import { useEffect, useState } from "react";

export const useUnit = () => {
  const [unitOptions, setUnitOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/device/units", { withCredentials: true })
      .then((res) =>
        setUnitOptions(
          res.data.data.content.map((item: any) => ({
            label: item.name,
            value: item.branchId,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { unitOptions, loading };
};
