"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import WritingEditForm from "@/components/forms/WritingEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { writingConfig } from "@/components/configs/writingConfig";

export default function EditWritingPage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const writingId = params?.id;

  useEffect(() => {
    if (!writingId) {
      console.log('[DEBUG EditWritingPage]  No writingId from params');
      setError("No writing ID provided");
      setIsLoading(false);
      return;
    }

    const loadWritingData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `writing_edit_${writingId}`;
        const cachedData = sessionStorage.getItem(sessionKey);
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setItem(parsedData);
          setIsLoading(false);
          
          // Clean up sessionStorage after use
          sessionStorage.removeItem(sessionKey);
          return;
        }

        // If no cached data, fetch from API
        const apiUrl = `${writingConfig.api.endpoints.list}/${writingId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch writing: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No writing data received");
        }
      } catch (error) {
        console.log('[DEBUG EditWritingPage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWritingData();
  }, [writingId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingLayer isLoading={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message={`Error loading writing: ${error}`}
          subMessage="Please try again or go back to the writing list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/writing"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Writing not found"
          subMessage="The requested writing could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/writing"}
        />
      </div>
    );
  }

  return (
        <WritingEditForm item={item} id={writingId} key={isCn ? "cn" : "en"} />
  );
}
