"use client";
import { Link } from "@heroui/react";

import { title } from "@/components/primitives";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Login</h1>
        {/* <p className="text-md mt-2">
          If you have already an account, please <Link href="#">login</Link>{" "}
          here.
        </p> */}
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
