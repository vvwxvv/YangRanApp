"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AboutEditForm from "@/components/forms/AboutEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditGalleryAboutPage({ params }) {
  const router = useRouter();
  const [about, setAbout] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; // Extract the `id` from the unwrapped params object

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/about/${id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setAbout(data); // Set the fetched data
      } catch (error) {
        setError(error.message); // Set the error message
      } finally {
        setIsLoading(false); // Set loading to false
      }
    };

    fetchData();
  }, [id]); // Re-run the effect if the `id` changes

  // Show loading animation while fetching data
  if (isLoading) {
    return <LoadingLayer isLoading={isLoading} />
  }

  // Show error message if there's an error
  if (error) {
    return (
      <AlertInfo
        message={error}
        subMessage=""
        buttonText="Back to About"
        onBack={() => router.push("/manager/about")}
      />
    );
  }

  // Show a message if no data is found
  if (!about) {
    return (
      <AlertInfo
        message="About not found."
        subMessage=""
        buttonText="Back to About"
        onBack={() => router.push("/manager/about")}
      />
    );
  }

  // Render the edit form with the fetched data
  return (
     <div style={{padding:'40px'}}>
      <AboutEditForm item={about} id={id} />
    </div>
  );
}
