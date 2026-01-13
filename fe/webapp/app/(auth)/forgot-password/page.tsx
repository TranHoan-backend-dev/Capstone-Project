import { Metadata } from "next";

import ForgotPasswordPage from "./forgot-password-page";

export const metadata: Metadata = {
  title: "Đổi mật khẩu",
  description: "Đổi mật khẩu",
};

const ForgotPassword = () => {
  return <ForgotPasswordPage />;
};

export default ForgotPassword;
