import { Metadata } from "next";
import ForgotPasswordForm from "./components/ForgotPasswordForm";

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Đổi mật khẩu',
}

const ChangePasswordPage = () => {
  return <ForgotPasswordForm />
};

export default ChangePasswordPage;
