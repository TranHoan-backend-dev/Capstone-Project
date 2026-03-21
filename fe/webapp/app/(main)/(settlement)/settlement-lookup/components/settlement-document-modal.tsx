"use client";

import { Modal, ModalContent, ModalBody, Button, Spinner } from "@heroui/react";

import { DocumentTable } from "@/components/popup-settlement/document-table";
import { DocumentHeader } from "@/components/popup-settlement/document-header";
import { DocumentPaper } from "@/components/popup-settlement/document-paper";
import { ModalHeader } from "@/components/popup-settlement/modal-header";
import { authFetch } from "@/utils/authFetch";
import { CallToast } from "@/components/ui/CallToast";
import {
  SETLEMENT_DOCUMENT_COLUMN,
  SETLEMENT_LOOKUP_COLUMN,
} from "@/config/table-columns";

interface SettlementDocumentModalProps {
  isOpen: boolean;
  onCloseAction: () => void;
  data: any[];
  settlementId?: string;
  loading?: boolean;
  selectedFormNumber: string;
}

export const SettlementDocumentModal = ({
  isOpen,
  onCloseAction,
  data,
  settlementId,
  loading,
  selectedFormNumber,
}: SettlementDocumentModalProps) => {
  const handleSign = async () => {
    if (!settlementId) return;

    try {
      const res = await authFetch(`/api/construction/settlements/sign/${settlementId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          president: "Nguyen Van A",
          ptHead: "Tran Van B",
          surveyStaff: "Dung",
          constructionPresident: "Pham Van C",
        }),
      });

      if (!res.ok) throw new Error("Ký thất bại");

      CallToast({
        title: "Thành công",
        message: "Đã ký duyệt",
        color: "success",
      });

      onCloseAction?.();
    } catch (e: any) {
      CallToast({
        title: "Lỗi",
        message: e.message,
        color: "danger",
      });
    }
  };
  {
    loading ? (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    ) : (
      <DocumentTable data={data} columns={SETLEMENT_LOOKUP_COLUMN} />
    );
  }
  return (
    <Modal
      hideCloseButton={false}
      isOpen={isOpen}
      scrollBehavior="inside"
      size="5xl"
      onClose={onCloseAction}
    >
      <ModalContent>
        <ModalBody className="p-0 bg-white rounded-lg">
          <div className="min-h-screen p-4">
            <div className="max-w-[1600px] mx-auto">
              <ModalHeader />

              <DocumentPaper
                signRoles={[
                  { title: "Giám Đốc", name: "" },
                  { title: "Trưởng phòng KHKT", name: "" },
                  { title: "Nhân viên khảo sát", name: "" },
                  { title: "Nhân viên xây dựng", name: "" },
                ]}
              >
                <DocumentHeader
                  code={selectedFormNumber || "Chưa có mã"}
                  date={new Date()}
                />

                <h1 className="text-center font-bold uppercase mb-4">
                  DỰ TOÁN XÂY DỰNG CÔNG TRÌNH
                </h1>

                <DocumentTable
                  data={data}
                  columns={SETLEMENT_DOCUMENT_COLUMN}
                />
                <div className="mt-10 flex justify-end">
                  <Button color="success" onPress={handleSign}>
                    Ký duyệt
                  </Button>
                </div>
              </DocumentPaper>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
