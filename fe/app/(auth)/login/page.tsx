import LeftSide from "@/app/(auth)/login/component/LeftSide";
import LoginForm from "@/app/(auth)/login/component/LoginForm";

export default function Page() {
  return (
    <div className="min-h-screen bg-[#eaf4ff] flex items-center justify-center">
      <div className="bg-white w-[700px] rounded-xl shadow-lg flex p-8 border border-blue-100">
        <LeftSide />
        <LoginForm />
      </div>
    </div>
  );
}
