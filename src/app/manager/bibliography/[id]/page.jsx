"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BibliographyDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the about list page
    router.push("/manager/bibliography");
  }, [router]);

  return null; // This component doesn't render anything
}
