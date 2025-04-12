"use client";

import React, { useEffect, useCallback } from "react";

import FeeTableList from "./feeTable";

export default function FeePage() {

  return (
    <div className="p-6 shadow-lg bg-white">
      <FeeTableList />
    </div>
  );
}
