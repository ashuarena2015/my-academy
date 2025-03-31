"use client";
import { Card, CardHeader, CardBody, Image } from "@heroui/react";
import { FC } from "react";

interface UserProfile {
  photo: string;
  userInputInfo: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

const ProfilePreview: FC<UserProfile> = ({ photo, userInputInfo }) => {
  return (
    <Card className="py-1 m-auto mb-5">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
        <p className="text-tiny uppercase font-bold">
          {userInputInfo.firstName} {userInputInfo.lastName}
        </p>
        <small className="text-default-500">{userInputInfo.email}</small>
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src={photo}
          width={270}
        />
      </CardBody>
    </Card>
  );
};

export default ProfilePreview;
