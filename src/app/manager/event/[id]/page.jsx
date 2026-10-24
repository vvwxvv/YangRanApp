"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EventPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the event list page
    router.push("/manager/event");
  }, [router]);

  return null; // This component doesn't render anything
}
