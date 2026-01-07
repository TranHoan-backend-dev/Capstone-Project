"use client";

import { ArrowedLeftIcon } from "@/config/chip-and-icon";

interface ChangePasswordHeaderProps {
  onBack: () => void;
  title?: string;
}

const ChangePasswordHeader = ({
  onBack,
  title = "Quay lại",
}: ChangePasswordHeaderProps) => {
  return (
    <div className="bg-transparent text-blue-600 dark:text-primary p-4">
      <button
        className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
        onClick={onBack}
      >
        <ArrowedLeftIcon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </button>
    </div>
  );
};

export default ChangePasswordHeader;
