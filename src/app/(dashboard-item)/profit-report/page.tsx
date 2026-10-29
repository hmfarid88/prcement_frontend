
"use client";

import React from "react";
import { useAppSelector } from "@/app/store";
import ProfitLossAccount from "@/app/components/ProfitLossAccount";

export default function ProfitLossPage() {
  const usernameData = useAppSelector(
    (state) => state.username.username
  );

  const username =
    typeof usernameData === "string"
      ? usernameData
      : usernameData?.username ?? "";

  return (
  <div className="container min-h-[calc(100vh-228px)]">
    <ProfitLossAccount username={username ?? ""} />
  </div>
  );
}