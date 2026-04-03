"use client";

import React, { useState, useEffect } from "react";
import { CallToast } from "@/components/ui/CallToast";
import CustomButton from "@/components/ui/custom/CustomButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { CheckApprovalIcon } from "@/config/chip-and-icon";
import { Card, CardBody, Spinner } from "@heroui/react";
import { MaterialPriceFormProps } from "@/types";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import { authFetch } from "@/utils/authFetch";

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

  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedGroupName, setSelectedGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [showUnitModal, setShowUnitModal] = useState(false);
  const [unitName, setUnitName] = useState("");
  const [unitId, setUnitId] = useState("");
  const [initLoading, setInitLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setSymbol(initialData.laborCode || "");
      setName(initialData.jobContent || "");

      setPrice(initialData.price?.toString() || "");
      setLaborPrice(initialData.laborPrice?.toString() || "");
      setLaborPriceDistrict(
        initialData.laborPriceAtRuralCommune?.toString() || "",
      );

      setMachinePrice(initialData.constructionMachineryPrice?.toString() || "");
      setMachinePriceDistrict(
        initialData.constructionMachineryPriceAtRuralCommune?.toString() || "",
      );

      setSelectedGroupName(initialData.groupName || "");
      setUnitName(initialData.unitName || "");
    }
  }, [initialData]);

  useEffect(() => {
    const load = async () => {
      if (!initialData) return;

      setInitLoading(true);
      try {
        if (initialData?.groupName) {
          authFetch(`/api/device/materials-group?filter=${initialData.groupName}`)
            .then((res) => res.json())
            .then((data) => {
              setSelectedGroupId(data?.data?.content?.[0]?.groupId || "");
            });
        }

        if (initialData?.unitName) {
          authFetch(`/api/device/units?filter=${initialData.unitName}`)
            .then((res) => res.json())
            .then((data) => {
              setUnitId(data?.data?.content?.[0]?.id || "");
            });
        }
      } finally {
        setInitLoading(false);
      }
    };
    load();
  }, [initialData]);

  const handleSubmit = async () => {
    if (submitLoading) return;

    try {
      setSubmitLoading(true);
      const url = isEdit
        ? `/api/device/materials-prices/${initialData?.id}`
        : `/api/device/materials-prices`;

      const method = isEdit ? "PUT" : "POST";

      const payload = {
        laborCode: symbol,
        jobContent: name,
        price: Number(price),
        laborPrice: Number(laborPrice),
        laborPriceAtRuralCommune: Number(laborPriceDistrict),
        constructionMachineryPrice: Number(machinePrice),
        constructionMachineryPriceAtRuralCommune: Number(machinePriceDistrict),
        groupId: selectedGroupId,
        unitId: unitId,
      };

      const response = await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Save failed");
      }
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
  if (initLoading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }
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
            <SearchInputWithButton
              label="Nhóm vật tư"
              value={selectedGroupName}
              onSearch={() => setShowGroupModal(true)}
              onChange={(e) => {
                setSelectedGroupName(e.target.value);
                if (!e.target.value) setSelectedGroupId("");
              }}
            />
            <LookupModal
              isOpen={showGroupModal}
              onClose={() => setShowGroupModal(false)}
              title="Chọn nhóm vật tư"
              api="/api/device/materials-group"
              columns={[
                { key: "stt", label: "STT" },
                { key: "name", label: "Tên nhóm" },
              ]}
              mapData={(item, index, page) => ({
                id: item.groupId,
                stt: index + 1,
                name: item.name,
              })}
              onSelect={(item) => {
                setSelectedGroupId(item.id);
                setSelectedGroupName(item.name);
              }}
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

            <SearchInputWithButton
              label="Đơn vị tính"
              value={unitName}
              onSearch={() => setShowUnitModal(true)}
            />
            <LookupModal
              isOpen={showUnitModal}
              onClose={() => setShowUnitModal(false)}
              title="Chọn đơn vị"
              api="/api/device/units"
              columns={[
                { key: "stt", label: "STT" },
                { key: "name", label: "Tên đơn vị" },
              ]}
              mapData={(item, index, page) => ({
                stt: index + 1,
                id: item.id,
                name: item.name,
              })}
              onSelect={(item) => {
                setUnitId(item.id);
                setUnitName(item.name);
              }}
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
