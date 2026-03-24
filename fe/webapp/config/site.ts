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
          label: "Đơn lắp đặt mới",
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
          label: "Nhập khách hàng mới",
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
              label: "Danh sách đơn chờ dự toán",
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
              key: "report-budget-reject",
              label: "Danh sách đơn từ chối duyệt dự toán",
              href: "/rejected-budget-approval",
              roles: ["it_staff", "planning_technical_department_head"],
            },
            {
              key: "report-survey-assigned",
              label: "Danh sách đơn đã phân công khảo sát",
              href: "/assigned-survey",
              roles: ["it_staff", "planning_technical_department_head"],
            },
            {
              key: "report-customer-call",
              label: "Danh sách khách hàng gọi điện",
              href: "/customer-calls",
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
          key: "settlement-lookup",
          label: "Tra cứu quyết toán",
          href: "/settlement-lookup",
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
        },
      ],
    },
  ],

  columnsWaitingBudgetApproval: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayLap", label: "Ngày lập", width: "120px" },
    { key: "tongTien", label: "Tổng tiền", width: "150px" },
    { key: "nvLap", label: "NV lập", width: "150px" },
  ],

  columnsWaitingBudget: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayHenKS", label: "Ngày hẹn khảo sát", width: "120px" },
    { key: "ngayDuyetKS", label: "Ngày duyệt khảo sát", width: "120px" },
    { key: "ghiChu", label: "Ghi chú", width: "120px" },
  ],

  columnsRejectedBudgetApproval: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayLap", label: "Ngày lập chiết tính", width: "120px" },
    { key: "nvLapChietTinh", label: "N/V lập chiết tính", width: "120px" },
    { key: "ghiChu", label: "Ghi chú", width: "150px" },
  ],

  columnsReportContract: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayLap", label: "Ngày lập", width: "120px" },
    { key: "nvLap", label: "NV lập", width: "150px" },
  ],

  columnsRejectedDesign: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayLap", label: "Ngày khảo sát", width: "120px" },
    { key: "nvLap", label: "N/V khảo sát", width: "150px" },
    { key: "noidungKS", label: "Nội dung khảo sát", width: "150px" },
  ],

  columnsAssignedSurvay: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "mucDichSD", label: "Mục đích sử dụng", width: "150Px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayHenKS", label: "Ngày hẹn khảo sát", width: "120px" },
    { key: "nhanvienKS", label: "Nhân viên khảo sát", width: "120px" },
  ],

  columnsUnassignedSurvay: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "soDon", label: "Số đơn", width: "120px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "dienThoai", label: "Điện thoại", width: "120px" },
    { key: "mucDichSD", label: "Mục đích sử dụng", width: "150Px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayHenKS", label: "Ngày hẹn khảo sát", width: "120px" },
  ],

  columnsCustomerCall: [
    { key: "stt", label: "STT", width: "60px" },
    { key: "tenKhachHang", label: "Tên khách hàng", width: "200px" },
    { key: "diaChi", label: "Địa chỉ", width: "200px" },
    { key: "cmnd", label: "CMND", width: "120px" },
    { key: "ngayCap", label: "Ngày cấp", width: "120px" },
    { key: "ngayDK", label: "Ngày đăng ký", width: "120px" },
    { key: "ngayGoi", label: "Ngày gọi", width: "120px" },
    { key: "tenNVLCT", label: "TENNVLCT", width: "150px" },
  ],
};
