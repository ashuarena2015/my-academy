"use client";

import React, { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";

import { AppDispatch, RootState } from "../api/store";

import FeeTableList from "./feeTable";

import { useSelector } from "react-redux";

export default function FeePage() {
  const dispatch = useDispatch<AppDispatch>();

  const { feeAllDetails } = useSelector((state: RootState) => state.fee);

  const fetchData = useCallback(() => {
    dispatch({
      type: "apiRequest",
      payload: {
        url: `fee`,
        method: "POST",
        onSuccess: "getAllFeeDetails",
        onError: "GLOBAL_MESSAGE",
        dispatchType: "getAllFeeDetails",
        body: {
          class: "REC-A",
          startDate: "2024-04-01",
          endDate: "2025-03-31",
        },
      },
    });
  }, []); // Ensure fetchData doesn't change on re-renders

  useEffect(() => {
    fetchData();
  }, []); // Run only once

  return (
    <div>
      <FeeTableList feeAllDetails={feeAllDetails} />
    </div>
  );
}
