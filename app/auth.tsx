"use client";

import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { RootState } from "./api/store";

import { AppDispatch } from "./api/store";

const Auth: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { loginUser, isLoading } = useSelector((state: RootState) => state.users, (prev, next) => prev === next);
  
  useEffect(() => {
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
        console.log({response2: response});
        if(!isLoading && !loginUser?.email) {
            console.log('sadsdasdsad');
            router.replace('/login')
        } else {
            if(pathname === '/login') {
                router.replace('/dashboard')
            }
        }
      };
      fetchData();
  }, []);

  return <></>;
};

export default Auth;
