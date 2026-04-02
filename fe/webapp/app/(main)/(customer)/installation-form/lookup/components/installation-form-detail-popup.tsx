import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
} from "@heroui/react";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { formatDate1 } from "@/utils/format";

interface InstallationFormDetailPopupProps {
  isOpen: boolean;
  onClose: () => void;
  formCode: string;
  formNumber: string;
}

export const InstallationFormDetailPopup = ({
  isOpen,
  onClose,
  formCode,
  formNumber,
}: InstallationFormDetailPopupProps) => {
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && formCode && formNumber) {
      fetchDetail();
    }
  }, [isOpen, formCode, formNumber]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await authFetch(
        `/api/construction/installation-forms/detail/${formCode}/${formNumber}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch detail");
      }

      const json = await res.json();
      setDetailData(json.data);
    } catch (error) {
      console.error("Error fetching detail:", error);
      CallToast({
        title: "Lỗi",
        message: "Không thể tải thông tin chi tiết",
        color: "danger",
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const renderField = (label: string, value: any) => {
    if (!value) return null;
    return (
      <div className="grid grid-cols-3 gap-2 py-2 border-b border-gray-100">
        <div className="font-semibold text-gray-600">{label}:</div>
        <div className="col-span-2 text-gray-800">{value}</div>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" scrollBehavior="inside">
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Chi tiết đơn lắp đặt
              <span className="text-sm font-normal text-gray-500">
                Mã đơn: {formNumber}
              </span>
            </ModalHeader>
            <ModalBody>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : detailData ? (
                <div className="space-y-4">
                  {/* Thông tin đơn hàng */}
                  <div>
                    <h3 className="text-lg font-bold text-primary-600 mb-3">
                      Thông tin đơn hàng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {renderField("Mã biểu mẫu", detailData.formCode)}
                      {renderField("Số hồ sơ", detailData.formNumber)}
                      {renderField(
                        "Ngày đăng ký",
                        formatDate1(detailData.registrationAt),
                      )}
                      {renderField(
                        "Ngày nhận đơn",
                        formatDate1(detailData.receivedFormAt),
                      )}
                      {renderField(
                        "Ngày hẹn khảo sát",
                        formatDate1(detailData.scheduleSurveyAt),
                      )}
                    </div>
                  </div>

                  {/* Thông tin khách hàng */}
                  <div>
                    <h3 className="text-lg font-bold text-primary-600 mb-3">
                      Thông tin khách hàng
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {renderField("Tên khách hàng", detailData.customerName)}
                      {renderField("Số điện thoại", detailData.phoneNumber)}
                      {renderField("Địa chỉ", detailData.address)}
                      {renderField("Mã số thuế", detailData.taxCode)}
                      {renderField(
                        "Số CCCD",
                        detailData.citizenIdentificationNumber,
                      )}
                      {renderField(
                        "Ngày cấp CCCD",
                        formatDate1(
                          detailData.citizenIdentificationProvideDate,
                        ),
                      )}
                      {renderField(
                        "Nơi cấp CCCD",
                        detailData.citizenIdentificationProvideLocation,
                      )}
                    </div>
                  </div>

                  {/* Thông tin ngân hàng */}
                  {(detailData.bankAccountNumber ||
                    detailData.bankAccountProviderLocation) && (
                    <div>
                      <h3 className="text-lg font-bold text-primary-600 mb-3">
                        Thông tin ngân hàng
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        {renderField(
                          "Số tài khoản",
                          detailData.bankAccountNumber,
                        )}
                        {renderField(
                          "Ngân hàng",
                          detailData.bankAccountProviderLocation,
                        )}
                      </div>
                    </div>
                  )}

                  {/* Thông tin kỹ thuật */}
                  <div>
                    <h3 className="text-lg font-bold text-primary-600 mb-3">
                      Thông tin kỹ thuật
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {renderField(
                        "Mục đích sử dụng",
                        detailData.usageTarget === "DOMESTIC"
                          ? "Sinh hoạt"
                          : "Sản xuất kinh doanh",
                      )}
                      {renderField(
                        "Loại khách hàng",
                        detailData.customerType === "FAMILY"
                          ? "Hộ gia đình"
                          : "Tổ chức",
                      )}
                      {renderField(
                        "Số hộ sử dụng",
                        detailData.numberOfHousehold,
                      )}
                      {renderField(
                        "Số nhân khẩu",
                        detailData.householdRegistrationNumber,
                      )}
                      {renderField(
                        "Chi nhánh cấp nước",
                        detailData.networkName || detailData.networkId,
                      )}
                      {renderField(
                        "Đồng hồ tổng",
                        detailData.overallWaterMeterName ||
                          detailData.overallWaterMeterId,
                      )}
                    </div>
                  </div>

                  {/* Trạng thái */}
                  <div>
                    <h3 className="text-lg font-bold text-primary-600 mb-3">
                      Trạng thái xử lý
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      {renderField("Đăng ký", detailData.status?.registration)}
                      {renderField("Dự toán", detailData.status?.estimate)}
                      {renderField("Hợp đồng", detailData.status?.contract)}
                      {renderField("Thi công", detailData.status?.construction)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
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
