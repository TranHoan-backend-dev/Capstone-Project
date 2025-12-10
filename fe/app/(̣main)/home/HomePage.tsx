'use client'

import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
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
    <main className="container mx-auto px-6 py-6">
      <Card className="mb-6">
        <CardBody className="gap-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg font-semibold text-gray-800">
            Phân mềm Quản lý Khách hàng Dùng chung
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              type="text"
              label="Client ID"
              value="117.6.63.110"
              isReadOnly
              variant="bordered"
              classNames={{
                input: "bg-gray-50",
              }}
            />

            <Input
              type="text"
              label="Client machine name"
              placeholder="Nhập tên máy..."
              value={clientMachineName}
              onValueChange={setClientMachineName}
              variant="bordered"
            />

            <div className="md:col-span-2">
              <Select
                label="Chương trình"
                placeholder="Chọn chương trình"
                selectedKeys={[selectedProgram]}
                onSelectionChange={(keys) =>
                  setSelectedProgram(Array.from(keys)[0] as string)
                }
                variant="bordered"
              >
                {programOptions.map((option) => (
                  <SelectItem key={option.key}>{option.label}</SelectItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              color="primary"
              // startContent={<SearchIcon className="w-4 h-4" />}
            >
              Tìm kiếm
            </Button>
            <Button variant="bordered">Đặt lại</Button>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-center text-gray-500 py-12">
            {/* <UsersIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" /> */}
            <p className="text-base">Không có dữ liệu để hiển thị</p>
            <p className="text-sm mt-2">Vui lòng chọn bộ lọc và tìm kiếm</p>
          </div>
        </CardBody>
      </Card>
    </main>
  );
};
