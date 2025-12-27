"use client";

import { ArrowLeftIcon } from "@heroui/shared-icons";

interface ForgotPasswordHeaderProps {
  onBack: () => void;
  title?: string;
}

const ForgotPasswordHeader = ({
  onBack,
  title = "Quay lại",
}: ForgotPasswordHeaderProps) => {
  return (
    <div className="bg-white-500 text-blue p-4">
      <button
        onClick={onBack}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span>{title}</span>
      </button>
    </div>
  );
};

export default ForgotPasswordHeader;
