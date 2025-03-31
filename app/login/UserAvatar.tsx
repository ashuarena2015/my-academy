"use client";

import React, { useEffect } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
} from "@heroui/react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';

import { RootState, AppDispatch } from "../api/store";

const UserAvatar = React.memo(() => {
  const loginUser = useSelector(
    (state: RootState) => state.users.loginUser,
    shallowEqual,
  );

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    const response = await dispatch({
      type: "apiRequest",
      payload: {
        url: `user/logout`,
        method: "GET",
        onSuccess: "users/userLogout",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "userLogout"
      },
    });
    console.log({response});
    if(response?.isLogout) {
      router.push('/login');
    }
  }

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
            }}
            className="transition-transform"
            description={loginUser?.adminRole}
            name={
              loginUser?.firstName
                ? `${loginUser?.firstName} ${loginUser?.lastName}`
                : loginUser?.email
            }
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{loginUser?.email}</p>
          </DropdownItem>
          <DropdownItem key="settings">My Profile</DropdownItem>
          <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
          <DropdownItem key="logout" color="danger" onClick={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";

export default UserAvatar;
