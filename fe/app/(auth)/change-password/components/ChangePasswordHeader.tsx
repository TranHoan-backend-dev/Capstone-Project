"use client";

import { ArrowLeftIcon } from "@heroui/shared-icons";

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
        onClick={onBack}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity w-fit"
      >
        <ArrowLeftIcon className="w-5 h-5" />
        <span className="font-medium">{title}</span>
      </button>
    </div>
  );
};

export default ChangePasswordHeader;
