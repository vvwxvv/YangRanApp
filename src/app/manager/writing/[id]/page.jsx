"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WritingPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the writing list page
    router.push("/manager/writing");
  }, [router]);

  return null; // This component doesn't render anything
}
