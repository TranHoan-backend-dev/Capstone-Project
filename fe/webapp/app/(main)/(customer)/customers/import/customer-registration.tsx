"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { DocumentPlusIcon } from "@heroicons/react/24/solid";

import { CustomerInfo } from "./components/customer-info";
import { AddressInfo } from "./components/address-info";
import { TechnicalInfo } from "./components/technical-info";
import { BillingInfo } from "./components/billing-info";

import CustomButton from "@/components/ui/custom/CustomButton";
import { RefreshIcon, SaveIcon } from "@/components/ui/Icons";

const CustomerRegistration = () => {
  return (
    <Card
      className="border-none rounded-xl bg-content1 overflow-hidden transition-all duration-300"
      shadow="sm"
    >
      <CardBody className="p-0">
        <div className="p-6 flex items-center justify-between transition-colors">
          <div className="flex items-center gap-3">
            <div className="text-primary">
              <DocumentPlusIcon className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              Nhập khách hàng mới
            </h2>
          </div>
        </div>
        <div className="px-6 pb-6 transition-all duration-300 ease-in-out overflow-hidden space-y-6">
          <CustomerInfo />
          <AddressInfo />
          <TechnicalInfo />
          <BillingInfo />

          <div className="flex justify-end gap-3">
            <CustomButton
              className="w-fit bg-[#22c55e] hover:bg-green-700 text-white px-6 font-bold"
              startContent={<SaveIcon size={18} />}
            >
              Lưu
            </CustomButton>

            <CustomButton
              className="w-fit bg-[#64748b] hover:bg-slate-600 text-white px-6 font-bold"
              startContent={<RefreshIcon size={18} />}
            >
              Làm mới
            </CustomButton>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default CustomerRegistration;
