"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EventEditForm from "@/components/forms/EventEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from '@/components/alerts/AlertInfo';

export default function EditEventPage({ params }) {
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const unwrappedParams = React.use(params);
  const id = unwrappedParams.id; // Extract the `id` from the unwrapped params object

  // Fetch the data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/event/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setEvent(data); // Set the fetched data
      } catch (error) {
        console.log("Error fetching data:", error);
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
        buttonText="Back to Event"
        onBack={() => router.push("/manager/event")}
      />
    );
  }

  // Show a message if no data is found
  if (!event) {
    return (
      <AlertInfo
        message="Event not found."
        subMessage=""
        buttonText="Back to Event"
        onBack={() => router.push("/manager/event")}
      />
    );
  }

  // Render the edit form with the fetched data
  return (
      <EventEditForm item={event} id={id} />
  );
}
