"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ExhibitionPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the exhibition list page
    router.push("/manager/exhibition");
  }, [router]);

  return null; // This component doesn't render anything
}
