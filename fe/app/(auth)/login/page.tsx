import LeftSide from "./components/left-side";
import LoginForm from "./components/login-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Đăng nhập',
  description: 'Đăng nhập',
}

const Page = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[1100px] h-[550px] flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden border border-blue-100">
        <LeftSide />
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
