import { NextRequest } from "next/server";

export const getAccessTokenFromRequest = (req: NextRequest) =>
  req.cookies.get("access_token")?.value ||
  req.cookies.get("__Secure-access_token")?.value;
