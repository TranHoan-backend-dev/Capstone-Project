import axiosBase from "@/lib/axios/axios-base";
import { useEffect, useState } from "react";

export const useMaterialGroup = () => {
  const [materialGroupOptions, setMaterialGroupOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/device/materials-group", { withCredentials: true })
      .then((res) =>
        setMaterialGroupOptions(
          res.data.data.content.map((item: any) => ({
            label: item.name,
            value: item.branchId,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { materialGroupOptions, loading };
};
