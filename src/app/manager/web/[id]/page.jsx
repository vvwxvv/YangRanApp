"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function WebPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the web list page
    router.push("/manager/web");
  }, [router]);

  return null; // This component doesn't render anything
}
