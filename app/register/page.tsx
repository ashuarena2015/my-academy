"use client";

import React, {
  useState,
  // useRef
} from "react";
import {
  Form,
  Input,
  Button,
  // Modal,
  // ModalContent,
  // ModalHeader,
  // ModalBody,
  // useDisclosure,
  // DatePicker,
  RadioGroup,
  Radio,
  Select,
  SelectItem,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";

import AlertMessage from "../components/alert";
import { RootState, AppDispatch } from "../api/store";
// import ImageCropper from "../components/imageCropper";

// import ProfilePreview from "./profilePreview";
import "react-image-crop/dist/ReactCrop.css";

export default function RegisterPage() {
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch<AppDispatch>();
  const globalMessage = useSelector((state: RootState) => state.global);

  interface UserInputInfo {
    // firstName: string;
    // lastName: string;
    email: string;
    // city: string;
    // country: string;
    // dob: string;
  }

  const [userInputInfo, setUserInputInfo] = useState<UserInputInfo>({
    // firstName: "",
    // lastName: "",
    email: "",
    // city: "",
    // country: "",
    // dob: "",
  });

  const [isAdminRegister, setIsAdminRegister] = useState<boolean>(false);

  const handleSelectRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdminRegister(e.target.value === "admin");
  };

  // const [showPreview, setShowPreview] = useState(false);
  // const handleShowPreview = () => {
  //   const formElement = document.querySelector(
  //     "#register_form",
  //   ) as HTMLFormElement | null;

  //   if (!formElement) {
  //     return;
  //   }
  //   const formData = new FormData(formElement);
  //   const data = Object.fromEntries(formData.entries());

  //   setUserInputInfo({
  //     // firstName: data.firstName as string,
  //     // lastName: data.lastName as string,
  //     email: data.email as string,
  //     // city: data.city as string,
  //     // country: data.country as string,
  //     // dob: data.dob as string,
  //   });
  //   setShowPreview(true);
  // };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    console.log({data});
    setUserInputInfo({
      // firstName: data.firstName as string,
      // lastName: data.lastName as string,
      email: data.email as string,
      // city: data.city as string,
      // country: data.country as string,
      // dob: data.dob as string,
    });

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

  // const avatarUrl = useRef("");

  // interface UpdateAvatarProps {
  //   imgSrc: string;
  // }

  // const updateAvatar = async (
  //   imgSrc: UpdateAvatarProps["imgSrc"],
  // ): Promise<void> => {
  //   avatarUrl.current = imgSrc;
  //   const formData = new FormData();

  //   if (imgSrc) {
  //     formData.append("avatar", imgSrc);
  //   } else {
  //     console.error("Invalid file type for uploadAvatar");
  //   }

  //   console.log(formData);
  //   try {
  //     dispatch({
  //       type: "apiRequest",
  //       payload: {
  //         url: `user/upload-avatar`,
  //         method: "POST",
  //         onSuccess: "users/userPhotoUpload",
  //         onError: "GLOBAL_MESSAGE",
  //         dispatchType: "userPhotoUpload",
  //         body: formData,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Error uploading file:", error);
  //   }
  // };

  // const [previewProfile, setPreviewProfile] = useState<string | null>(null);
  // const [uploadAvatar, setUploadAvatar] = useState<object>();
  // const handleImageUpload = async (
  //   event: React.ChangeEvent<HTMLInputElement>,
  // ) => {
  //   const file = event.target.files?.[0]; // Get the selected file

  //   if (!file) return;

  //   // Convert file to Data URL for preview
  //   const reader = new FileReader();

  //   reader.onload = () => setPreviewProfile(reader.result as string);
  //   reader.readAsDataURL(file);

  //   // You can also send the file to a backend or process it further
  //   // console.log("Selected file:", file);
  //   setUploadAvatar(file);
  //   onOpen();
  // };

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
        <RadioGroup
          name="user_type"
          orientation="horizontal"
          onChange={handleSelectRole}
        >
          <Radio value="student">Student</Radio>
          <Radio value="admin">Administration</Radio>
        </RadioGroup>
        <Input
          errorMessage="Error message"
          // label="Email"
          // labelPlacement="outside"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            // label="Password"
            // labelPlacement="outside"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
          {/* <DatePicker
            showMonthAndYearPickers
            className="text-left ml-2"
            label="Birth date"
            labelPlacement="outside"
            name="dob"
          /> */}
        </div>
        {isAdminRegister ? (
          <div className="flex justify-between w-full">
            <Select className="w-full" name="role" placeholder="Select role">
              {adminRoles.map((role) => (
                <SelectItem key={role.key}>{role.label}</SelectItem>
              ))}
            </Select>
          </div>
        ) : null}
        {/* <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            label="First name"
            labelPlacement="outside"
            name="firstName"
            placeholder="Enter your first name"
            type="text"
          />
          <Input
            className="ml-2"
            errorMessage="Error message"
            label="Last name"
            labelPlacement="outside"
            name="lastName"
            placeholder="Enter your last name"
            type="text"
          />
        </div>
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            label="City"
            labelPlacement="outside"
            name="city"
            placeholder="Enter your city"
            type="text"
          />
          <Input
            className="ml-2"
            errorMessage="Error message"
            label="Country"
            labelPlacement="outside"
            name="country"
            placeholder="Enter your country"
            type="text"
          />
        </div>
        <div className="text-left">
          <label className="text-sm mb-4 block" htmlFor="image_profile">
            Profile photo:
          </label>
          <input
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:text-xs file:bg-gray-700 file:text-sky-300 hover:file:bg-gray-600"
            id="image_profile"
            name="image_profile"
            type="file"
            onChange={handleImageUpload}
          />
        </div> */}
        {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            {(isOpen) => (
              <>
                <ModalBody>
                  <ImageCropper
                    closeModal={isOpen}
                    previewImage={previewProfile || ""}
                    updateAvatar={updateAvatar}
                  />
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal> */}
        {/* <Modal isOpen={showPreview} onOpenChange={setShowPreview}>
          <ModalContent>
            {() => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Profile preview
                </ModalHeader>
                <ModalBody>
                  <div className="flex mt-2 mb-5">
                    <ProfilePreview
                      photo={avatarUrl.current}
                      userInputInfo={userInputInfo}
                    />
                  </div>
                </ModalBody>
              </>
            )}
          </ModalContent>
        </Modal> */}
        <div className="w-full flex justify-between">
          {/* <div className="w-48">
            <Button
              className="w-full"
              color="primary"
              variant="bordered"
              onPress={handleShowPreview}
            >
              Show Preview
            </Button>
          </div> */}
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
