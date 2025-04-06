"use client";

import { FC, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "./api/store";

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
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

    return (
        <div className="flex w-full justify-start">
            <div className="w-9" style={{ width: "350px" }}>
                <SideBar />
            </div>
            <div className="w-full relative bg-zinc-50 min-h-screen">
                <Navbar />
                <main className="w-full p-5 pt-2 col-span-5">
                    <div className="mt-10 p-5 rounded-xl border-">{children}</div>
                </main>
            </div>
        </div>
    )
}

export default MainLayout;
