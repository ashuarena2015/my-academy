"use client";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const { loginUser } = useSelector((state: RootState) => state.users);

  if(!loginUser?.email) {
    return true;
  }

  return (
    <section className="flex flex-col justify-center gap-4">
      <h1 className="text-3xl font-mono">Dashboard</h1>
      <div className="w-full mt-10">{children}</div>
    </section>
  );
}
