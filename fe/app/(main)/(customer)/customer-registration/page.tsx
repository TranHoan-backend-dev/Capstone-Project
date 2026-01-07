"use client";
import React from "react";
import { CustomerInfo } from "./components/customer-info";
import { AddressInfo } from "./components/address-info";
import { TechnicalInfo } from "./components/technical-info";
import { BillingInfo } from "./components/billing-info";
// Import thêm Section thông tin thanh toán nếu bạn đã tách riêng
// import { PaymentInfo } from "./components/payment-info"; 
import CustomButton from "@/components/ui/custom/CustomButton";
import { SaveIcon, RefreshIcon } from "@/components/ui/Icons"; 

export default function CustomerRegistrationPage() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen space-y-6">
      <div className="max-w-[1400px] mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {/* Tiêu đề trang bám sát mockup mới */}
        <h1 className="text-xl font-extrabold uppercase text-gray-800 mb-10">
          Nhập hồ sơ khách hàng
        </h1>
        
        <form className="space-y-12">
          {/* Các Section thành phần */}
          <CustomerInfo />
          <AddressInfo />
          {/* Nếu mockup có phần thanh toán riêng, bạn chèn PaymentInfo ở đây */}
          <TechnicalInfo />
          <BillingInfo />

          {/* Cụm nút bấm: Chỉ còn Lưu và Làm mới theo mockup mới nhất */}
          <div className="flex justify-end gap-3 border-t pt-8">
            <CustomButton 
              className="w-fit bg-[#22c55e] hover:bg-green-700 text-white px-6 font-bold"
              startContent={<SaveIcon size={18} />}
            >
              Lưu
            </CustomButton>
            
            <CustomButton 
              className="w-fit bg-[#64748b] hover:bg-slate-600 text-white px-6 font-bold"
              startContent={<RefreshIcon size={18} />}
            >
              Làm mới
            </CustomButton>
          </div>
        </form>
      </div>
    </main>
  );
}