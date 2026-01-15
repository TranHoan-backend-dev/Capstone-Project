"use client";

import { ModalActions } from "./modal-actions";

export const ModalHeader = () => {
  return (
    <div className="mt-4 mb-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold text-gray-900">Bảng quyết toán</h1>
      <ModalActions />
    </div>
  );
};
