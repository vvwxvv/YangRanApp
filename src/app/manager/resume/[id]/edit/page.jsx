"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResumeEditForm from "@/components/forms/ResumeEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditResumePage({ params }) {
  const router = useRouter();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/resume/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setResume(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return <LoadingLayer isLoading={isLoading} />;
  }

  if (error) {
    return (
      <AlertInfo
        message={error}
        subMessage=""
        buttonText="Back to Resume"
        onBack={() => router.push("/manager/resume")}
      />
    );
  }

  if (!resume) {
    return (
      <AlertInfo
        message="Resume entry not found."
        subMessage=""
        buttonText="Back to Resume"
        onBack={() => router.push("/manager/resume")}
      />
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <ResumeEditForm item={resume} id={id} />
    </div>
  );
}
