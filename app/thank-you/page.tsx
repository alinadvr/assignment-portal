"use client";

import dynamic from "next/dynamic";

// for localstorage usage
const SubmittedData = dynamic(() => import("@/features/SubmittedData"), {
  ssr: false,
});

export default function ThankYouPage() {
  return <SubmittedData />;
}
