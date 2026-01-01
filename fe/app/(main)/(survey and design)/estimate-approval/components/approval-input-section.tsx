"use client";

import React from "react";
import { Card, CardBody, DatePicker, Textarea } from "@heroui/react";
import { DateValue } from "@heroui/react";

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
        <Card shadow="sm" className="w-full bg-content1">
            <CardBody className="p-6">
                <div className="flex flex-col gap-4">
                    <div className="w-full sm:w-1/3 lg:w-1/4">
                        <DatePicker
                            label="Ngày duyệt đơn"
                            variant="bordered"
                            radius="md"
                            size="md"
                            value={approvalDate}
                            onChange={setApprovalDate}
                            className="font-bold"
                            labelPlacement="inside"
                        />
                    </div>
                    <div className="w-full">
                        <Textarea
                            isClearable
                            color="success"
                            label="Nội dung / Ghi chú duyệt"
                            placeholder="Nhập lý do duyệt hoặc từ chối (nếu có)"
                            variant="bordered"
                            radius="md"
                            minRows={3}
                            value={approvalNote}
                            onValueChange={setApprovalNote}
                            labelPlacement="inside"
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
