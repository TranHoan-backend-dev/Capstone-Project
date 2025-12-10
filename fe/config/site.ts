export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "CRM",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      icon: null,
      label: "Trang chủ",
      href: "/",
    },
    {
      icon: null,
      label: "Khách hàng",
      href: "/customer",
    },
    {
      icon: null,
      label: "Khảo sát thiết kế",
      href: "/design-survey",
    },
    {
      icon: null,
      label: "Thi công",
      href: "/construction",
    },
    {
      icon: null,
      label: "Ghi chỉ số & Hóa đơn",
      href: "/record-invoice",
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
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
