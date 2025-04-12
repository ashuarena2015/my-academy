"use client";

import { FC } from "react";
import StudentsList from "./studentsList";

const StudentsPage: FC = () => {
    return (
        <div className="p-6 shadow-lg bg-white">
            <StudentsList />
        </div>
    )
}

export default StudentsPage;
