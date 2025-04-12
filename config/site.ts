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
        iconColor: "bg-yellow-400",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Students",
        href: "/students",
        icon: "Students",
        iconColor: "bg-yellow-400",
        isShow: true
      },
      {
        label: "Fee",
        href: "/fee",
        icon: "Students",
        iconColor: "bg-yellow-400",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Users",
        href: "/users",
        icon: "Users",
        iconColor: "bg-yellow-400",
        isShow: loginUser?.userType !== 'student'
      },
      {
        label: "Blogs",
        href: "/blogs",
        icon: "News",
        iconColor: "bg-yellow-400",
        isShow: true
      },
      {
        label: "Events",
        href: "/events",
        icon: "Events",
        iconColor: "bg-yellow-400",
        isShow: true
      },
      {
        label: "Chat",
        href: "/chat",
        icon: "Chat",
        iconColor: "bg-yellow-400",
        isShow: true
      },
    ],
    navMenuItems: [
      {
        label: "My Profile",
        href: "/profile",
      },
      {
        label: "Edit Profile",
        href: `/profile/${loginUser?.userId}`,
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
