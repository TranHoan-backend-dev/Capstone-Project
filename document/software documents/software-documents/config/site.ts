
export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Software Documents",
  description: "Software Requirement Specification and other documents.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "SRS",
      href: "/srs",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "SRS",
      href: "/srs",
    },
  ],
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
    docs: "/srs",
    discord: "https://discord.com",
    sponsor: "https://patreon.com",
  },
};
