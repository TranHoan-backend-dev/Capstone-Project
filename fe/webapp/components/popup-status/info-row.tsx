interface InfoRowProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

export const InfoRow = ({ label, value, icon }: InfoRowProps) => {
  return (
    <div className="flex gap-4">
      <div className="w-40 flex-shrink-0">
        <span className="text-sm text-gray-600">{label}</span>
      </div>
      <div className="flex-1 flex items-center gap-2 text-sm text-gray-900">
        {value}
        {icon}
      </div>
    </div>
  );
};
