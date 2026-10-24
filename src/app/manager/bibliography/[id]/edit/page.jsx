"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BibliographyEditForm from "@/components/forms/BibliographyEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditBibliographyPage({ params }) {
  const router = useRouter();
  const [bibliography, setBibliography] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/bibliography/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setBibliography(data);
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
        buttonText="Back to Bibliography"
        onBack={() => router.push("/manager/bibliography")}
      />
    );
  }

  if (!bibliography) {
    return (
      <AlertInfo
        message="Bibliography entry not found."
        subMessage=""
        buttonText="Back to Bibliography"
        onBack={() => router.push("/manager/bibliography")}
      />
    );
  }

  return (
    <div style={{ padding: '40px' }}>
      <BibliographyEditForm item={bibliography} id={id} />
    </div>
  );
}