"use client";

import UsersCount from "../components/usersCountWidget";
import StudentsList from "../components/Students/StudentsList";

export default function DashboardPage() {
  return (
    <div>
      <UsersCount />
      <div className="mt-5">
        <StudentsList />
      </div>
    </div>
  );
}
