"use client";

import React from "react";
import { Card, CardBody } from "@heroui/react";
import { DateValue } from "@heroui/react";

import CustomDatePicker from "@/components/ui/custom/CustomDatePicker";
import CustomTextarea from "@/components/ui/custom/CustomTextarea";

interface ApprovalInputSectionProps {
  approvalDate: DateValue | null | undefined;
  approvalNote: string;
  setApprovalDateAction: (date: DateValue | null | undefined) => void;
  setApprovalNoteAction: (note: string) => void;
}

export const ApprovalInputSection = ({
  approvalDate,
  approvalNote,
  setApprovalDateAction,
  setApprovalNoteAction,
}: ApprovalInputSectionProps) => {
  return (
    <Card className="w-full bg-content1" shadow="sm">
      <CardBody className="p-6">
        <div className="flex flex-col gap-4">
          <div className="w-full sm:w-1/3 lg:w-1/4">
            <CustomDatePicker
              className="font-bold"
              label="Ngày duyệt đơn"
              value={approvalDate}
              onChange={setApprovalDateAction}
            />
          </div>
          <div className="w-full">
            <CustomTextarea
              isClearable
              color="success"
              label="Nội dung / Ghi chú duyệt"
              rows={3}
              placeholder="Nhập lý do duyệt hoặc từ chối"
              value={approvalNote}
              onValueChange={setApprovalNoteAction}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
