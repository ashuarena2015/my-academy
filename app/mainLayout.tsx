"use client";

import { FC, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./api/store";

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loginUser } = useSelector((state: RootState) => state.users);
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch({
            type: "apiRequest",
            payload: {
              url: `user/counter`,
              method: "GET",
              onSuccess: "users/usersCounter",
              onError: "GLOBAL_MESSAGE",
              dispatchType: "usersCounter"
            },
          });
    }, []);

    const isUserExist = Object.keys(loginUser)?.length;
    return (
        <div className="flex w-full justify-start">
            {isUserExist ? <div className="w-9" style={{ width: "350px" }}>
                <SideBar />
            </div> : null }
            <div className="w-full relative bg-zinc-50 min-h-screen">
                {isUserExist ? <Navbar /> : null }
                <main className="w-full p-4 pt-8 col-span-5">                    
                    <div className="p-2 rounded-xl border-">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default MainLayout;
