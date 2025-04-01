"use client";
import { Link } from "@heroui/react";
import Image from "next/image";

import { title } from "@/components/primitives";

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <Image className="m-auto" src="/logo.png" alt="Logo" width={200} height={100} priority />
        <div className="mt-10">{children}</div>
        <p className="text-md mt-2">
          If you have already an account, please <Link href="/login">login</Link>{" "}
          here.
        </p>
      </div>
    </section>
  );
}
