export type SiteConfig = typeof siteConfig;

export const siteConfig = () => {
  return {
    name: "My Academy",
    description: "A School Management System",
    navItems: [
      {
        label: "Login",
        href: "/login",
        icon: "Login",
        iconColor: "bg-primary-100",
      },
      {
        label: "Register",
        href: "/register",
        icon: "Register",
        iconColor: "bg-default-100",
      },
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "Dashboard",
        iconColor: "bg-success-100",
      },
      {
        label: "Students",
        href: "/students",
        icon: "Students",
        iconColor: "bg-warning-100 ",
      },
      {
        label: "Staffs",
        href: "/staffs",
        icon: "Staffs",
        iconColor: "bg-default-200",
      },
      {
        label: "News",
        href: "/news",
        icon: "News",
        iconColor: "bg-secondary-100",
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: "Calendar",
        iconColor: "bg-default-200",
      },
      {
        label: "Chat",
        href: "/chat",
        icon: "Chat",
        iconColor: "bg-danger-100",
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
};
