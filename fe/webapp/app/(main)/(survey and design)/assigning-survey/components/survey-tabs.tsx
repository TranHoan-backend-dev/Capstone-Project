"use client";

import { Tabs, Tab, Chip } from "@heroui/react";

interface Props {
  activeTab: "pending" | "assigned";
  onChange: (tab: "pending" | "assigned") => void;
}

const SurveyTabs = ({ activeTab, onChange }: Props) => {
  return (
    <Tabs
      aria-label="Survey Status"
      classNames={{
        cursor: activeTab === "pending" ? "bg-yellow-500" : "bg-green-500",
        tab: "max-w-fit px-6 h-12",
        tabContent: `group-data-[selected=true]:text-blue-600 font-medium text-black dark:text-white dark:group-data-[selected=true]:text-yellow-300`,
        tabList:
          "gap-6 w-full relative rounded-none p-0 border-b border-divider",
      }}
      selectedKey={activeTab}
      variant="underlined"
      onSelectionChange={(key) => onChange(key as "pending" | "assigned")}
    >
      <Tab
        key="pending"
        title={
          <div className="flex items-center space-x-2">
            <span>Đơn chưa phân công</span>
            <Chip color="warning" size="sm" variant="flat">
              94
            </Chip>
          </div>
        }
      />
      <Tab
        key="assigned"
        title={
          <div className="flex items-center space-x-2">
            <span>Đơn đã phân công</span>
            <Chip color="success" size="sm" variant="flat">
              186
            </Chip>
          </div>
        }
      />
    </Tabs>
  );
};

export default SurveyTabs;
