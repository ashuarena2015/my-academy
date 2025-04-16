"use client";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function ClassTeachersLayout({
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
      {children}
    </section>
  );
}
