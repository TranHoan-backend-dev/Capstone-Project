"use client";

import React, { useEffect, useMemo, useState } from "react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { AccessRightsItem } from "@/types";
import { UserPermissionPanel } from "./user-permission-panel";
import { Button, Tooltip } from "@heroui/react";
import { DeleteIcon, EditIcon } from "@/config/chip-and-icon";
import { ACCESS_RIGHTS_COLUMNS } from "@/config/table-columns";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from "@heroui/react";
import { authFetch } from "@/utils/authFetch";
import CustomButton from "@/components/ui/custom/CustomButton";

interface Props {
  username: string;
}

export const AccessRightsTable = ({ username }: Props) => {
  const [data, setData] = useState<AccessRightsItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [formData, setFormData] = useState({
    page: "",
    size: "",
    isEnabled: "",
    username: "",
  });
  const [selectedUser, setSelectedUser] = useState<{
    id: string;
    username: string;
    fullName?: string;
    email?: string;
    departmentName?: string;
    networkName?: string;
    jobs?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const params = new URLSearchParams({
          page: String(page - 1),
          size: String(pageSize),
        });

        if (formData.isEnabled !== "") {
          params.append("isEnabled", formData.isEnabled);
        }

        if (username) {
          params.append("username", username);
        }

        const res = await authFetch(`/api/auth/employees?${params.toString()}`);

        if (!res.ok) {
          console.error("Fetch failed", res.status);
          return;
        }

        const json = await res.json();
        const pageData = json?.data;
        const items = pageData?.content ?? [];
        const totalElements =
          pageData?.totalElements ?? pageData?.page?.totalElements ?? 0;
        const pages =
          pageData?.totalPages ?? pageData?.page?.totalPages ?? 1;

        setTotalItems(totalElements);
        setTotalPages(Math.max(1, pages));

        const mapped = items.map((item: any, index: number) => ({
          id: item.id,
          stt: (page - 1) * pageSize + index + 1,
          username: item.username || "Chưa có tên đăng nhập",
          fullname: item.fullName || item.fullname || "Chưa có tên",
          email: item.email,
          departmentName: item.departmentName,
          networkName: item.networkName,
          jobs: item.jobs,
        }));
        setData(mapped);

        if (username && mapped.length === 1) {
          setSelectedUser({
            id: mapped[0].id,
            username: mapped[0].username,
            fullName: mapped[0].fullname,
            email: mapped[0].email,
            departmentName: mapped[0].departmentName,
            networkName: mapped[0].networkName,
            jobs: mapped[0].jobs,
          });
        }

        if (!username || mapped.length !== 1) {
          setSelectedUser(null);
        }
      } catch (e) {
        console.error("Error fetching data:", e);
        setData([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, formData, username]);

  const handleSelectUser = (item: AccessRightsItem) => {
    setSelectedUser({
      id: item.id,
      username: item.username,
      fullName: item.fullname,
      email: (item as any).email,
      departmentName: (item as any).departmentName,
      networkName: (item as any).networkName,
      jobs: (item as any).jobs,
    });
    setIsModalOpen(true);
  };

  const actionItems = useMemo(
    () => [
      {
        content: "Chỉnh sửa",
        icon: EditIcon,
        className:
          "text-amber-500 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30",
        onClick: (id: string) => {
          const found = data.find((i) => i.id === id);

          if (found) {
            setSelectedUser({
              id: found.id,
              username: found.username,
              fullName: found.fullname,
              email: (found as any).email,
              departmentName: (found as any).departmentName,
              networkName: (found as any).networkName,
              jobs: (found as any).jobs,
            });
            setIsModalOpen(true);
          }
        },
      },
    ],
    [data],
  );

  const renderCell = (item: AccessRightsItem, columnKey: string) => {
    switch (columnKey) {
      case "stt":
        return <span>{item.stt}</span>;

      // case "username":
      //   return (
      //     <button
      //       onClick={() => handleSelectUser(item)}
      //       className="font-semibold text-blue-600 hover:underline"
      //     >
      //       {item.username || "Chưa có tên đăng nhập"}
      //     </button>
      //   );

      case "fullname":
        return (
          <button
            onClick={() => handleSelectUser(item)}
            className="text-gray-700 hover:text-blue-600 hover:underline"
          >
            {item.fullname || "Chưa có tên"}
          </button>
        );

      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {actionItems.map((action, idx) => (
              <Tooltip key={idx} content={action.content} closeDelay={0}>
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className={`${action.className} rounded-lg`}
                  onPress={() => action.onClick(item.id)}
                >
                  <action.icon className="w-5 h-5" />
                </Button>
              </Tooltip>
            ))}
          </div>
        );
      default:
        return (item as any)[columnKey];
    }
  };

  return (
    <>
      <GenericDataTable
        isLoading={loading}
        title="Quản lý quyền truy cập"
        columns={ACCESS_RIGHTS_COLUMNS}
        data={data}
        isCollapsible
        renderCellAction={renderCell}
        headerSummary={`${totalItems}`}
        paginationProps={{
          total: totalPages,
          page: page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="5xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                Quyền truy cập -{" "}
                {selectedUser?.fullName || selectedUser?.username}
              </ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <UserPermissionPanel
                    empId={selectedUser.id}
                    username={selectedUser.username}
                    userInfo={{
                      fullName: selectedUser.fullName,
                      email: selectedUser.email,
                      departmentName: selectedUser.departmentName,
                      networkName: selectedUser.networkName,
                      jobs: selectedUser.jobs,
                    }}
                  />
                )}
              </ModalBody>
              <ModalFooter>
                <CustomButton
                  className="border border-gray-300 text-gray-700 hover:bg-gray-100"
                  variant="light"
                  onPress={onClose}
                >
                  Huỷ
                </CustomButton>

                <CustomButton
                  className="bg-green-500 hover:bg-green-600 text-white"
                  color="success"
                  onPress={onClose}
                  startContent={<EditIcon className="w-5 h-5" />}
                >
                  Lưu
                </CustomButton>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
