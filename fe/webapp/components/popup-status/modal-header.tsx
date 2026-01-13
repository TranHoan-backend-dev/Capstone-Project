import { XMarkIcon } from "@heroicons/react/24/solid";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => (
  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <button className="p-1 hover:bg-gray-100 rounded-lg" onClick={onClose}>
      <XMarkIcon className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);
