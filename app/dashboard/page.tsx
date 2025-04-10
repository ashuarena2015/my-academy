"use client";

import React, { useMemo } from "react";
import UsersCount from "../components/usersCountWidget";
import StudentsList from "../students/studentsList";
import UsersList from "../users/usersList";
import FeeTable from "../fee/feeTable";

const DashboardPage = () => {
  // Memoize components to prevent unnecessary re-renders
  const MemoizedUsersCount = React.memo(UsersCount);
  const MemoizedStudentsList = React.memo(StudentsList);
  const MemoizedUsersList = React.memo(UsersList);
  const MemoizedFeeTable = React.memo(FeeTable);

  return (
    <div>
      <MemoizedUsersCount />
      <div className="mt-5 grid grid-cols-4 gap-4">
        <div className="col-span-2 bg-white p-5 rounded-lg shadow-lg overflow-auto pb-5">
          <p className="text-2xl mb-2">Students</p>
          <div className="h-96 overflow-auto">
            <MemoizedStudentsList noTableWrapper />
          </div>
        </div>
        <div className="col-span-2 bg-white p-5 rounded-lg shadow-lg overflow-auto">
          <p className="text-2xl mb-2">Administration</p>
          <div className="h-96 overflow-auto">
            <MemoizedUsersList userTypeProp={'staffs'} noTableWrapper />
          </div>
        </div>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-lg mt-4">
        <p className="text-2xl mb-2">Fee</p>
        <MemoizedFeeTable noTableWrapper />
      </div>
    </div>
  );
}

export default React.memo(DashboardPage);
