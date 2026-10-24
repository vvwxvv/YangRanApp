"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RedirectPageProps {
  page_url: string;
}

const RedirectPage: React.FC<RedirectPageProps> = ({ page_url }) => {
  const router = useRouter();

  useEffect(() => {
    router.push(page_url);
  }, [router, page_url]);

  return null;
};

export default RedirectPage;