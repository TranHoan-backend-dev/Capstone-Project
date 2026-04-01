"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardBody, Spinner } from "@heroui/react";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import { formatDate1 } from "@/utils/format";

interface InstallationFormDetail {
  formCode: string;
  formNumber: string;
  customerName: string;
  phoneNumber: string;
  address: string;
  taxCode: string;
  citizenIdentificationNumber: string;
  citizenIdentificationProvideDate: string;
  citizenIdentificationProvideLocation: string;
  representative: Array<{ name: string }>;
  usageTarget: string;
  customerType: string;
  receivedFormAt: string;
  scheduleSurveyAt: string;
  numberOfHousehold: string;
  householdRegistrationNumber: string;
  networkId: string;
  overallWaterMeterId: string;
  bankAccountNumber: string;
  bankAccountProviderLocation: string;
  status?: {
    registration: string;
    estimate: string;
    contract: string;
    construction: string;
  };
}

const InstallationFormDetailPage = () => {
  const params = useParams();
  const formCode = params?.formCode as string;

  const [loading, setLoading] = useState(true);
  const [detail, setDetail] = useState<InstallationFormDetail | null>(null);

  useEffect(() => {
    if (!formCode) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await authFetch(
          `/api/construction/installation-forms/${formCode}`,
        );

        if (!res.ok) {
          throw new Error("Không thể tải thông tin đơn");
        }

        const json = await res.json();
        setDetail(json.data);
      } catch (error: any) {
        CallToast({
          title: "Lỗi",
          message: error.message || "Có lỗi xảy ra",
          color: "danger",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [formCode]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "text-green-600 bg-green-50";
      case "REJECTED":
        return "text-red-600 bg-red-50";
      case "PROCESSING":
        return "text-yellow-600 bg-yellow-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "REJECTED":
        return "Từ chối";
      case "PROCESSING":
        return "Đang xử lý";
      default:
        return "Chờ duyệt";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500">Không tìm thấy thông tin đơn</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Chi tiết đơn lắp đặt</h1>

      {/* Thông tin đơn */}
      <Card>
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">Thông tin đơn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Mã biểu mẫu</p>
              <p className="font-medium">{detail.formCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số hồ sơ</p>
              <p className="font-medium">{detail.formNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày nhận đơn</p>
              <p>{formatDate1(detail.receivedFormAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày hẹn khảo sát</p>
              <p>{formatDate1(detail.scheduleSurveyAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số hộ sử dụng</p>
              <p>{detail.numberOfHousehold}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số nhân khẩu</p>
              <p>{detail.householdRegistrationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mục đích sử dụng</p>
              <p>
                {detail.usageTarget === "DOMESTIC" && "Sinh hoạt"}
                {detail.usageTarget === "COMMERCIAL" && "Kinh doanh"}
                {detail.usageTarget === "INDUSTRIAL" && "Sản xuất"}
                {detail.usageTarget === "INSTITUTIONAL" && "Cơ quan"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Thông tin khách hàng */}
      <Card>
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Thông tin khách hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Họ tên khách hàng</p>
              <p className="font-medium">{detail.customerName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Người đại diện</p>
              <p>{detail.representative?.[0]?.name || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Số CCCD/CMND</p>
              <p>{detail.citizenIdentificationNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày cấp CCCD</p>
              <p>{formatDate1(detail.citizenIdentificationProvideDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nơi cấp CCCD</p>
              <p>{detail.citizenIdentificationProvideLocation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mã số thuế</p>
              <p>{detail.taxCode}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loại khách hàng</p>
              <p>
                {detail.customerType === "FAMILY" ? "Hộ gia đình" : "Công ty"}
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Địa chỉ & Liên hệ */}
      <Card>
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Địa chỉ & Liên hệ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500">Địa chỉ lắp đặt</p>
              <p>{detail.address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Điện thoại liên hệ</p>
              <p>{detail.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Chi nhánh cấp nước</p>
              <p>{detail.networkId || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Đồng hồ nước tổng</p>
              <p>{detail.overallWaterMeterId || "—"}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Thông tin ngân hàng */}
      <Card>
        <CardBody className="space-y-4">
          <h2 className="text-lg font-semibold border-b pb-2">
            Thông tin ngân hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Số tài khoản ngân hàng</p>
              <p>{detail.bankAccountNumber || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngân hàng và chi nhánh</p>
              <p>{detail.bankAccountProviderLocation || "—"}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Trạng thái duyệt */}
      {detail.status && (
        <Card>
          <CardBody className="space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Trạng thái duyệt
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Đăng ký</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(detail.status.registration)}`}
                >
                  {getStatusText(detail.status.registration)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Dự toán</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(detail.status.estimate)}`}
                >
                  {getStatusText(detail.status.estimate)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Hợp đồng</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(detail.status.contract)}`}
                >
                  {getStatusText(detail.status.contract)}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Thi công</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm ${getStatusColor(detail.status.construction)}`}
                >
                  {getStatusText(detail.status.construction)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default InstallationFormDetailPage;
