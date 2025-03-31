"use client";
// import { Link } from "@heroui/react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="inline-block max-w-lg justify-center">
        <h1 className="text-3xl font-mono">Profile</h1>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}
