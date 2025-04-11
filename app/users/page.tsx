"use client";

import { FC } from "react";
import UsersList from "./usersList";

const UsersPage: FC = () => {
    return (
        <div>
            <UsersList userTypeProp="defaultType" noTableWrapper={false} />
        </div>
    )
}

export default UsersPage;

