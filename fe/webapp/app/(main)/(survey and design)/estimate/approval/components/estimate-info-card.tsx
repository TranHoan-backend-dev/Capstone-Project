"use client";

import React from "react";

interface EstimateInfoCardProps {
  customerName?: string;
  totalAmount?: string;
  installationAddress?: string;
  showAddress?: boolean;
}

const EstimateInfoCard = ({
  customerName,
  totalAmount,
  installationAddress,
  showAddress = true,
}: EstimateInfoCardProps) => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Khách hàng</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {customerName}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Tổng tiền</p>
          <p className="font-semibold text-primary">{totalAmount}</p>
        </div>
        {showAddress && (
          <div className="col-span-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">Địa chỉ</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">
              {installationAddress}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateInfoCard;
