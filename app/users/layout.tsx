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
      <div>
        <h2 className="text-2xl pb-4">Administration</h2>
      </div>
      <div className="w-full">{children}</div>
    </section>
  );
}
