"use client";

import { FC } from "react";
import UsersList from "./usersList";

const UsersPage: FC = () => {
    return (
        <div className="p-6 shadow-lg bg-white">
            <UsersList userTypeProp="defaultType" noTableWrapper={false} />
        </div>
    )
}

export default UsersPage;

