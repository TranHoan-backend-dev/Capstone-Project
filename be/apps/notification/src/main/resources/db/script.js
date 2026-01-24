use notification

db.notification.insertMany([
  {
    link: "/tasks/101",
    message: "Bạn được giao một công việc mới",
    status: false,
    createdAt: ISODate("2026-01-01T08:00:00Z"),
    userId: ["u01", "u02"]
  },
  {
    link: "/tasks/102",
    message: "Công việc đã được cập nhật",
    status: true,
    createdAt: ISODate("2026-01-02T09:15:00Z"),
    userId: ["u03"]
  },
  {
    link: "/projects/201",
    message: "Bạn được thêm vào dự án mới",
    status: false,
    createdAt: ISODate("2026-01-03T10:00:00Z"),
    userId: ["u01"]
  },
  {
    link: "/reports/301",
    message: "Báo cáo tháng đã sẵn sàng",
    status: true,
    createdAt: ISODate("2026-01-04T11:30:00Z"),
    userId: ["u02", "u03"]
  },
  {
    link: "/notifications/5",
    message: "Có thông báo mới từ hệ thống",
    status: false,
    createdAt: ISODate("2026-01-05T14:20:00Z"),
    userId: ["u04"]
  },
  {
    link: "/tasks/103",
    message: "Công việc sắp đến hạn",
    status: false,
    createdAt: ISODate("2026-01-06T16:00:00Z"),
    userId: ["u01", "u04"]
  },
  {
    link: "/projects/202",
    message: "Dự án đã được phê duyệt",
    status: true,
    createdAt: ISODate("2026-01-07T08:45:00Z"),
    userId: ["u02"]
  },
  {
    link: "/meetings/401",
    message: "Lịch họp mới được tạo",
    status: false,
    createdAt: ISODate("2026-01-08T09:00:00Z"),
    userId: ["u01", "u02", "u03"]
  },
  {
    link: "/tasks/104",
    message: "Công việc đã hoàn thành",
    status: true,
    createdAt: ISODate("2026-01-09T13:10:00Z"),
    userId: ["u03"]
  },
  {
    link: "/system",
    message: "Hệ thống sẽ bảo trì lúc 22h",
    status: false,
    createdAt: ISODate("2026-01-10T15:00:00Z"),
    userId: ["u01", "u02", "u03", "u04"]
  },
  {
    link: "/tasks/105",
    message: "Công việc bị trả lại cần chỉnh sửa",
    status: false,
    createdAt: ISODate("2026-01-11T10:30:00Z"),
    userId: ["u02"]
  },
  {
    link: "/projects/203",
    message: "Dự án đã bị hủy",
    status: true,
    createdAt: ISODate("2026-01-12T17:45:00Z"),
    userId: ["u04"]
  },
  {
    link: "/messages/501",
    message: "Bạn có tin nhắn mới",
    status: false,
    createdAt: ISODate("2026-01-13T08:20:00Z"),
    userId: ["u01"]
  },
  {
    link: "/reports/302",
    message: "Báo cáo tuần đã được duyệt",
    status: true,
    createdAt: ISODate("2026-01-14T09:50:00Z"),
    userId: ["u03", "u04"]
  },
  {
    link: "/alerts/601",
    message: "Phát hiện hoạt động đăng nhập bất thường",
    status: false,
    createdAt: ISODate("2026-01-15T21:00:00Z"),
    userId: ["u01", "u02"]
  }
])
