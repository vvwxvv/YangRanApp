"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumeDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the resume list page
    router.push("/manager/resume");
  }, [router]);

  return null; // This component doesn't render anything
}
