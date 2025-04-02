"use client";

import React, { useMemo } from "react";
import UsersCount from "../components/usersCountWidget";
import StudentsList from "../students/studentsList";

const DashboardPage = () => {
  // Memoize components to prevent unnecessary re-renders
  const MemoizedUsersCount = React.memo(UsersCount);
  const MemoizedStudentsList = React.memo(StudentsList);

  return (
    <div>
      <MemoizedUsersCount />
      <div className="mt-5">
        <MemoizedStudentsList />
      </div>
    </div>
  );
}

export default React.memo(DashboardPage);
