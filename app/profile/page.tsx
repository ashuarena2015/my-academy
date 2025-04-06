"use client";

import ProfileUpdateForm from "./ProfileUpdateForm";
import { useSelector } from "react-redux";
import { RootState } from "../api/store";

export default function ProfilePage() {
  const { loginUser } = useSelector((state: RootState) => state.users);
  return (
      <div className="grid grid-cols-3 w-full p-4">
        <ProfileUpdateForm loginUser={loginUser} />
    </div>
  );
}
