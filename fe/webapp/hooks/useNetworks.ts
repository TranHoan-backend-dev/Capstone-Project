import axiosBase from "@/lib/axios/axios-base";
import { useEffect, useState } from "react";

export const useNetwork = () => {
  const [networkOptions, setNetworkOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosBase
      .get("/api/construction/networks", { withCredentials: true })
      .then((res) =>
        setNetworkOptions(
          res.data.data.content.map((item: any) => ({
            label: item.name,
            value: item.branchId,
          })),
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  return { networkOptions, loading };
};
