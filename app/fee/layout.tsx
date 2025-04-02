"use client";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function ProfileLayout({
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
      <h1 className="text-3xl font-mono">Fee</h1>
      <div className="mt-10">{children}</div>
    </section>
  );
}
