"use client";
import { Alert } from "@heroui/react";
import { FC } from "react";

interface AlertInfo {
  message: string;
  type: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
}

const AlertMessage: FC<AlertInfo> = ({ message, type }) => {
  return message ? (
    <div className="mb-4">
      <Alert className="text-left" color={type} variant="faded">
        {message}
      </Alert>
    </div>
  ) : null;
};

export default AlertMessage;
