"use client";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function StudentsLayout({
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
        <h2 className="text-2xl pb-4">Students</h2>
      </div>
      {children}
    </section>
  );
}
