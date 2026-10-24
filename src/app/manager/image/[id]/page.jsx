"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ImageDetailPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the image list page
    router.push("/manager/image");
  }, [router]);

  return null; // This component doesn't render anything
}
