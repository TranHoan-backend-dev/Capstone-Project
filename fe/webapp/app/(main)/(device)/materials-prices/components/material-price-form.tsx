"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody } from "@heroui/react";
import { MaterialPriceFormProps } from "@/types";

const unitOptions = [
  { label: "Kg", value: "kg" },
  { label: "m", value: "m" },
  { label: "Cái", value: "piece" },
];

const groupOptions = [
  { label: "Ống", value: "pipe" },
  { label: "Phụ kiện", value: "accessory" },
];
export const MaterialPriceForm = ({
  initialData,
  onSuccess,
  onClose,
}: MaterialPriceFormProps) => {
  const isEdit = !!initialData?.id;

  const [materialCode, setMaterialCode] = useState("");
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");

  const [unit, setUnit] = useState(new Set<string>());
  const [group, setGroup] = useState(new Set<string>());

  const [price, setPrice] = useState("");
  const [laborPrice, setLaborPrice] = useState("");
  const [laborPriceDistrict, setLaborPriceDistrict] = useState("");
  const [machinePrice, setMachinePrice] = useState("");
  const [machinePriceDistrict, setMachinePriceDistrict] = useState("");

  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    try {
      setSubmitLoading(true);

      const payload = {
        materialCode,
        symbol,
        name,
        unit,
        group,
        price,
        laborPrice,
        laborPriceDistrict,
        machinePrice,
        machinePriceDistrict,
      };

      console.log(payload);

      CallToast({
        title: "Thành công",
        message: isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!",
        color: "success",
      });

      onSuccess();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message || "Có lỗi xảy ra",
        color: "danger",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Card shadow="sm" className="rounded-2xl border border-divider bg-content1">
      <CardBody className="p-0">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-divider">
          <h2 className="text-base font-semibold">
            {isEdit ? "Cập nhật vật tư" : "Thêm mới vật tư"}
          </h2>
        </div>

        <div className="px-6 py-5 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Mã hiệu nhân công"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
            <CustomInput
              label="Nội dung"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <CustomInput
              label="Giá vật tư"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Giá nhân công"
              value={laborPrice}
              onChange={(e) => setLaborPrice(e.target.value)}
            />
            <CustomSelect
              label="Nhóm vật tư"
              selectedKeys={group}
              onSelectionChange={setGroup}
              options={groupOptions}
            />
            <CustomInput
              label="Giá máy thi công"
              value={machinePrice}
              onChange={(e) => setMachinePrice(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Giá nhân công huyện"
              value={laborPriceDistrict}
              onChange={(e) => setLaborPriceDistrict(e.target.value)}
            />
            <CustomSelect
              label="Đơn vị tính"
              selectedKeys={unit}
              onSelectionChange={setUnit}
              options={unitOptions}
            />
            <CustomInput
              label="Giá máy thi công huyện"
              value={machinePriceDistrict}
              onChange={(e) => setMachinePriceDistrict(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <CustomButton variant="light" onPress={onClose}>
              Huỷ
            </CustomButton>

            <CustomButton
              className="text-white bg-green-500 hover:bg-green-600"
              startContent={
                !submitLoading && <CheckApprovalIcon className="w-4 h-4" />
              }
              onPress={handleSubmit}
              isDisabled={!name.trim()}
              isLoading={submitLoading}
            >
              {submitLoading ? "Đang lưu..." : "Lưu"}
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
