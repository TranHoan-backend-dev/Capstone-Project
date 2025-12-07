import LeftSide from "@/components/logo/LeftSide";
import LoginForm from "@/components/forms/LoginForm";

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
