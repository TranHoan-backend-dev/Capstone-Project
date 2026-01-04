'use client'

import CustomInput from "@/components/ui/custom/CustomInput";
import { Button, Card, CardBody, Input, Select, SelectItem } from "@heroui/react";
import { useState } from "react";

export const HomePage = () => {
  const [clientMachineName, setClientMachineName] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("program1");

  const programOptions = [
    { key: "program1", label: "Quản trị chương trình" },
    { key: "program2", label: "Chương trình khuyến mãi" },
    { key: "program3", label: "Chương trình VIP" },
  ];

  return (
    <div className="w-full space-y-6">
      <Card className="dark:bg-zinc-900 border-none">
        <CardBody className="gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">
              Phần mềm Quản lý Khách hàng Dùng chung
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              label="Địa chỉ IP máy khách"
              value="117.6.63.110"
              isReadOnly
            />

            <CustomInput
              type="text"
              label="Tên máy khách"
              value={clientMachineName}
              onValueChange={setClientMachineName}
            />

            <div className="md:col-span-2">
              <Select
                label="Chương trình"
                labelPlacement="inside"
                selectedKeys={[selectedProgram]}
                onSelectionChange={(keys) =>
                  setSelectedProgram(Array.from(keys)[0] as string)
                }
                variant="bordered"
              >
                {programOptions.map((option) => (
                  <SelectItem key={option.key} className="dark:text-white">{option.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              color="primary"
            >
              Tìm kiếm
            </Button>
            <Button variant="bordered" className="dark:border-zinc-700 dark:text-zinc-300">Đặt lại</Button>
          </div>
        </CardBody>
      </Card>

      <Card className="dark:bg-zinc-900 border-none">
        <CardBody>
          <div className="text-center text-gray-500 dark:text-zinc-400 py-12">
            <p className="text-base font-medium">Không có dữ liệu để hiển thị</p>
            <p className="text-sm mt-2">Vui lòng chọn bộ lọc và tìm kiếm</p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
