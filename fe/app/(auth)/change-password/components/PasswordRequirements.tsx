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
    <div className="text-xs text-gray-500 dark:text-zinc-400 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
      <p className="font-bold mb-2 text-gray-700 dark:text-zinc-300">
        Yêu cầu mật khẩu mới:
      </p>
      <ul className="space-y-2">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center">
            <span
              className={`w-1.5 h-1.5 rounded-full mr-2 ${
                req.met
                  ? "bg-green-500"
                  : req.optional
                    ? "bg-amber-400"
                    : "bg-gray-300 dark:bg-zinc-600"
              }`}
            />
            <span
              className={
                req.met ? "text-green-600 dark:text-green-400 font-medium" : ""
              }
            >
              {req.label}
            </span>
            {req.optional && (
              <span className="text-gray-400 dark:text-zinc-500 ml-1 italic">
                (khuyến khích)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordRequirements;
