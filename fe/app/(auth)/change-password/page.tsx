import OTPForm from "@/components/layout/OTPForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đổi mật khẩu',
  description: 'Đổi mật khẩu',
}

const ChangePasswordPage = () => {
  return <OTPForm />
};

export default ChangePasswordPage;
