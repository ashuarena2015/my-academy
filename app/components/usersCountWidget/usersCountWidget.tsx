import React from "react";
import { Card, CardHeader, Avatar, Button } from "@heroui/react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/app/api/store";

type UserCounter = {
  students?: number;
  staffs?: number;
  teachers?: number;
  admins?: number;
  principals?: number;
  head_principals?: number;
  head_teachers?: number;
};

const UserCount = () => {
  const { userCounter }: { userCounter: UserCounter } = useSelector((state: RootState) => state.users);
  const {
    students = 0,
    staffs = 0,
    teachers = 0,
    admins = 0,
    principals = 0,
    head_principals = 0,
    head_teachers = 0,
  } = userCounter ?? {};
  return (
    <div className="gap-4 justify-between grid grid-cols-2">
      <Card className="">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              showFallback
              fallback={
                <svg
                  aria-hidden="true"
                  data-slot="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width={24}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              radius="full"
              size="md"
              src="https://images.unsplash.com/broken"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                Students
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
                {students || 0}
              </h5>
            </div>
          </div>
          <Button color="primary" radius="full" size="sm">
            More
          </Button>
        </CardHeader>
      </Card>
      <Card className="">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar
              isBordered
              showFallback
              fallback={
                <svg
                  aria-hidden="true"
                  data-slot="icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                  width={24}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              radius="full"
              size="md"
              src="https://images.unsplash.com/broken"
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                Staffs
              </h4>
              <h5 className="text-small tracking-tight text-default-400">
              {staffs + teachers + head_principals + principals + head_teachers}
              </h5>
            </div>
          </div>
          <Button color="primary" radius="full" size="sm">
            More
          </Button>
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserCount;
