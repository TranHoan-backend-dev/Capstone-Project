
import { Metadata } from "next";
import ChangePasswordForm from "./components/ChangePasswordForm";

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Đổi mật khẩu',
}

const ChangePasswordPage = () => {
  return <ChangePasswordForm />
};

export default ChangePasswordPage;
