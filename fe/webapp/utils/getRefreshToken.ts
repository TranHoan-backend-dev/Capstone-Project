import { NextRequest } from "next/server";

export const getRefreshToken = (req: NextRequest): string | undefined => {
  return (
    req.cookies.get("refresh_token")?.value ||
    req.cookies.get("__Secure-refresh_token")?.value
  );
};
