"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SeriesEditForm from "@/components/forms/SeriesEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditSeriesPage({ params }) {
  const router = useRouter();
  const [series, setSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/series/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setSeries(data);
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
        buttonText="Back to Series"
        onBack={() => router.push("/manager/series")}
      />
    );
  }

  if (!series) {
    return (
      <AlertInfo
        message="Series entry not found."
        subMessage=""
        buttonText="Back to Series"
        onBack={() => router.push("/manager/series")}
      />
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <SeriesEditForm item={series} id={id} />
    </div>
  );
}
