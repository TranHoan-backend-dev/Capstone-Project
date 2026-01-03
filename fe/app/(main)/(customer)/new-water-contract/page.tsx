"use client";
import CustomButton from "@/components/ui/CustomButton";
import { CancelIcon, RefreshIcon, SaveIcon } from "@/components/ui/Icons";
import { ContractForm } from "./components/contract-form";
import { ContractTable } from "./components/contract-table";

export default function NewWaterContractPage() {
  return (
    <main className="p-6 bg-gray-100 min-h-screen space-y-6">
      <div className="max-w-[1400px] mx-auto bg-white rounded-lg shadow-sm border p-8 space-y-10">
        <h1 className="text-xl font-extrabold text-gray-800">Hợp Đồng Cấp Nước Mới</h1>

        <form className="space-y-10">
          <ContractForm /> {/* Bạn sẽ chia nhỏ các Section A,B,C... vào đây */}

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6">
            <CustomButton
              className="w-[120px] h-9 rounded-md bg-[#00a651] text-white text-sm"
              startContent={<SaveIcon size={16} />}
            >
              Lưu
            </CustomButton>

            <CustomButton
                    className="w-[120px] h-9 rounded-md bg-[#ee0000] text-white text-sm font-medium"
                    startContent={<CancelIcon size={16} />} // Hoặc dùng XMarkIcon từ HeroIcons
                >
                    Hủy
                </CustomButton>

            <CustomButton
              className="w-[120px] h-9 rounded-md bg-[#6c7a91] text-white text-sm"
              startContent={<RefreshIcon size={16} />}
            >
              Làm mới
            </CustomButton>
          </div>
        </form>

        <div className="pt-10">
          <ContractTable />
        </div>
      </div>
    </main>
  );
}