"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
} from "@heroui/react";

import { GenericDataTable } from "@/components/ui/GenericDataTable";
import { GenericSearchFilter } from "@/components/ui/GenericSearchFilter";
import { SearchIcon } from "@/components/ui/Icons";
import { SearchInputWithButton } from "@/components/ui/SearchInputWithButton";
import CustomInput from "@/components/ui/custom/CustomInput";
import CustomSelect from "@/components/ui/custom/CustomSelect";
import { LookupModal } from "@/components/ui/modal/LookupModal";
import FilterButton from "@/components/ui/FilterButton";
import { CallToast } from "@/components/ui/CallToast";
import { useLateral } from "@/hooks/useLaterals";
import { useNetwork } from "@/hooks/useNetworks";
import { useProfile } from "@/hooks/useLogin";
import { authFetch } from "@/utils/authFetch";

type AssignmentRoadmapItem = {
  id: string;
  stt: number;
  name: string;
  lateralName: string;
  networkName: string;
  assignedStaffId?: string | null;
};

type RoadmapApiResponse = {
  roadmapId: string;
  name: string;
  lateralName: string;
  networkName: string;
  assignedStaffId?: string | null;
};

type MeterInspectionLookupItem = {
  id: string;
  stt: number;
  fullName: string;
};

const columns = [
  { key: "stt", label: "STT", width: "50px", align: "center" as const },
  { key: "name", label: "Tên lộ trình ghi", sortable: true },
  { key: "assignedStaffId", label: "Mã NV ghi thu" },
  { key: "lateralName", label: "Nhánh tổng" },
  { key: "networkName", label: "Chi nhánh" },
  { key: "actions", label: "Thao tác", align: "center" as const },
];

const RoadmapAssignmentPage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { networkOptions } = useNetwork();
  const { lateralOptions } = useLateral();

  const [keyword, setKeyword] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState<Set<string>>(
    new Set(),
  );
  const [selectedLateral, setSelectedLateral] = useState<Set<string>>(
    new Set(),
  );
  const [assignedOnly, setAssignedOnly] = useState(false);

  const [data, setData] = useState<AssignmentRoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [sort, setSort] = useState<{
    field: string;
    direction: "asc" | "desc";
  }>({
    field: "createdAt",
    direction: "desc",
  });
  const [reloadKey, setReloadKey] = useState(0);

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [assignmentMode, setAssignmentMode] = useState<"assign" | "update">(
    "assign",
  );
  const [targetRoadmapId, setTargetRoadmapId] = useState<string | null>(null);
  const [staffIdInput, setStaffIdInput] = useState("");
  const [selectedStaffName, setSelectedStaffName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [staffLookupOpen, setStaffLookupOpen] = useState(false);

  const role = profile?.role?.toLowerCase();
  const isBusinessDepartmentHead = role === "business_department_head";

  const fetchRoadmaps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(page - 1),
        size: String(pageSize),
        sort: `${sort.field},${sort.direction}`,
      });

      const trimmedKeyword = keyword.trim();
      const networkId = Array.from(selectedNetwork)[0];
      const lateralId = Array.from(selectedLateral)[0];

      if (trimmedKeyword) params.append("keyword", trimmedKeyword);
      if (networkId) params.append("networkId", networkId);
      if (lateralId) params.append("lateralId", lateralId);

      const res = await authFetch(
        `/api/construction/roadmaps?${params.toString()}`,
      );
      if (!res.ok) throw new Error("Lấy danh sách lộ trình thất bại");

      const json = await res.json();
      const pageData = json?.data;
      const items: RoadmapApiResponse[] = pageData?.content ?? [];

      const mapped: AssignmentRoadmapItem[] = items.map((item, index) => ({
        id: item.roadmapId,
        stt: (page - 1) * pageSize + index + 1,
        name: item.name,
        lateralName: item.lateralName,
        networkName: item.networkName,
        assignedStaffId: item.assignedStaffId ?? null,
      }));

      const filteredData = assignedOnly
        ? mapped.filter((item) => !!item.assignedStaffId)
        : mapped;

      setData(filteredData);
      setTotalItems(
        assignedOnly ? filteredData.length : (pageData?.totalElements ?? 0),
      );
      setTotalPages(pageData?.totalPages ?? 1);
    } catch (error: any) {
      setData([]);
      setTotalItems(0);
      setTotalPages(1);
      CallToast({
        title: "Lỗi",
        message: error?.message || "Không thể tải danh sách lộ trình",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, [page, reloadKey, assignedOnly, sort]);

  const handleSearch = () => {
    setPage(1);
    setReloadKey((prev) => prev + 1);
  };

  const closeAssignmentModal = () => {
    setAssignmentModalOpen(false);
    setTargetRoadmapId(null);
    setStaffIdInput("");
    setSelectedStaffName("");
    setSubmitLoading(false);
  };

  const openAssignmentModal = (
    roadmapId: string,
    mode: "assign" | "update",
    currentStaffId?: string | null,
  ) => {
    setTargetRoadmapId(roadmapId);
    setAssignmentMode(mode);
    setStaffIdInput(currentStaffId ?? "");
    setSelectedStaffName(currentStaffId ?? "");
    setAssignmentModalOpen(true);
  };

  const handleAssignSubmit = async () => {
    if (!targetRoadmapId || !staffIdInput.trim()) return;
    try {
      setSubmitLoading(true);
      const endpoint =
        assignmentMode === "assign"
          ? `/api/construction/roadmaps/${targetRoadmapId}/assign/${staffIdInput.trim()}`
          : `/api/construction/roadmaps/${targetRoadmapId}/update-assignment/${staffIdInput.trim()}`;

      const res = await authFetch(endpoint, { method: "PATCH" });
      const json = await res.json();
      if (!res.ok)
        throw new Error(json?.message || "Cập nhật phân công thất bại");

      CallToast({
        title: "Thành công",
        message:
          assignmentMode === "assign"
            ? "Phân công lộ trình thành công"
            : "Cập nhật phân công lộ trình thành công",
        color: "success",
      });
      closeAssignmentModal();
      setReloadKey((prev) => prev + 1);
    } catch (error: any) {
      setSubmitLoading(false);
      CallToast({
        title: "Lỗi",
        message: error?.message || "Không thể cập nhật phân công",
        color: "danger",
      });
    }
  };

  const handleCancelAssignment = async (roadmapId: string) => {
    try {
      const res = await authFetch(
        `/api/construction/roadmaps/${roadmapId}/cancel-assignment`,
        { method: "PATCH" },
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Hủy phân công thất bại");

      CallToast({
        title: "Thành công",
        message: "Hủy phân công lộ trình thành công",
        color: "success",
      });
      setReloadKey((prev) => prev + 1);
    } catch (error: any) {
      CallToast({
        title: "Lỗi",
        message: error?.message || "Không thể hủy phân công",
        color: "danger",
      });
    }
  };

  const renderCell = (item: AssignmentRoadmapItem, columnKey: string) => {
    switch (columnKey) {
      case "assignedStaffId":
        return item.assignedStaffId || "Chưa phân công";
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            {!item.assignedStaffId ? (
              <Button
                size="sm"
                color="primary"
                variant="flat"
                onPress={() => openAssignmentModal(item.id, "assign")}
              >
                Phân công
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  color="secondary"
                  variant="flat"
                  onPress={() =>
                    openAssignmentModal(item.id, "update", item.assignedStaffId)
                  }
                >
                  Cập nhật
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="flat"
                  onPress={() => handleCancelAssignment(item.id)}
                >
                  Hủy
                </Button>
              </>
            )}
          </div>
        );
      default:
        return item[columnKey as keyof AssignmentRoadmapItem] || "-";
    }
  };

  const headerActions = useMemo(
    () => (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          color={!assignedOnly ? "primary" : "default"}
          variant={!assignedOnly ? "solid" : "flat"}
          onPress={() => {
            setAssignedOnly(false);
            setPage(1);
          }}
        >
          Tất cả lộ trình
        </Button>
        <Button
          size="sm"
          color={assignedOnly ? "primary" : "default"}
          variant={assignedOnly ? "solid" : "flat"}
          onPress={() => {
            setAssignedOnly(true);
            setPage(1);
          }}
        >
          Đã phân công
        </Button>
      </div>
    ),
    [assignedOnly],
  );

  if (profileLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // if (!isBusinessDepartmentHead || !ifITStaff) {
  //   return (
  //     <div className="text-center text-red-500 py-10">
  //       Bạn không có quyền truy cập chức năng này.
  //     </div>
  //   );
  // }

  return (
    <>
      <GenericSearchFilter
        title="Tìm kiếm lộ trình ghi"
        icon={<SearchIcon size={18} />}
        gridClassName="block space-y-10"
        isCollapsible={false}
        actions={
          <div className="flex justify-end">
            <FilterButton onPress={handleSearch} />
          </div>
        }
      >
        <section className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CustomInput
              label="Tên lộ trình ghi"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <CustomSelect
              label="Nhánh tổng"
              options={lateralOptions}
              selectedKeys={selectedLateral}
              onSelectionChange={setSelectedLateral}
            />
            <CustomSelect
              label="Chi nhánh"
              options={networkOptions}
              selectedKeys={selectedNetwork}
              onSelectionChange={setSelectedNetwork}
            />
          </div>
        </section>
      </GenericSearchFilter>

      <GenericDataTable
        isLoading={loading}
        title="Danh sách lộ trình ghi thu"
        columns={columns}
        data={data}
        headerSummary={`${totalItems}`}
        actions={headerActions}
        renderCellAction={renderCell}
        paginationProps={{
          total: totalPages,
          page,
          onChange: setPage,
          summary: `${data.length}`,
        }}
        onSortChange={(columnKey) => {
          setPage(1);
          setSort((prev) => ({
            field: columnKey === "stt" ? "createdAt" : columnKey,
            direction:
              prev.field === columnKey && prev.direction === "asc"
                ? "desc"
                : "asc",
          }));
        }}
      />

      <Modal
        isOpen={assignmentModalOpen}
        onClose={closeAssignmentModal}
        placement="top-center"
      >
        <ModalContent>
          <ModalHeader>
            {assignmentMode === "assign"
              ? "Phân công lộ trình ghi"
              : "Cập nhật phân công lộ trình ghi"}
          </ModalHeader>
          <ModalBody>
            <SearchInputWithButton
              placeholder="Nhân viên ghi thu"
              value={selectedStaffName}
              onChange={() => {}}
              onSearch={() => setStaffLookupOpen(true)}
            />
            {/* <p className="text-xs text-default-500">
              Mã nhân viên đã chọn: {staffIdInput || "Chưa chọn"}
            </p> */}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={closeAssignmentModal}>
              Hủy
            </Button>
            <Button
              color="primary"
              onPress={handleAssignSubmit}
              isLoading={submitLoading}
              isDisabled={!staffIdInput.trim()}
            >
              {assignmentMode === "assign" ? "Phân công" : "Cập nhật"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <LookupModal<MeterInspectionLookupItem>
        isOpen={staffLookupOpen}
        onClose={() => setStaffLookupOpen(false)}
        title="Chọn nhân viên ghi thu"
        api="/api/auth/employees/meter-inspection-staff"
        columns={[
          { key: "stt", label: "STT" },
          { key: "fullName", label: "Nhân viên" },
        ]}
        mapData={(item, index, currentPage) => ({
          id: item.id,
          stt: (currentPage - 1) * 10 + index + 1,
          fullName: item.name,
        })}
        onSelect={(staff) => {
          setStaffIdInput(staff.id);
          setSelectedStaffName(staff.fullName);
          setStaffLookupOpen(false);
        }}
      />
    </>
  );
};

export default RoadmapAssignmentPage;
