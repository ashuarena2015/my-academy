"use client";

import React, { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";
import {
    Divider,
    Image,
    Avatar,
    Skeleton,
    Card,
    CardBody,
    Input
} from "@heroui/react";
import FeeTableList from "../../fee/feeTable";
import IDCard from "../../profile/IdCard";
import ImageUploader from '../../components/imageUploader/imageUploader';

const StudentDetails: FC = () => {

    const dispatch = useDispatch();
    const { currentUser, loginUser: { userType: loginUserType } = {}  } = useSelector((state: any) => state.users);

    const params = useParams();
    const { id } = params;

    useEffect(() => {
        dispatch({
        type: "apiRequest",
        payload: {
            url: `user/${id}`,
            method: "GET",
            onSuccess: "users/getUserDetail",
            onError: "GLOBAL_MESSAGE",
            dispatchType: "getUserDetail",
        },
        });
    }, []); // Run only once

    const getIcon = (type: string) => {
        switch (type) {
            case "parent":
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
              ;
            case "phone":
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
              ;
            case "address":
                return <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              ;
            default:
                return "";
        }
    }

    const profilePhoto = currentUser?.profilePhoto ? `http://localhost:3001/uploads/${currentUser?.profilePhoto}` : `http://localhost:3001/uploads/default-avatar.png`;

    return (
        <div className="w-full grid grid-cols-5 gap-4">
            <div className="col-span-3">
                {!currentUser?.firstName
                ? (
                    <div className="max-w-[300px] w-full flex items-center gap-3 mb-5">
                        <div>
                            <Skeleton className="flex rounded-full w-20 h-20" />
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <Skeleton className="h-8 rounded-lg" />
                            <Skeleton className="h-2 w-3/5 rounded-lg" />
                            <Skeleton className="h-2 w-4/5 rounded-lg" />
                        </div>
                    </div>
                )
                : (
                    <div className="flex gap-3 mb-5 align-center">
                        <div className="text-center">
                            <Image
                                alt="heroui logo"
                                height={80}
                                radius="sm"
                                src={profilePhoto}
                                width={80}
                                className="rounded-full border-default-200 mb-1"
                            />                        
                            {loginUserType !== 'student' ? <ImageUploader userId={currentUser?.userId} /> : null}
                        </div>
                        <div className="flex flex-col justify-center">
                            <p className="text-2xl">{currentUser?.firstName} {currentUser?.lastName}</p>
                            <p className="text-small text-default-500">{currentUser?.email}</p>
                            <p className="text-small text-default-500">{currentUser?.class_current}</p>
                        </div>
                    </div>
                )}
                <Divider />
                <div className="py-5">
                    <div className="flex justify-between gap-4">
                        <div className="flex gap-4">
                            <div>
                                <Avatar
                                    showFallback
                                    fallback={getIcon('parent')}
                                    color="secondary"
                                    size="lg"
                                />
                            </div>
                            <div className="text-sm">
                                <p className="text-default-500">Parents</p>
                                <p>{currentUser?.fatherName}, {currentUser?.motherName}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <Avatar
                                    showFallback
                                    fallback={getIcon('phone')}
                                    color="success"
                                    size="lg"
                                />
                            </div>
                            <div className="text-sm">
                                <p className="text-default-500">Phone</p>
                                <p>{currentUser?.phone}, {currentUser?.alternatePhone}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <Avatar
                                    showFallback
                                    fallback={getIcon('address')}
                                    color="warning"
                                    size="lg"
                                />
                            </div>
                            <div className="text-sm">
                                <p className="text-default-500">Address</p>
                                <p>{currentUser?.address}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <Divider />
                {loginUserType !== 'student' ?
                <div className="mt-4">
                    <FeeTableList />
                </div> : null }
                {/* <div className="py-5">
                    <p className="text-lg font-semibold mb-2">Fee details</p>
                    <FeeTableList feeAllDetails={currentUser?.payments || []} />
                </div> */}
                {/* <div>
                    <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui">
                    Visit source code on GitHub.
                    </Link>
                </div> */}
            </div>
            <div className="col-span-2">
                <IDCard details={currentUser || []} />
            </div>
        </div>
    )
}

export default StudentDetails;
