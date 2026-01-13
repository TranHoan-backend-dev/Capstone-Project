import { Metadata } from "next";

import LeftSide from "./components/left-side";
import LoginForm from "./components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập",
};

const Page = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] dark:bg-zinc-950 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-[1100px] h-[550px] flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden border border-blue-100 dark:border-zinc-800">
        <LeftSide />
        <LoginForm />
      </div>
    </div>
  );
};

export default Page;
