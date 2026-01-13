export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CRM",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      key: "home",
      label: "Trang chủ",
      href: "/home",
    },
    {
      key: "customer",
      label: "Khách hàng",
      href: "/customers",
      items: [
        {
          key: "new-installation-form",
          label: "Đơn lắp đặt mới",
          href: "/new-installation-form",
        },
        {
          key: "new-installation-lookup",
          label: "Tra cứu đơn lắp đặt mới",
          href: "/new-installation-lookup",
        },
        {
          key: "find-customer",
          label: "Tra cứu khách hàng",
          href: "/customers",
        },
        {
          key: "restores-customer",
          label: "Khôi phục khách hàng hủy",
          href: "/restore-customers",
        },
        {
          key: "new-customers-import",
          label: "Nhập khách hàng mới",
          href: "/new-customers-import",
        },
      ],
    },
    {
      key: "report",
      label: "Khảo sát thiết kế",
      items: [
        {
          key: "report-list",
          label: "Báo cáo",
          children: [
            {
              key: "report-contract",
              label: "Danh sách đơn chuyển lập hợp đồng",
              href: "/contract",
            },
            {
              key: "report-budget-wait",
              label: "Danh sách đơn chờ dự toán",
              href: "/waiting-budget",
            },
            {
              key: "report-design-reject",
              label: "Danh sách đơn từ chối thiết kế",
              href: "/rejected-design",
            },
            {
              key: "report-budget-approve-wait",
              label: "Danh sách đơn chờ duyệt dự toán",
              href: "/waiting-budget-approval",
            },
            {
              key: "report-budget-reject",
              label: "Danh sách đơn từ chối duyệt dự toán",
              href: "/rejected-budget-approval",
            },
            {
              key: "report-survey-unassigned",
              label: "Danh sách đơn chưa phân công khảo sát",
              href: "/unassigned-survey",
            },
            {
              key: "report-survey-assigned",
              label: "Danh sách đơn đã phân công khảo sát",
              href: "/assigned-survey",
            },
            {
              key: "report-customer-call",
              label: "Danh sách khách hàng gọi điện",
              href: "/customer-calls",
            },
          ],
        },
        {
          key: "design-processing",
          label: "Xử lý đơn chờ thiết kế & Thiết kế",
          href: "/design-processing",
        },
        {
          key: "assigning-survey",
          label: "Phân công khảo sát thiết kế",
          href: "/assigning-survey",
        },
        {
          key: "estimate-preparation",
          label: "Lập dự toán",
          href: "/estimate-preparation",
        },
        {
          key: "estimate-lookup",
          label: "Tra cứu dự toán",
          href: "/estimate-lookup",
        },
        {
          key: "manage-supplies",
          label: "Quản lý mẫu bốc vật tư",
          href: "/manage-supplies",
        },
        {
          key: "survey-pending",
          label: "Nhập đơn dự toán ống trục",
          href: "/#",
        },
      ],
    },
    {
      key: "construction",
      label: "Thi công",
      items: [
        {
          key: "settlement-lookup",
          label: "Tra cứu quyết toán",
          href: "/settlement-lookup",
        },
      ],
    },
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

  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
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
