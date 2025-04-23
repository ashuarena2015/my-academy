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
    <section>
      <div className="w-full">{children}</div>
    </section>
  );
}
