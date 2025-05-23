"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import ProfileUpdateForm from "../ProfileUpdateForm";
import { AppDispatch } from "../../api/store";
import { useParams } from "next/navigation";

export default function ProfilePage() {

    const dispatch = useDispatch<AppDispatch>();
    const params = useParams();
    const { id } = params;

    useEffect(() => {
        dispatch({
        type: "apiRequest",
        payload: {
            url: `user/${id}`,
            method: "GET",
            onSuccess: "users/getUserDetail",
            onError: "GLOBAL_MESSAGE",
            dispatchType: "getUserDetail",
        },
        });
    }, []); // Run only once
  return (
      <div className="grid grid-cols-3 w-full p-4">
        <ProfileUpdateForm />
    </div>
  );
}
