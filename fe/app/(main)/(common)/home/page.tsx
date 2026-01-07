import { Metadata } from "next";

import { HomePage } from "./HomePage";

import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Trang chủ",
  description: "Trang chủ",
};

const Home = () => {
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-grow">
        <HomePage />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
