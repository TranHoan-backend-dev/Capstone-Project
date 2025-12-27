"use client";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements = ({ password }: PasswordRequirementsProps) => {
  const requirements = [
    {
      label: "Ít nhất 6 ký tự",
      met: password.length >= 6,
    },
    {
      label: "Có ít nhất 1 chữ hoa",
      met: /[A-Z]/.test(password),
    },
    {
      label: "Có ít nhất 1 số",
      met: /[0-9]/.test(password),
    },
    {
      label: "Có ít nhất 1 ký tự đặc biệt",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      optional: true,
    },
  ];

  return (
    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded border border-blue-100">
      <p className="font-medium mb-1">Yêu cầu mật khẩu mới:</p>
      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2 ${req.met ? "bg-green-500" : req.optional ? "bg-yellow-300" : "bg-gray-300"
                }`}
            ></span>
            {req.label}
            {req.optional && <span className="text-gray-400 ml-1">(khuyến khích)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;