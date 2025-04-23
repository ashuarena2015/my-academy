import React from "react";
// import { InputProps } from "@nextui-org/react";
import { Input } from "@heroui/react";

export const academicSessions = () => {
    return [
        { key: "2023/24", label: "2023/24" },
        { key: "2024/25", label: "2024/25" },
        { key: "2025/26", label: "2025/26" }
    ]
}

export const gender = () => {
    return [
        { key: "Male", label: "Male" },
        { key: "Female", label: "Female" },
    ]
}

export const staffs = () => {
    return [
        { key: "all", label: "All" },
        { key: "admin", label: "Admin" },
        { key: "teacher", label: "Teachers" },
        { key: "staff", label: "Staffs" }
    ]
}


