export type SiteConfig = typeof siteConfig;
export const hasPermission = (userRole: string, allowedRoles?: string[]) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(userRole);
};
type NavItem = {
  key: string;
  label: string;
  href?: string;
  roles?: string[];
  items?: NavItem[];
  children?: NavItem[];
};

export const filterNavItems = (
  items: NavItem[],
  userRole: string,
): NavItem[] => {
  return items
    .map((item) => {
      // handle items
      if (item.items) {
        const filteredItems = filterNavItems(item.items, userRole);
        if (filteredItems.length > 0) {
          return { ...item, items: filteredItems };
        }
        return null;
      }

      // handle children
      if (item.children) {
        const filteredChildren = filterNavItems(item.children, userRole);
        if (filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }

      // check permission
      if (hasPermission(userRole, item.roles)) {
        return item;
      }

      return null;
    })
    .filter(Boolean) as NavItem[];
};

export const siteConfig = {
  name: "CMSN",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    // dashboard
    {
      key: "home",
      label: "Trang chủ",
      href: "/home",
    },

    // Danh mục
    {
      key: "category",
      label: "Danh mục",
      items: [
        {
          key: "departments",
          label: "Quản lý Phòng ban",
          href: "/departments",
          roles: ["it_staff"],
        },
        {
          key: "employees",
          label: "Quản lý Nhân viên",
          href: "/employees",
          roles: ["it_staff"],
        },
        {
          key: "jobs",
          label: "Quản lý Công việc",
          href: "/jobs",
          roles: ["it_staff"],
        },
        {
          key: "communes",
          label: "Quản lý Phường/xã",
          href: "/communes",
          roles: ["it_staff"],
        },
        {
          key: "neighborhood-units",
          label: "Quản lý Tổ/Khu phố",
          href: "/neighborhood-units",
          roles: ["it_staff"],
        },
        {
          key: "hamlets",
          label: "Quản lý Thôn/làng",
          href: "/hamlets",
          roles: ["it_staff"],
        },
        {
          key: "roads",
          label: "Quản lý Đường phố",
          href: "/roads",
          roles: ["it_staff"],
        },
      ],
    },

    // Thiết bị
    {
      key: "device",
      label: "Thiết bị",
      items: [
        {
          key: "water-meter-type",
          label: "Quản lý Loại đồng hồ nước",
          href: "/water-meter-type",
          roles: ["it_staff"],
        },
        {
          key: "materials-prices",
          label: "Quản lý Đơn giá vật tư",
          href: "/materials-prices",
          roles: ["it_staff"],
        },
        {
          key: "materials-group",
          label: "Quản lý Nhóm vật tư",
          href: "/materials-group",
          roles: ["it_staff"],
        },
        {
          key: "units",
          label: "Quản lý Đơn vị tính",
          href: "/units",
          roles: ["it_staff"],
        },
        {
          key: "parameters",
          label: "Quản lý Tham số kĩ thuật",
          href: "/parameters",
          roles: ["it_staff"],
        },
        {
          key: "water-price",
          label: "Quản lý Giá nước",
          href: "/water-price",
          roles: ["it_staff"],
        },
        {
          key: "access-rights",
          label: "Quản lý quyền truy cập",
          href: "/access-rights",
          roles: ["it_staff"],
        },
      ],
    },

    // Hợp đồng
    {
      key: "contract",
      label: "Hợp đồng",
      items: [
        {
          key: "new-contract",
          label: "Lập hợp đồng cấp nước mới",
          href: "/water-supply-contract",
          roles: ["it_staff", "order_receiving_staff"],
        },
      ],
    },

    // Khách hàng
    {
      key: "customer",
      label: "Khách hàng",
      items: [
        {
          key: "new-installation-form",
          label: "Tạo đơn lắp đặt mới",
          href: "/installation-form/new",
          roles: ["it_staff", "order_receiving_staff"],
        },
        {
          key: "new-installation-lookup",
          label: "Tra cứu đơn lắp đặt mới",
          href: "/installation-form/lookup",
          roles: ["it_staff", "order_receiving_staff"],
        },
        {
          key: "find-customer",
          label: "Tra cứu khách hàng",
          href: "/customers/lookup",
          roles: ["it_staff", "order_receiving_staff"],
        },
        {
          key: "restores-customer",
          label: "Khôi phục khách hàng hủy",
          href: "/customers/recovery",
          roles: ["it_staff"],
        },
        {
          key: "new-customers-import",
          label: "Tạo khách hàng mới",
          href: "/customers/import",
          roles: ["it_staff", "order_receiving_staff"],
        },
      ],
    },

    // Khảo sát thiết kế
    {
      key: "report",
      label: "Khảo sát thiết kế",
      items: [
        {
          key: "report-list",
          label: "Báo cáo",
          children: [
            {
              key: "report-budget-wait",
              label: "Danh sách đơn chờ lập dự toán",
              href: "/waiting-budget",
              roles: ["it_staff", "planning_technical_department_head"],
            },
            {
              key: "report-budget-approve-wait",
              label: "Danh sách đơn chờ duyệt dự toán",
              href: "/waiting-budget-approval",
              roles: ["it_staff", "planning_technical_department_head"],
            },
            {
              key: "report-budget-reviewed",
              label: "Danh sách đơn đã phê duyệt dự toán",
              href: "/reviewed-budget",
              roles: ["it_staff", "planning_technical_department_head"],
            },
            {
              key: "report-survey-assigned",
              label: "Danh sách đơn đã phân công khảo sát",
              href: "/assigned-survey",
              roles: ["it_staff", "planning_technical_department_head"],
            },
          ],
        },
        {
          key: "design-processing",
          label: "Xử lý đơn chờ thiết kế & Thiết kế",
          href: "/design-processing",
          roles: [
            "it_staff",
            "survey_staff",
            "planning_technical_department_head",
          ],
        },
        {
          key: "assigning-survey",
          label: "Phân công khảo sát thiết kế",
          href: "/assigning-survey",
          roles: ["it_staff", "planning_technical_department_head"],
        },
        {
          key: "estimate-preparation",
          label: "Lập dự toán",
          href: "/estimate/preparation",
          roles: [
            "it_staff",
            "survey_staff",
            "planning_technical_department_head",
          ],
        },
        {
          key: "estimate-approval",
          label: "Duyệt dự toán",
          href: "/estimate/approval",
          roles: [
            "it_staff",
            "survey_staff",
            "company_leadership",
            "planning_technical_department_head",
          ],
        },
        {
          key: "run-estimate",
          label: "Chạy dự toán",
          href: "/estimate/run",
          roles: [
            "it_staff",
            "survey_staff",
            "planning_technical_department_head",
          ],
        },
        // {
        //   key: "estimate-lookup",
        //   label: "Tra cứu dự toán",
        //   href: "/estimate/lookup",
        //   roles: ["it_staff"],
        // },
      ],
    },

    // Thi công
    {
      key: "construction",
      label: "Thi công",
      items: [
        {
          key: "networks",
          label: "Quản lý Chi nhánh cấp nước",
          href: "/networks",
          roles: ["it_staff"],
        },
        {
          key: "laterals",
          label: "Quản lý Nhánh tổng",
          href: "/laterals",
          roles: ["it_staff"],
        },
        {
          key: "roadmaps",
          label: "Quản lý Lộ trình ghi",
          href: "/roadmaps",
          roles: ["it_staff"],
        },

        {
          key: "pending-construction",
          label: "Quản lý Đơn chờ xây dựng",
          href: "/pending-construction",
          roles: [
            "it_staff",
            "survey_staff",
            "construction_department_staff",
            "construction_department_head",
          ],
        },
        {
          key: "settlement-lookup",
          label: "Tra cứu quyết toán",
          href: "/settlement-lookup",
          roles: ["it_staff", "finance_department"],
        },
      ],
    },

    // Ghi chỉ số & Hóa đơn
    {
      key: "billing",
      label: "Ghi chỉ số & Hóa đơn",
      items: [
        {
          key: "meter-verification",
          label: "Kiểm tra chỉ số bằng hình ảnh",
          href: "/meter-verification",
          roles: ["it_staff", "order_receiving_staff"],
        },
        {
          key: "installation-fee-collection",
          label: "Thu phí lắp đặt",
          href: "/installation-fee-collection",
          roles: ["it_staff", "finance_department", "order_receiving_staff"],
        },
      ],
    },
  ],
};
