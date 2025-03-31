"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  SelectItem,
  Link,
} from "@heroui/react";
import { format, parse } from "date-fns";
import { parseDate } from "@internationalized/date";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../components/alert";
import { RootState, AppDispatch } from "../api/store";

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const globalMessage = useSelector((state: RootState) => state.global);
  const { loginUser } = useSelector((state: RootState) => state.users);

  interface UserInputInfo {
    firstName: string;
    lastName: string;
    email: string;
    dob: string;
    address?: string; // Added the address property
    adminRole: string;
    phone: Number;
    alternatePhone: Number;
    fatherName?: string; // Added the fatherName property
    motherName?: string; // Added the motherName property
  }

  const [userInputInfo, setUserInputInfo] = useState<UserInputInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    dob: "",
    adminRole: "",
    phone: 0,
    alternatePhone: 0,
    fatherName: "",
    motherName: "",
  });

  useEffect(() => {
    if (loginUser?.email) {
      setUserInputInfo({
        firstName: loginUser.firstName || "",
        lastName: loginUser.lastName || "",
        email: loginUser.email || "",
        address: loginUser.address || "",
        dob: loginUser.dob || "",
        adminRole: loginUser?.adminRole || "",
        phone: loginUser?.phone || "",
        alternatePhone: loginUser?.alternatePhone || "",
        fatherName: loginUser?.fatherName || "",
        motherName: loginUser?.motherName || "",
      });
      setIsAdminRegister(loginUser?.adminRole === "principal");
      setChangedDob(
        loginUser?.dob
          ? format(
              parse(loginUser?.dob, "dd-MM-yyyy", new Date()),
              "yyyy-MM-dd",
            )
          : format(
            parse("01-01-1970", "dd-MM-yyyy", new Date()),
            "yyyy-MM-dd",
          ),
      );
    }
  }, [loginUser]);
  const [isAdminRegister, setIsAdminRegister] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({
      type: "apiRequest",
      payload: {
        url: `user/update`,
        method: "POST",
        onSuccess: "users/saveUserDetails",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "saveUserDetails",
        body: { userInfo: { ...userInputInfo } },
      },
    });
  };

  // const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  // const [otpValue, setOtpValue] = useState<string>("");

  // const handleOtpSend = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   console.log('phone', userInputInfo?.phone);
  //   const response = await dispatch({
  //     type: "apiRequest",
  //     payload: {
  //       url: `user/send-otp`,
  //       method: "POST",
  //       onSuccess: "users/sendProfilePhoneOtp",
  //       onError: "GLOBAL_MESSAGE",
  //       dispatchType: "sendProfilePhoneOtp",
  //       body: { 
  //         phone: userInputInfo?.phone
  //       },
  //     },
  //   });
  //   console.log({response});
  //   if(response?.isOtpSent) {
  //     setIsOtpSent(true);
  //   }
  // };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserInputInfo({
      ...userInputInfo,
      [name]: value,
    });
  };

  const [changedDob, setChangedDob] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    if (date) {
      new Date(date.year, date.month - 1, date.day);
      const formattedDate = format(date, "dd-MM-yyyy");

      setUserInputInfo({
        ...userInputInfo,
        dob: formattedDate,
      });
    }
  };

  const adminRoles = [
    { key: "principal", label: "Principal" },
    { key: "teacher", label: "Teacher" },
    { key: "staff", label: "Staff" },
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
        <h2 className="font-bold">Personal details</h2>
        <hr className="w-full" />
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            label="First name"
            labelPlacement="outside"
            name="firstName"
            placeholder="Enter your firstname"
            type="text"
            value={userInputInfo?.firstName}
            onChange={handleChange}
          />
          <Input
            className="text-left ml-2"
            errorMessage="Error message"
            label="Last name"
            labelPlacement="outside"
            name="lastName"
            placeholder="Enter your lastname"
            type="text"
            value={userInputInfo?.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between w-full">
          <Input
            disabled
            description="Email can't be update. If require, contact to management."
            errorMessage="Error message"
            label="Email"
            labelPlacement="outside"
            name="email"
            placeholder=" "
            type="text"
            value={userInputInfo?.email}
          />
        </div>
        <div className={`flex justify-between ${isAdminRegister ? 'w-full' : ''}`}>
          {isAdminRegister ? (
            <div className="flex justify-between w-full">
              <Select
                className="w-full mr-2"
                defaultSelectedKeys={[userInputInfo?.adminRole]}
                label="Role"
                labelPlacement="outside"
                name="adminRole"
                placeholder="Select role"
                onChange={handleChange}
              >
                {adminRoles.map((role) => (
                  <SelectItem key={role.key}>{role.label}</SelectItem>
                ))}
              </Select>
            </div>
          ) : null}
          {changedDob ? (
            <DatePicker
              showMonthAndYearPickers
              className="text-left"
              defaultValue={
                changedDob ? parseDate(changedDob) : parseDate("1970-01-24")
              }
              granularity="day"
              label="Birth date"
              labelPlacement="outside"
              name="dob"
              onChange={(value) => {
                handleDateChange(
                  value
                    ? new Date(value.year, value.month - 1, value.day)
                    : null,
                );
              }}
            />
          ) : null}
        </div>
        {!userInputInfo?.adminRole ?
        (<>
          <h2 className="font-bold">Parent details</h2>
          <hr className="w-full" />
          <div className="flex justify-between w-full">
            <Input
              errorMessage="Error message"
              label="Father's name"
              labelPlacement="outside"
              name="fatherName"
              placeholder="Enter your father name"
              type="text"
              value={userInputInfo?.fatherName}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between w-full">
            <Input
              className="text-left"
              errorMessage="Error message"
              label="Mother's name"
              labelPlacement="outside"
              name="motherName"
              placeholder="Enter your mother name"
              type="text"
              value={userInputInfo?.motherName}
              onChange={handleChange}
            />
          </div>
          </>) : null}
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            label="Phone"
            labelPlacement="outside"
            name="phone"
            placeholder="93***34***"
            type="text"
            value={userInputInfo?.phone}
            onChange={handleChange}
          />
          <Input
            className="ml-2"
            errorMessage="Error message"
            label="Alternate Phone"
            labelPlacement="outside"
            name="alternatePhone"
            placeholder="0120-**2***"
            type="text"
            value={userInputInfo?.alternatePhone}
            onChange={handleChange}
          />
        </div>
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            label="Address"
            labelPlacement="outside"
            name="address"
            placeholder="Enter your address"
            type="text"
            value={userInputInfo?.address}
            onChange={handleChange}
          />
        </div>
        <div className="w-full flex justify-between">
          <div className="w-full">
            <Button className="w-full" color="primary" type="submit">
              Update
            </Button>
            <Link className="text-sm mt-2" href="#" underline="always">
              Change password
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
