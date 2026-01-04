"use client";

interface Props {
  activeTab: "pending" | "assigned";
  onChange: (tab: "pending" | "assigned") => void;
}

const SurveyTabs = ({ activeTab, onChange }: Props) => {
  return (
    <div className="bg-white rounded-t-lg border-t border-l border-r border-gray-200">
      <div className="flex">
        {[
          { key: "pending" as const, label: "Đơn chưa phân công", count: 94 },
          { key: "assigned" as const, label: "Đơn đã phân công", count: 186 },
        ].map((tab) => {
          const isPending = tab.key === "pending";

          return (
            <button
              key={tab.key}
              className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? isPending
                    ? "border-yellow-500 text-blue-600"
                    : "border-green-500 text-blue-600"
                  : "border-transparent text-black-600 hover:text-blue-700"
              }`}
              onClick={() => onChange(tab.key)}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded text-xs ${
                  isPending
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SurveyTabs;
