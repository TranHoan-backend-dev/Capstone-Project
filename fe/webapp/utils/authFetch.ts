export async function authFetch(url: string, options: RequestInit = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401) {
    await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return res;
}
