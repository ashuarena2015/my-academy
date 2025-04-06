"use client";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function UserLayout({
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
      <div className="w-full">{children}</div>
    </section>
  );
}
