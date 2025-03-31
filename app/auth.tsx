"use client";

import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { redirect } from "next/navigation";

import { AppDispatch } from "./api/store";

const Auth: FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getAuthentication = async () => {
      (await dispatch({
        type: "apiRequest",
        payload: {
          url: `user/auth`,
          method: "GET",
          onSuccess: "getLoginDetails",
          onError: "GLOBAL_MESSAGE",
          dispatchType: "getLoginDetails",
        },
      })) as unknown as { isAuth: boolean };

      //   redirect(response?.isAuth ? "/dashboard" : "login");
    };

    getAuthentication();
  }, []);

  return <></>;
};

export default Auth;
