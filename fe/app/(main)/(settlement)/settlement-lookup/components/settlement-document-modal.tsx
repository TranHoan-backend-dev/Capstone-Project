"use client";

import { DocumentTable } from "@/components/popup-settlement/documant-table";
import { DocumentHeader } from "@/components/popup-settlement/document-header";
import { DocumentPaper } from "@/components/popup-settlement/document-paper";
import { ModalHeader } from "@/components/popup-settlement/modal-header";
import { Modal, ModalContent, ModalBody } from "@heroui/react";

interface SettlementDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
}

export const SettlementDocumentModal = ({
  isOpen,
  onClose,
  data,
}: SettlementDocumentModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      scrollBehavior="inside"
      hideCloseButton={false}
    >
      <ModalContent>
        <ModalBody className="p-0 bg-white rounded-lg">
          <div className="min-h-screen p-4">
            <div className="max-w-[1200px] mx-auto">
              <ModalHeader />

              <DocumentPaper>
                <DocumentHeader />

                <h1 className="text-center font-bold uppercase mb-4">
                  DỰ TOÁN XÂY DỰNG CÔNG TRÌNH
                </h1>

                <DocumentTable data={data} />
              </DocumentPaper>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
