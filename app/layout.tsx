import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import Auth from "./auth";
import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/config/fonts";
import SideBar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

export const metadata: Metadata = {
  title: {
    default: siteConfig().name,
    template: `%s - ${siteConfig().name}`,
  },
  description: siteConfig().description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
          <Auth />
          <div className="flex w-full justify-start h-screen">
            <div className="w-96" style={{ width: "350px" }}>
              <SideBar />
            </div>
            <div className="w-full grid grid-cols-5 relative">
              <main className="w-full p-5 pt-0 col-span-4">
                <Navbar />
                <div className="mt-2 pl-5 pr-5">{children}</div>
              </main>
              <div className="col-span-1 bg-slate-600">Hiw</div>
              {/* <footer className="w-full flex items-center justify-center py-3">
                  <Link
                    isExternal
                    className="flex items-center gap-1 text-current"
                    href="https://buddyzone.com"
                    title="heroui.com homepage"
                  >
                    <span className="text-default-600">Powered by</span>
                    <p className="text-primary">Buddyzone &copy; 2025</p>
                  </Link>
                </footer> */}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
