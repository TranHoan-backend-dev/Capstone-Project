"use client";

import React from "react";
import { Link } from "@heroui/react";
import NextLink from "next/link";

const WaveLogo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 12C4.5 12 4.5 10 7 10C9.5 10 9.5 12 12 12C14.5 12 14.5 10 17 10C19.5 10 19.5 12 22 12" stroke="#006fee" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 16C4.5 16 4.5 14 7 14C9.5 14 9.5 16 12 16C14.5 16 14.5 14 17 14C19.5 14 19.5 16 22 16" stroke="#006fee" strokeWidth="2" strokeLinecap="round" />
        <path d="M2 8C4.5 8 4.5 6 7 6C9.5 6 9.5 8 12 8C14.5 8 14.5 6 17 6C19.5 6 19.5 8 22 8" stroke="#006fee" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const CustomerHeader = () => {
    return (
        <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <div className="flex items-center gap-3">
                        <WaveLogo />
                        <span className="text-2xl font-black text-[#1e293b] tracking-tight">CRM</span>
                    </div>
                    <nav className="flex items-center gap-8">
                        <Link as={NextLink} href="/" className="text-gray-600 text-[15px] font-semibold hover:text-blue-600">Trang chủ</Link>
                        <Link as={NextLink} href="/customers" className="text-[#2563eb] bg-[#eff6ff] px-4 py-2 rounded-lg text-[15px] font-bold">Khách hàng</Link>
                        <Link as={NextLink} href="#" className="text-gray-600 text-[15px] font-semibold hover:text-blue-600">Khảo sát thiết kế</Link>
                        <Link as={NextLink} href="#" className="text-gray-600 text-[15px] font-semibold hover:text-blue-600">Thi công</Link>
                        <Link as={NextLink} href="#" className="text-gray-600 text-[15px] font-semibold hover:text-blue-600">Ghi chỉ số & Hóa đơn</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <span className="text-gray-700 text-[15px] font-semibold group-hover:text-blue-600 transition-colors">Trần Thị Hương</span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
        </header>
    );
};
