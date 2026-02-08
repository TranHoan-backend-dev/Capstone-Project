export const getAccessToken = (req: any) => {
  return (
    req.cookies.get("access_token")?.value ||
    req.cookies.get("__Secure-access_token")?.value
  );
};
