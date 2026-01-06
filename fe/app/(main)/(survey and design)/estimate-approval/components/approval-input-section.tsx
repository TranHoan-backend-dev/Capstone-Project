"use client";

import React from "react";
import { Card, CardBody, Textarea } from "@heroui/react";
import { DateValue } from "@heroui/react";

import CustomSingleDatePicker from "@/components/ui/custom/CustomSingleDatePicker";

interface ApprovalInputSectionProps {
  approvalDate: DateValue | null | undefined;
  approvalNote: string;
  setApprovalDate: (date: DateValue | null | undefined) => void;
  setApprovalNote: (note: string) => void;
}

export const ApprovalInputSection = ({
  approvalDate,
  approvalNote,
  setApprovalDate,
  setApprovalNote,
}: ApprovalInputSectionProps) => {
  return (
    <Card className="w-full bg-content1" shadow="sm">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          <div className="w-full sm:w-1/3 lg:w-1/4">
            <CustomSingleDatePicker
              className="font-bold"
              label="Ngày duyệt đơn"
              value={approvalDate}
              onChange={setApprovalDate}
            />
          </div>
          <div className="w-full">
            <Textarea
              isClearable
              color="success"
              label="Nội dung / Ghi chú duyệt"
              labelPlacement="inside"
              minRows={3}
              placeholder="Nhập lý do duyệt hoặc từ chối (nếu có)"
              radius="md"
              value={approvalNote}
              variant="bordered"
              onValueChange={setApprovalNote}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
