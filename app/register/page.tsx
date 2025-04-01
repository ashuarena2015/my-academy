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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

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
          <Select className="w-full" name="userType" placeholder="Select role">
            {userTypes.map((role) => (
              <SelectItem key={role.key}>{role.label}</SelectItem>
            ))}
          </Select>
        </div>
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
