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
import { academicSessions, classes } from './common';

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
    userType: string;
    phone: string;
    alternatePhone: string;
    fatherName?: string; // Added the fatherName property
    motherName?: string; // Added the motherName property,
    admission_session:  string;
    doa: string;
  }

  const [userInputInfo, setUserInputInfo] = useState<UserInputInfo>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    dob: "",
    userType: "",
    phone: "",
    alternatePhone: "",
    fatherName: "",
    motherName: "",
    admission_session: "",
    doa: ""
  });

  useEffect(() => {
    if (loginUser?.email) {
      setUserInputInfo({
        firstName: loginUser.firstName || "",
        lastName: loginUser.lastName || "",
        email: loginUser.email || "",
        address: loginUser.address || "",
        dob: loginUser.dob || "",
        userType: loginUser?.userType || "",
        phone: loginUser?.phone || "",
        alternatePhone: loginUser?.alternatePhone || "",
        fatherName: loginUser?.fatherName || "",
        motherName: loginUser?.motherName || "",
        admission_session: loginUser?.admission_session || "",
        doa: loginUser?.doa || ""
      });
      setIsAdminRegister(loginUser?.userType === "principal");
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
      setChangedDoa(
        loginUser?.doa
          ? format(
              parse(loginUser?.doa, "dd-MM-yyyy", new Date()),
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setUserInputInfo({
      ...userInputInfo,
      [name]: value,
    });
  };

  const [changedDob, setChangedDob] = useState<Date | null>(null);
  const [changedDoa, setChangedDoa] = useState<Date | null>(null);

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

  const userTypes = [
    { key: "principal", label: "Principal" },
    { key: "teacher", label: "Teacher" },
    { key: "staff", label: "Staff" },
    { key: "student", label: "Student" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <div>
            <h2 className="font-bold pb-2">Personal details</h2>
            <hr className="w-full" />
            <div className="grid gap-4 mt-4">
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
              <div className={`flex justify-between ${isAdminRegister ? 'w-full' : ''}`}>
                {isAdminRegister ? (
                  <div className="flex justify-between w-full">
                    <Select
                      className="w-full mr-2"
                      defaultSelectedKeys={[userInputInfo?.userType]}
                      label="User type"
                      labelPlacement="outside"
                      name="userType"
                      placeholder="Select role"
                      onChange={handleChange}
                    >
                      {userTypes.map((role) => (
                        <SelectItem key={role.key}>{role.label}</SelectItem>
                      ))}
                    </Select>
                  </div>
                ) : null}
                {changedDob ? (
                  <DatePicker
                    showMonthAndYearPickers
                    className="text-left w-1/2"
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
              <h2 className="font-bold mt-2">Academic details</h2>
              <hr className="w-full" />
              <div className="flex">
                <Select
                  className="w-full"
                  defaultSelectedKeys={[userInputInfo?.admission_class]}
                  label="Admission class"
                  labelPlacement="outside"
                  name="admission_class"
                  placeholder="Select"
                  onChange={handleChange}
                >
                  {classes().map((data) => (
                    <SelectItem key={data.key}>{data.label}</SelectItem>
                  ))}
                </Select>
                <DatePicker
                  showMonthAndYearPickers
                  className="text-left ml-2"
                  defaultValue={
                    changedDoa ? parseDate(changedDoa) : parseDate("1970-01-24")
                  }
                  granularity="day"
                  label="Admission date"
                  labelPlacement="outside"
                  name="doa"
                  onChange={(value) => {
                    handleDateChange(
                      value
                        ? new Date(value.year, value.month - 1, value.day)
                        : null,
                    );
                  }}
                />
              </div>
              <div className="flex justify-between w-full">
                <Select
                  className="w-full"
                  defaultSelectedKeys={[userInputInfo?.class_current]}
                  label="Current class"
                  labelPlacement="outside"
                  name="class_current"
                  placeholder="Select"
                  onChange={handleChange}
                >
                  {classes().map((data) => (
                    <SelectItem key={data.key}>{data.label}</SelectItem>
                  ))}
                </Select>
                <Select
                  className="w-full ml-2"
                  defaultSelectedKeys={[userInputInfo?.academic_session]}
                  label="Academic session"
                  labelPlacement="outside"
                  name="academic_session"
                  placeholder="Select"
                  onChange={handleChange}
                >
                  {academicSessions().map((role) => (
                    <SelectItem key={role.key}>{role.label}</SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </div>
          <div>
            {!userInputInfo?.userType ?
            (<>
              <h2 className="font-bold pb-2">Parent details</h2>
              <hr className="w-full" />
              <div className="grid gap-4">
                <div className="flex justify-between w-full mt-4">
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
              </div>
              </>) : null}
          </div>
      </div>
      <div className="grid grid-cols-2 justify-between mt-8">
        <div className="col-span-1">
          <Button className="w-full" color="primary" onClick={handleSubmit}>
            Update
          </Button>
          <Link className="text-sm mt-2" href="#" underline="always">
            Change password
          </Link>
        </div>
        <div className="col-span-1" />
      </div>
    </div>
  );
}
