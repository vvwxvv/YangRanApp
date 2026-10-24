"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ArtworkDetailComponentPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the artwork list page
    router.push("/manager/artwork");
  }, [router]);

  return null; // This component doesn't render anything
}
