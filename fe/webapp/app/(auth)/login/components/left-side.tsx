"use client";

import { Image } from "@heroui/react";
import logo from "@/public/logo.png";

const LeftSide = () => {
  return (
    <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-blue-600 to-orange-500 flex flex-col items-center justify-center text-white p-6">
      <div className="mb-6 md:mb-8">
        <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 mx-auto">
          <Image
            src={logo.src}
            alt="Logo"
            className="w-full h-full object-cover rounded-full"
          />
        </div>
      </div>
      <h1 className="text-3xl md:text-5xl font-bold mb-2">CMSN</h1>
      <p className="text-base md:text-lg text-white/90">Phiên bản 1.0.0</p>
    </div>
  );
};

export default LeftSide;
