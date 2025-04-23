"use client";

import React from "react";
import UsersCount from "../components/usersCountWidget";
import StudentsList from "../students/studentsList";
import UsersList from "../users/usersList";
import FeeTable from "../fee/feeTable";
import UpcomingBirthday from './upComingbirthdayWidget';
import AddNewUser from "../components/AddNewUserModal";

const DashboardPage = () => {
  // Memoize components to prevent unnecessary re-renders
  const MemoizedUsersCount = React.memo(UsersCount);
  const MemoizedStudentsList = React.memo(StudentsList);
  const MemoizedUsersList = React.memo(UsersList);
  const MemoizedFeeTable = React.memo(FeeTable);
  const MemoizedUpcomingBirthday = React.memo(UpcomingBirthday);

  return (
    <div>
      <MemoizedUsersCount />
      <div className="mt-5 grid grid-cols-4 gap-4">
        <div className="col-span-2 bg-white p-5 rounded-lg shadow-lg overflow-auto pb-5">
          <div className="flex justify-between">
            <p className="text-2xl mb-2">Students</p>
            <AddNewUser title={'Add new student'} userTypeForm="student" />
          </div>
          <div className="h-96 overflow-auto">
            <MemoizedStudentsList listCompact={true} />
          </div>
        </div>
        <div className="col-span-2 bg-white p-5 rounded-lg shadow-lg overflow-auto">
          <div className="flex justify-between">
            <p className="text-2xl mb-2">Administations</p>
            <AddNewUser title={'Add new staff'} userTypeForm="staff" />
          </div>
          <div className="h-96 overflow-auto">
            <MemoizedUsersList />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-5">
        <div className="bg-white p-5 rounded-lg shadow-lg col-span-2">
          <p className="text-2xl mb-2">Fee</p>
          <MemoizedFeeTable />
        </div>
        <div className="bg-white p-5 rounded-lg shadow-lg col-span-2">
          <MemoizedUpcomingBirthday />
        </div> 
      </div>
    </div>
  );
}

export default React.memo(DashboardPage);
