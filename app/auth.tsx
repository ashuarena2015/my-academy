"use client";

import React, { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useRouter, usePathname } from "next/navigation";

import { AppDispatch } from "./api/store";

const Auth: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  
  const fetchData = async () => {
    const response = await dispatch({
      type: "apiRequest",
      payload: {
        url: `user/auth`,
        method: "GET",
        onSuccess: "getLoginDetails",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getLoginDetails",
      },
    }) as unknown as { isAuth: boolean };
    const { isAuth } = response || {};
    if(isAuth) {
      if(pathname === '/login' || pathname === '/register') {
        router.push('/dashboard');
      }
    } else {
        router.push('/login');
    }
  };

  const fetchSchoolBranches = async () => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `school/branches`,
        method: "GET",
        onSuccess: "getSchoolBranches",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getSchoolBranches",
      },
    }) as unknown as { isAuth: boolean };
  };
  useEffect(() => {
      fetchData();
      fetchSchoolBranches();
  }, []);

  return <></>;
};

export default Auth;
