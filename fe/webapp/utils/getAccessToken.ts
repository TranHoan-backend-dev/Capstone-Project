import { NextRequest } from "next/server";

export const getAccessToken = (req: NextRequest): string | undefined => {
  return (
    req.cookies.get("access_token")?.value ||
    req.cookies.get("__Secure-access_token")?.value
  );
};
