import LeftSide from "./components/LeftSide";
import LoginForm from "./components/LoginForm";

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
