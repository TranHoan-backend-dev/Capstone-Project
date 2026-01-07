import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export default getRequestConfig(async () => {
  // Static for now, we'll change this later
  const store = await cookies();
  const locale = store.get("locale")?.value || "vi";

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
