"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ExhibitionEditForm from "@/components/forms/ExhibitionEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { exhibitionConfig } from "@/components/configs/exhibitionConfig";

export default function EditExhibitionPage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const exhibitionId = params?.id;

  useEffect(() => {
    if (!exhibitionId) {
      console.log('[DEBUG EditExhibitionPage]  No exhibitionId from params');
      setError("No exhibition ID provided");
      setIsLoading(false);
      return;
    }

    const loadExhibitionData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `exhibition_edit_${exhibitionId}`;
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
        const apiUrl = `${exhibitionConfig.api.endpoints.list}/${exhibitionId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch exhibition: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No exhibition data received");
        }
      } catch (error) {
        console.log('[DEBUG EditExhibitionPage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadExhibitionData();
  }, [exhibitionId]);

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
          message={`Error loading exhibition: ${error}`}
          subMessage="Please try again or go back to the exhibition list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/exhibition"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Exhibition not found"
          subMessage="The requested exhibition could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/exhibition"}
        />
      </div>
    );
  }

  return (
        <ExhibitionEditForm item={item} id={exhibitionId} key={isCn ? "cn" : "en"} />
  );
}
