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

import { RootState, AppDispatch } from "../api/store";
import { academicSessions, classes } from './common';

import ImageUploader from '../components/imageUploader/imageUploader';
import IDCard from "./IdCard";

interface LoginUser {
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    dob?: string;
    userType?: string;
    phone?: number;
    alternatePhone?: number;
    fatherName?: string;
    motherName?: string;
    doa?: string;
    admission_class?: string;
    class_current?: string;
    academic_session?: string;
    adminRole?: string;
    userId?: string;
    designation?: string;
}

const ProfileUpdateForm = ({ loginUser }: { loginUser: LoginUser }) => {

    const dispatch = useDispatch<AppDispatch>();

    interface UserInputInfo {
        firstName: string;
        lastName: string;
        email: string;
        dob: string;
        address?: string; // Added the address property
        userType: string;
        phone: number;
        alternatePhone: number;
        fatherName?: string; // Added the fatherName property
        motherName?: string; // Added the motherName property,
        doa: string;
        admission_class: string;
        class_current: string;
        academic_session: string;
        adminRole: string;
        designation: string
    }

    const [userInputInfo, setUserInputInfo] = useState<UserInputInfo>({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        dob: "",
        userType: "",
        phone: 0,
        alternatePhone: 0,
        fatherName: "",
        motherName: "",
        doa: "",
        admission_class: "",
        class_current: "",
        academic_session: "",
        adminRole: "",
        designation: ""
    });

  const [prefilledInfo, setPrefilledInfo] = useState<boolean>(false);

  useEffect(() => {
    if (loginUser?.email) {
      setUserInputInfo({
        firstName: loginUser.firstName || "",
        lastName: loginUser.lastName || "",
        email: loginUser.email || "",
        address: loginUser.address || "",
        dob: loginUser.dob || "",
        userType: loginUser?.userType || "",
        phone: loginUser?.phone || 0,
        alternatePhone: loginUser?.alternatePhone || 0,
        fatherName: loginUser?.fatherName || "",
        motherName: loginUser?.motherName || "",
        doa: loginUser?.doa || "",
        admission_class: loginUser?.admission_class || "",
        class_current: loginUser?.class_current || "",
        academic_session: loginUser?.academic_session || "",
        adminRole: loginUser?.adminRole || "",
        designation: loginUser?.designation || "",
      });
      setChangedDob(
        loginUser?.dob
          ? parse(loginUser?.dob, "dd-MM-yyyy", new Date())
          : parse("01-01-1970", "dd-MM-yyyy", new Date()),
      );
      setChangedDoa(
        loginUser?.doa
          ? parse(loginUser?.doa, "dd-MM-yyyy", new Date())
          : parse("01-01-1970", "dd-MM-yyyy", new Date()),
      );
      setPrefilledInfo(true);
    }
  }, [loginUser, prefilledInfo]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log({userInputInfo});
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setUserInputInfo({
      ...userInputInfo,
      [name]: value,
    });
  };

  const [changedDob, setChangedDob] = useState<Date | undefined>(undefined);
  const [changedDoa, setChangedDoa] = useState<Date | undefined>(undefined);

  const handleDateChange = (date: Date | null, name: string) => {
    if (date) {
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const formattedDate = format(date, "dd-MM-yyyy");

      setUserInputInfo({
        ...userInputInfo,
        [name]: formattedDate,
      });
    }
  };

  const userTypes = [
    { key: "principal", label: "Principal" },
    { key: "teacher", label: "Teacher" },
    { key: "staff", label: "Staff" },
    { key: "student", label: "Student" },
  ];

  const formInputValidate = (value: string, msg: string) => {
    if(!value?.length) return msg;
  }

  const getInputField = ({ name, errorMessage, placeholder, isDisabled, type, label, classNames }: { name: string; errorMessage: string; placeholder: string; type: string; label: string; classNames?: string; isDisabled: boolean; }) => {
    return (
      <Input
        isDisabled={isDisabled}
        isRequired
        className={classNames}
        label={label}
        labelPlacement="outside"
        name={name}
        placeholder={placeholder}
        type={type}
        value={userInputInfo?.[name as keyof UserInputInfo] !== undefined ? String(userInputInfo[name as keyof UserInputInfo]) : undefined}
        onChange={(e) => handleChange(e)}
        validate={(value) => formInputValidate(value, errorMessage) as true | string | null | undefined}
      />
    )
  }

  const getSelectField = ({ name, placeholder, label, classNames, options }: { name: string; placeholder: string; label: string; classNames?: string; options: { key: string; label: string; }[]; }) => {
    return (
      <Select
        className={classNames}
        defaultSelectedKeys={[userInputInfo[name as keyof UserInputInfo]].filter(Boolean) as string[]}
        label={label}
        labelPlacement="outside"
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
      >
        {options.map((data) => (
          <SelectItem key={data.key}>{data.label}</SelectItem>
        ))}
      </Select>
    )
  }

  const getDatePicker = ({ name, label, classNames, defaultValue }: { name: string; placeholder: string; label: string; classNames?: string; defaultValue?: string; }) => {
    return (
      <DatePicker
        showMonthAndYearPickers
        className={classNames}
        defaultValue={
          defaultValue ? parseDate(defaultValue) : parseDate("1970-01-24")
        }
        granularity="day"
        label={label}
        labelPlacement="outside"
        name={name}
        onChange={(value) => {
          handleDateChange(
            value
              ? new Date(value.year, value.month - 1, value.day)
              : null,
              name
          );
        }}
      />
    )
  }
    return (
        <>
            <div className="col-span-2">
                <Form validationBehavior="aria">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h2 className="font-bold pb-2">Personal details</h2>
                            <hr className="w-full" />
                            <div className="grid gap-4 mt-4">
                                <div className="flex justify-between w-full">
                                    {getInputField({ name: "firstName", errorMessage: "Please enter first name", placeholder: "Enter your firstname", type: "text", label: "First name", isDisabled: false })}
                                    {getInputField({ name: "lastName", errorMessage: "Please enter last name", placeholder: "Enter your lastname", type: "text", label: "Last name", classNames: "ml-2", isDisabled: false })}
                                </div>
                                <div className="flex justify-between w-full">
                                    {getInputField({ name: "email", errorMessage: "Please enter email", placeholder: "Enter your email", type: "email", label: "email", isDisabled: true })}
                                </div>
                                {userInputInfo?.userType !== "student" && <div className="flex justify-between w-full">
                                    {getInputField({ name: "designation", errorMessage: "Please enter designation", placeholder: "Enter your designation", type: "text", label: "Designation", classNames: "", isDisabled: false })}
                                </div>}
                                <div className="flex justify-between w-full">
                                    {getInputField({ name: "phone", errorMessage: "Please enter phone", placeholder: "Enter your phone", type: "number", label: "Phone", isDisabled: false })}
                                    {getInputField({ name: "alternatePhone", errorMessage: "Please enter Alternate Phone", placeholder: "Enter your alternate Phone", type: "number", label: "Alternate Phone", classNames: "ml-2", isDisabled: false })}
                                </div>
                                <div className="flex justify-between w-full">
                                    {getInputField({ name: "address", errorMessage: "Please enter address", placeholder: "Enter your Address", type: "text", label: "Address", isDisabled: false })}
                                </div>
                                <div className="flex justify-between">
                                    {getDatePicker({ name: "dob", label: "Birth date", placeholder: "Select your birth date", classNames: "text-left w-1/2", defaultValue: changedDob ? format(changedDob, "yyyy-MM-dd") : "" })}
                                </div>
                                {userInputInfo?.userType === 'student' ?
                                    <>
                                        <h2 className="font-bold mt-2">Academic details</h2>
                                        <hr className="w-full" />
                                        <div className="flex">
                                            {getSelectField({ name: "admission_class", placeholder: "Select", label: "Admission class", classNames: "w-full", options: classes() })}
                                            {getDatePicker({ name: "doa", label: "Admission date", placeholder: "Select your Admission date", classNames: "text-left ml-2", defaultValue: changedDoa ? format(changedDoa, "yyyy-MM-dd") : "" })}
                                        </div>
                                        <div className="flex justify-between w-full">
                                            {getSelectField({ name: "class_current", placeholder: "Select", label: "Current class", classNames: "w-full", options: classes() })}
                                            {getSelectField({ name: "academic_session", placeholder: "Select", label: "Academic session", classNames: "w-full ml-2", options: academicSessions() })}
                                        </div>
                                    </> : null}
                            </div>
                        </div>
                        <div>
                            {userInputInfo?.userType === 'student' ?
                                (<>
                                    <h2 className="font-bold pb-2">Parent details</h2>
                                    <hr className="w-full" />
                                    <div className="grid gap-4">
                                        <div className="flex justify-between w-full mt-4">
                                            {getInputField({ name: "fatherName", errorMessage: "Please enter father name", placeholder: "Enter your father name", type: "text", label: "Father's name", isDisabled: false })}
                                        </div>
                                        <div className="flex justify-between w-full">
                                            {getInputField({ name: "motherName", errorMessage: "Please enter mother name", placeholder: "Enter your mother name", type: "text", label: "Mother's name", isDisabled: false })}
                                        </div>
                                    </div>
                                </>) : null}
                        </div>
                    </div>
                    <div className="flex w-auto mt-8">
                        <Button color="primary" onClick={(e) => { e.preventDefault(); handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>); } }>
                            Update
                        </Button>
                        <Link className="text-sm whitespace-nowrap ml-4" href="#" underline="always">
                            Change password
                        </Link>
                    </div>
                </Form>
            </div>
            <div className="col-span-1 ml-4">
                <IDCard details={loginUser || []} />
                <ImageUploader userId={loginUser?.userId || ""} btnTitle="change profile image" />
            </div>
        </>
    )
}

export default ProfileUpdateForm;