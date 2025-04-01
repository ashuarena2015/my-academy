"use client";
import { Link } from "@heroui/react";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { loginUser } = useSelector((state: RootState) => state.users);

  if(loginUser?.email) {
    return true;
  }

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-lg text-center justify-center">
        <Image className="m-auto" src="/logo.png" alt="Logo" width={200} height={100} priority />
        <div className="mt-10">{children}</div>
        <p className="text-md mt-2">
          If you don't have an account, please <Link href="/register">Register</Link>{" "}
          here.
        </p>
      </div>
    </section>
  );
}
