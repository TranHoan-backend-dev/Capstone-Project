import { Metadata } from "next";
import ForgotPasswordPage from "./forgot-password";

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Đổi mật khẩu',
}

const ChangePasswordPage = () => {
  return <ForgotPasswordPage />
};

export default ChangePasswordPage;
