"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SeriesDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the series list page
    router.push("/manager/series");
  }, [router]);

  return null; // This component doesn't render anything
}
