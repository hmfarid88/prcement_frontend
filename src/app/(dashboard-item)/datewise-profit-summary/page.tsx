"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ProfitLossAccount from "@/app/components/ProfitLossAccount";

const Page = () => {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  return (
    <ProfitLossAccount
      endpoint="/finance/profit-loss-account"
      query={{ from: startDate, to: endDate }}
      period={`${startDate ?? "—"} TO ${endDate ?? "—"}`}
    />
  );
};

export default Page;
