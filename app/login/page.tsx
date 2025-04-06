"use client";

import React, { useState } from "react";
import { Form, Input, Button, RadioGroup, Radio } from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';

import AlertMessage from "../components/alert";
import { RootState, AppDispatch } from "../api/store";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const globalMessage = useSelector((state: RootState) => state.global);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const response = await dispatch({
      type: "apiRequest",
      payload: {
        url: `user/login`,
        method: "POST",
        onSuccess: "users/userLogin",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "userLogin",
        body: { userInfo: { ...data } },
      },
    });

    if ((response as any)?.isLogin) {
      router.replace('/dashboard');
    }
  };

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
        <Input
          errorMessage="Error message"
          name="email"
          placeholder="Enter your email"
          type="email"
        />
        <div className="flex justify-between w-full">
          <Input
            errorMessage="Error message"
            name="password"
            placeholder="Enter your password"
            type="password"
          />
        </div>
        <div className="w-full flex justify-between">
          <Button className="w-full" color="primary" type="submit">
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
}
