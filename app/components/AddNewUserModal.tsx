import React, { FC, useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  useDisclosure,
  Link,
  Form,
  Input,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { classes } from "../profile/common";

import { RootState, AppDispatch } from "../api/store";

interface AddNewUserProps {
  title: string;
  userTypeForm: string;
}
  
const AddNewUser: FC<AddNewUserProps> = ({ title, userTypeForm }) => {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const { branches } = useSelector((state: RootState) => state.global);

  const [addUserInfo, setAddUserInfo] = useState({
      userType: userTypeForm
  })

  const userTypeRoles = [
    { key: "principal", label: "Principal" },
    { key: "teacher", label: "Teacher" },
    { key: "staff", label: "Staff" },
    { key: "student", label: "Student" },
  ];
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleChange = (e: any) => {
    setAddUserInfo({
          ...addUserInfo,
          [e.target.name]: e.target.value
      })
  }

  const handleSubmit = async () => {
      const response = (await dispatch({
          type: "apiRequest",
          payload: {
            url: `user/register`,
            method: "POST",
            onSuccess: "users/addNewUserModal",
            onError: "GLOBAL_MESSAGE",
            dispatchType: "addNewUserModal",
            body: { userInfo: { ...addUserInfo } },
          },
      })) as unknown as { isUserAdd?: { userId: string }  };


      if(response?.isUserAdd)  {
          router.push(`/profile/${response.isUserAdd.userId}`);
          return true;
      }
  }

  
  return (
      <>
      <Link as="button" size="sm" underline="always" onPress={onOpen}>{title}</Link>
      <Drawer isOpen={isOpen} onOpenChange={onOpenChange}>
        <DrawerContent>
          {(onClose) => (
            <>
              <DrawerHeader className="flex flex-col gap-1">{title}</DrawerHeader>
              <DrawerBody>
                  <Form className="gap-4">
                      {userTypeForm === "student" ? (
                        <>
                          <Select className="w-full" name="branch" label="Select branch" labelPlacement="outside" placeholder="Select branch" onChange={handleChange}>
                            {branches.map((list, index) => (
                                <SelectItem key={list._id}>{list?.branch}</SelectItem>
                            ))}
                          </Select>
                          <Select className="w-full" name="class_current" label="Select class" labelPlacement="outside" placeholder="Select class" onChange={handleChange}>
                            {classes().map((classItem) => (
                                <SelectItem key={classItem.key} textValue={classItem.label}>
                                    {classItem.label}
                                </SelectItem>
                            ))}
                          </Select>
                        </>)
                      :
                      <Select className="w-full" name="userType" label="Select role" labelPlacement="outside" placeholder="Select role" onChange={handleChange}>
                          {userTypeRoles.map((role, index) => (
                              <SelectItem key={role.key}>{role?.label}</SelectItem>
                          ))}
                      </Select> }
                      <Input
                          errorMessage="Error message"
                          label="Email"
                          labelPlacement="outside"
                          name="email"
                          placeholder="student@school.com"
                          type="email"
                          onChange={handleChange}
                      />
                      <Input
                          errorMessage="Error message"
                          label="Password"
                          labelPlacement="outside"
                          name="password"
                          placeholder="******"
                          type="password"
                          onChange={handleChange}
                      />
                      </Form>
              <div className="flex justify-center items-top gap-2 mt-5 text-slate-500">
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <p className="text-sm">
                      After successfull registration, this will be redirected to complete profile section.
                  </p>
              </div>
              </DrawerBody>
              <DrawerFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onClick={handleSubmit}>
                  Action
                </Button>
              </DrawerFooter>
            </>
          )}
        </DrawerContent>
      </Drawer>
      </>
  );
}

export default AddNewUser;