"use client";

import { Spinner } from "@heroui/react";
import { FC, useEffect } from "react";
import SideBar from "@/components/sidebar";
import { Navbar } from "@/components/navbar";
import { useSelector } from "react-redux";
import { useRouter, usePathname} from "next/navigation";
import { RootState } from "./api/store";

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
    const { loginUser, isLoading } = useSelector((state: RootState) => state.users, (prev, next) => prev === next);
    const router = useRouter();
    const pathname = usePathname();
    useEffect(() => {
        if(!isLoading && !loginUser?.email) {
            router.replace('/login')
        } else {
            if(pathname === '/') {
                router.replace('/dashboard')
            }
        }
    }, [loginUser, isLoading]);

    return (
        <div className="flex w-full justify-start h-screen">
            <div className="w-96" style={{ width: "350px" }}>
                <SideBar />
            </div>
            <div className="w-full grid grid-cols-5 relative">
                <main className="w-full p-5 pt-2 col-span-5">
                    <Navbar />
                    <div className="mt-10 pl-5 pr-5">{children}</div>
                </main>
                {/* <div className="col-span-1 bg-slate-600">Right Side</div> */}
            </div>
        </div>
    )
}

export default MainLayout;
