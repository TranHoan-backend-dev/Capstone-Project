"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Card,
  CardBody,
  Button,
  Chip,
} from "@heroui/react";
import { PaperClipIcon } from "@heroicons/react/24/outline";
import { formatDate1 } from "@/utils/format";

interface ReceiptDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  detailData: any;
  isLoading: boolean;
  formCode?: string;
  formNumber?: string;
}

export const ReceiptDetailModal = ({
  isOpen,
  onClose,
  detailData,
  isLoading,
  formCode,
  formNumber,
}: ReceiptDetailModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chi tiết phiếu thu
              {formCode && formNumber && (
                <p className="text-sm font-normal text-default-500">
                  Mã phiếu: {formNumber}
                </p>
              )}
            </ModalHeader>
            <ModalBody>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : detailData ? (
                <div className="space-y-4">
                  {/* Thông tin chung */}
                  <Card>
                    <CardBody>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-default-500">
                            Số phiếu thu
                          </p>
                          <p className="font-semibold">
                            {detailData.receiptNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">
                            Ngày thanh toán
                          </p>
                          <p className="font-semibold">
                            {formatDate1(detailData.paymentDate)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Trạng thái</p>
                          <Chip
                            size="sm"
                            variant="flat"
                            color={detailData.isPaid ? "success" : "warning"}
                          >
                            {detailData.isPaid
                              ? "Đã thanh toán"
                              : "Chưa thanh toán"}
                          </Chip>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Ngày tạo</p>
                          <p className="font-semibold">
                            {formatDate1(detailData.createdAt)}
                          </p>
                        </div>
                        {detailData.updatedAt && (
                          <div>
                            <p className="text-sm text-default-500">
                              Ngày cập nhật
                            </p>
                            <p className="font-semibold">
                              {formatDate1(detailData.updatedAt)}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardBody>
                  </Card>

                  {/* Thông tin khách hàng */}
                  <Card>
                    <CardBody>
                      <h3 className="font-semibold mb-3">
                        Thông tin khách hàng
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-default-500">
                            Tên khách hàng
                          </p>
                          <p className="font-semibold">
                            {detailData.customerName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">Địa chỉ</p>
                          <p className="font-semibold">{detailData.address}</p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Thông tin thanh toán */}
                  <Card>
                    <CardBody>
                      <h3 className="font-semibold mb-3">
                        Thông tin thanh toán
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-default-500">
                            Lý do thanh toán
                          </p>
                          <p className="whitespace-pre-wrap">
                            {detailData.paymentReason}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">
                            Số tiền bằng số
                          </p>
                          <p className="text-xl font-bold text-green-600">
                            {detailData.totalMoneyInDigits?.toLocaleString(
                              "vi-VN",
                            )}{" "}
                            VNĐ
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-default-500">
                            Số tiền bằng chữ
                          </p>
                          <p className="italic">
                            {detailData.totalMoneyInCharacters}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>

                  {/* Tệp đính kèm */}
                  {/* {detailData.attach && (
                    <Card>
                      <CardBody>
                        <h3 className="font-semibold mb-3">Tệp đính kèm</h3>
                        <Button
                          as="a"
                          href={detailData.attach}
                          target="_blank"
                          color="primary"
                          variant="flat"
                          startContent={<PaperClipIcon className="w-4 h-4" />}
                        >
                          Xem tệp đính kèm
                        </Button>
                      </CardBody>
                    </Card>
                  )} */}

                  {/* Chữ ký */}
                  {/* {detailData.significance && (
                    <Card>
                      <CardBody>
                        <h3 className="font-semibold mb-3">Chữ ký</h3>
                        <div className="border rounded-lg p-4 bg-default-50">
                          <img
                            src={detailData.significance}
                            alt="Chữ ký"
                            className="max-h-24 object-contain"
                          />
                        </div>
                      </CardBody>
                    </Card>
                  )} */}
                </div>
              ) : (
                <div className="text-center py-8 text-default-500">
                  Không có dữ liệu
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onCloseModal}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
