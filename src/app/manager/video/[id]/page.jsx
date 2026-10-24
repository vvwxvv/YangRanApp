"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VideoPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the video list page
    router.push("/manager/video");
  }, [router]);

  return null; // This component doesn't render anything
}
