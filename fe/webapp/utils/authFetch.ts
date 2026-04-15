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
// let isRefreshing = false;
// let refreshPromise: Promise<boolean> | null = null;
//
// /**
//  * Phiên bản cải tiến của fetch, tự động xử lý refresh token khi gặp lỗi 401.
//  * Đảm bảo chỉ có duy nhất một yêu cầu refresh được gửi đi tại một thời điểm
//  * nhờ cơ chế khóa (locking) sử dụng refreshPromise.
//  */
// export async function authFetch(url: string, options: RequestInit = {}) {
//   let res = await fetch(url, {
//     ...options,
//     credentials: "include",
//   });
//
//   // Nếu gặp lỗi 401 (Unauthorized)
//   if (res.status === 401) {
//     // Nếu URL đang gọi chính là API refresh mà bị 401, không thử lại để tránh lặp vô hạn
//     if (url.includes("/api/auth/refresh")) {
//       return res;
//     }
//
//     // Nếu chưa có tiến trình làm mới nào, thì bắt đầu làm mới
//     if (!isRefreshing) {
//       isRefreshing = true;
//       refreshPromise = fetch("/api/auth/refresh", {
//         method: "POST",
//         credentials: "include",
//       })
//           .then((refreshRes) => refreshRes.ok)
//           .catch(() => false)
//           .finally(() => {
//             isRefreshing = false;
//             refreshPromise = null;
//           });
//     }
//
//     // Đợi tiến trình làm mới hoàn thành
//     const isSuccess = refreshPromise ? await refreshPromise : false;
//
//     // Chỉ thử lại nếu làm mới token thành công
//     if (isSuccess) {
//       res = await fetch(url, {
//         ...options,
//         credentials: "include",
//       });
//     } else {
//       // Nếu làm mới thất bại (ví dụ Refresh Token cũng hết hạn)
//       // Chuyển hướng về trang login nếu đang chạy ở trình duyệt
//       if (typeof window !== "undefined" && !url.includes("/api/auth/token")) {
//         console.warn("Session expired. Redirecting to login...");
//         // Tránh redirect liên tục nếu nhiều request cùng fail
//         if (!window.location.pathname.startsWith("/login")) {
//           window.location.href = "/login?expired=true";
//         }
//       }
//     }
//   }
//
//   return res;
// }
