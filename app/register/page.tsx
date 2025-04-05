"use client";

import React, {
  useState,
} from "react";
import {
  Form,
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../components/alert";
import { RootState, AppDispatch } from "../api/store";
import "react-image-crop/dist/ReactCrop.css";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const globalMessage = useSelector((state: RootState) => state.global);


  const [permission, setPermission] = useState<string[]>([]);
  const handleMultipleSelect = (values: []) => {
    setPermission(values);
  }

  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const handleSelectChange  = (e: any) => {
    setIsAdmin(e.target.value !== "student");
  }

  console.log({isAdmin});

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    data.adminPermissions = permission;
    dispatch({
      type: "apiRequest",
      payload: {
        url: `user/register`,
        method: "POST",
        onSuccess: "users/saveUserDetails",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "saveUserDetails",
        body: { userInfo: { ...data } },
      },
    });
  };

  const userTypes = [
    { key: "principal", label: "Principal" },
    { key: "teacher", label: "Teacher" },
    { key: "staff", label: "Staff" },
    { key: "student", label: "Student" },
  ];

  const adminPermissionsTypes = [
    { key: "attendance", label: "Attendance" },
    { key: "profile_update", label: "Profile update" },
    { key: "account_delete", label: "Account delete" },
    { key: "fee_update", label: "Fee update" },
  ];

  return (
    <div className="w-96">
      {globalMessage?.message ? (
        <AlertMessage
          message={globalMessage?.message}
          type={
            (globalMessage?.type as
              | "default"
              | "primary"
              | "secondary"
              | "success"
              | "warning"
              | "danger") || "default"
          }
        />
      ) : null}
      <Form className="gap-4" id="register_form" onSubmit={handleSubmit}>
        <div className="flex justify-between w-full">
          <Select className="w-full" name="userType" placeholder="Select role" onChange={handleSelectChange}>
            {userTypes.map((role) => (
              <SelectItem key={role.key}>{role.label}</SelectItem>
            ))}
          </Select>
        </div>
        {isAdmin ? <div className="flex justify-between w-full">
          <Select
            className="w-full"
            name="adminPermissions"
            selectionMode="multiple"
            placeholder="Select permissions"
            onSelectionChange={(e) => handleMultipleSelect(Array.from(e).map(String))}
          >
            {adminPermissionsTypes.map((permission, i) => (
              <SelectItem key={permission.key}>{permission.label}</SelectItem>
            ))}
          </Select>
        </div> : null }
        <Input
          errorMessage="Error message"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-full">
            <Button className="w-full" color="primary" type="submit">
              Register
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
