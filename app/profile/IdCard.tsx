import React, { FC, useState, useEffect } from "react";
import { Divider, Image } from "@heroui/react";
import NextImage from "next/image";
import "./idCard.css";

interface IDCardProps {
    details: any;
}

const IDCard: React.FC<IDCardProps> = ({ details }) => {

    const [profilePhotUpdate, setProfilePhotoUpdate] = useState<string>('');

    useEffect(() => {
        if (details?.profilePhoto) {
            setProfilePhotoUpdate(`http://localhost:3001/uploads/${details?.profilePhoto}`);
        } else {
            setProfilePhotoUpdate(`http://localhost:3001/uploads/default-avatar.png`);
        }
    }, [details?.profilePhoto]);

    const fullName = (`${details?.firstName} ${details?.lastName}`)?.toUpperCase();
    
    return (
        <div className="flex">
            <div className="id-card relative z-1 rounded-lg border-1">
                <div className="id-header">
                    <div /><div />
                </div>
                <div className="id-body">
                    <div className="font-bold text-2xl">
                        <Image as={NextImage} src="/logo.png" alt="Logo" className="m-auto" width={'200'} height={'60'} />
                    </div>
                    <div className="w-full id-img">
                        <Image className="rounded-none" removeWrapper={true} src={profilePhotUpdate} />
                    </div>
                    <div className="font-bold mb-4 text-2xl text-center">
                        {fullName}
                        {details?.designation ? <p className="text-sm text-slate-500">{details?.designation.toUpperCase()}</p> : null}
                    </div>
                    <div className="id-details">
                        {details?.userType === 'student' ? <div>
                            <div className="text-sm font-semibold">CLASS</div>
                            <div className="bold">{details?.class_current}</div>
                        </div> : null}
                        <div>
                            <div className="text-sm font-semibold">ID</div>
                            <div className="bold">{details?.userId}</div>
                        </div>
                        <div>
                            <div className="text-sm font-semibold">Blood</div>
                            <div className="bold">{details?.blood_group || 'NA'}</div>
                        </div>
                    </div>
                    <Divider  className="my-2" />
                    <div className="text-xs mt-2">
                        {details?.userType === 'student' ? <p className="font-semibold">{details?.fatherName}, {details?.motherName}</p> : null}
                        <p>Address: {details?.address}</p>
                        <p>Phone: {details?.phone}, {details?.alternatePhone}</p>
                    </div>
                </div>
                <div className="id-footer">
                    <div /><div />
                </div>
            </div>
        </div>
    )
}

export default IDCard;
