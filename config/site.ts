export type SiteConfig = typeof siteConfig;

export const siteConfig = (loginUser: any) => {
  return {
    name: "My Academy",
    description: "A School Management System",
    navItems: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: "Dashboard",
        iconColor: "bg-success-100",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Students",
        href: "/students",
        icon: "Students",
        iconColor: "bg-warning-100 ",
        isShow: true
      },
      {
        label: "Fee",
        href: "/fee",
        icon: "Students",
        iconColor: "bg-warning-100 ",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Users",
        href: "/users",
        icon: "Users",
        iconColor: "bg-default-200",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Blogs",
        href: "/blogs",
        icon: "News",
        iconColor: "bg-secondary-100",
        isShow: true
      },
      {
        label: "Calendar",
        href: "/calendar",
        icon: "Calendar",
        iconColor: "bg-default-200",
        isShow: true
      },
      {
        label: "Chat",
        href: "/chat",
        icon: "Chat",
        iconColor: "bg-danger-100",
        isShow: true
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
