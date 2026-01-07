"use client";

import React from "react";
import { Button, Textarea } from "@heroui/react";
import {
  ClipboardDocumentCheckIcon,
  PlusIcon,
  DocumentMagnifyingGlassIcon,
  PhotoIcon,
  ArrowPathIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import CustomInput from "@/components/ui/custom/CustomInput";
import { DeleteIcon } from "@/config/chip-and-icon";
import CustomSelect from "@/components/ui/custom/CustomSelect";

export const TechnicalInfoCard = () => {
  const customerInfoFields = [
    { label: "Tên khách hàng", isRequired: true },
    { label: "Công tác" },
    { label: "Số nhà" },
    {
      label: "Đường phố",
      endContent: (
        <DocumentMagnifyingGlassIcon className="w-5 h-5 text-gray-400 dark:text-default-400" />
      ),
    },
    {
      label: "Phường / Xã",
      type: "select",
      options: [
        { key: "p1", label: "Phường 1" },
        { key: "p2", label: "Phường 2" },
      ],
    },
    { label: "Địa chỉ đầy đủ" },
    { label: "Ghi chú", type: "textarea", minRows: 3 },
  ];

  const technicalSpecsFields = [
    { label: "Lệ phí HĐ" },
    { label: "Công KS" },
    { label: "Giá KS" },
    { label: "Phí đấu nối" },
    { label: "Hệ số nhân công" },
    { label: "Hệ số chi phí chung" },
    { label: "Hệ số thuế tính trước" },
    { label: "Hệ số máy thi công" },
    { label: "Hệ số VAT" },
    { label: "Hệ số thiết kế" },
    { label: "Phí thiết kế", className: "md:col-span-2" },
  ];

  const [representatives, setRepresentatives] = React.useState([
    { id: 1, name: "", position: "giam-doc" },
  ]);

  const addRepresentative = () => {
    setRepresentatives([
      ...representatives,
      { id: Date.now(), name: "", position: "giam-doc" },
    ]);
  };

  const removeRepresentative = (id: number) => {
    if (representatives.length > 1) {
      setRepresentatives(representatives.filter((rep) => rep.id !== id));
    }
  };

  const meterFields = [
    {
      label: "Loại đồng hồ",
      type: "select",
      isRequired: true,
      defaultSelectedKeys: ["sensus"],
      options: [
        { key: "sensus", label: "Sensus" },
        { key: "itron", label: "Itron" },
      ],
    },
    { label: "Mã đồng hồ" },
  ];

  const positionOptions = [
    { key: "giam-doc", label: "Giám đốc" },
    { key: "truong-phong", label: "Trưởng phòng" },
  ];

  const renderField = (field: any) => {
    if (field.type === "select") {
      return (
        <CustomSelect
          key={field.label}
          className={field.className}
          defaultSelectedKeys={field.defaultSelectedKeys}
          isRequired={field.isRequired}
          label={field.label}
          options={(field.options || []).map((opt: any) => ({
            label: opt.label,
            value: opt.key,
          }))}
        />
      );
    }
    if (field.type === "textarea") {
      return (
        <Textarea
          key={field.label}
          label={field.label}
          labelPlacement="inside"
          minRows={field.minRows}
          radius="md"
          variant="bordered"
        />
      );
    }

    return (
      <CustomInput
        key={field.label}
        className={field.className}
        endContent={field.endContent}
        isRequired={field.isRequired}
        label={field.label}
      />
    );
  };

  return (
    <GenericSearchFilter
      actions={
        <div className="flex flex-wrap gap-3 pt-6 border-t border-divider">
          <Button
            className="font-bold px-6 shadow-md shadow-primary/20"
            color="primary"
            startContent={<ClipboardDocumentCheckIcon className="w-4 h-4" />}
          >
            Lưu
          </Button>
          <Button
            className="bg-background dark:bg-default-100 font-bold px-6"
            startContent={<DocumentMagnifyingGlassIcon className="w-4 h-4" />}
            variant="bordered"
          >
            Xem hồ sơ
          </Button>
          <Button
            className="text-white font-bold px-6 shadow-md shadow-success/20"
            color="success"
            startContent={<PhotoIcon className="w-4 h-4" />}
          >
            Ảnh cụm đồng hồ
          </Button>
        </div>
      }
      gridClassName="grid grid-cols-1 lg:grid-cols-2 gap-12"
      icon={<ClipboardDocumentCheckIcon className="w-6 h-6" />}
      title="Lập hồ sơ kỹ thuật & chi phí vật tư"
    >
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-base font-bold text-foreground mb-4">
          Thông tin khách hàng & công trình
        </h3>
        {customerInfoFields.map(renderField)}
      </div>

      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-base font-bold text-foreground mb-4">
          Thông số kỹ thuật lắp đặt
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalSpecsFields.map(renderField)}
        </div>
      </div>

      {/* Meter Section - Wide */}
      <div className="lg:col-span-2 pt-8 border-t border-divider space-y-4">
        <h3 className="text-base font-bold text-foreground">
          Đông hồ & đơn vị liên quan
        </h3>

        {/* Meter Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {meterFields.map(renderField)}
        </div>

        {/* Representatives Rows */}
        <div className="space-y-4">
          {representatives.map((rep, index) => (
            <div
              key={rep.id}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end"
            >
              <CustomInput className="lg:col-span-1" label="Người đại diện" />
              <div className="flex gap-2 items-end lg:col-span-1">
                <CustomSelect
                  className="flex-1"
                  defaultSelectedKeys={[rep.position]}
                  label="Chức vụ"
                  options={positionOptions.map((opt) => ({
                    label: opt.label,
                    value: opt.key,
                  }))}
                />
                <div className="flex gap-1 mb-3">
                  {representatives.length > 1 && (
                    <Button
                      isIconOnly
                      className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white h-8 w-8 min-w-8 shrink-0 transition-colors"
                      color="danger"
                      radius="full"
                      size="sm"
                      onPress={() => removeRepresentative(rep.id)}
                    >
                      <DeleteIcon className="w-4 h-4" />
                    </Button>
                  )}
                  {index === representatives.length - 1 && (
                    <Button
                      isIconOnly
                      className="h-8 w-8 min-w-8 shrink-0 shadow-md shadow-primary/20"
                      color="primary"
                      radius="full"
                      size="sm"
                      onPress={addRepresentative}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Material Template Selection Section - Wide */}
      <div className="lg:col-span-2 pt-8 border-t border-divider">
        <div className="flex flex-wrap items-end gap-4">
          <div className="w-full md:w-80">
            <CustomSelect
              label="Mẫu bốc vật tư"
              options={[
                {
                  label: "Mẫu 1",
                  value: "m1",
                },
                {
                  label: "Mẫu 2",
                  value: "m2",
                },
              ]}
            />
          </div>
          <Button
            className="text-default-700 font-medium h-14 rounded-xl"
            color="default"
            startContent={<ArrowPathIcon className="w-4 h-4" />}
            variant="flat"
          >
            Reset về mẫu bốc vật tư mặc định
          </Button>
        </div>
        <p className="text-red-500 text-xs mt-2 italic flex items-center gap-1">
          <InformationCircleIcon className="w-4 h-4" />
          Chú ý: Thay đổi mẫu bốc vật tư sẽ xóa hết danh sách vật tư hiện tại
        </p>
      </div>
    </GenericSearchFilter>
  );
};
