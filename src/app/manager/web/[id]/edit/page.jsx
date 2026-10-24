"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import WebEditForm from "@/components/forms/WebEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { webConfig } from "@/components/configs/webConfig";

export default function EditWebPage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const webId = params?.id;

  useEffect(() => {
    if (!webId) {
      console.log('[DEBUG EditWebPage]  No webId from params');
      setError("No web ID provided");
      setIsLoading(false);
      return;
    }

    const loadWebData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `web_edit_${webId}`;
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
        const apiUrl = `${webConfig.api.endpoints.list}/${webId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch web: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No web data received");
        }
      } catch (error) {
        console.log('[DEBUG EditWebPage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadWebData();
  }, [webId]);

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
          message={`Error loading web: ${error}`}
          subMessage="Please try again or go back to the web list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/web"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Web not found"
          subMessage="The requested web could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/web"}
        />
      </div>
    );
  }

  return (
        <WebEditForm item={item} id={webId} key={isCn ? "cn" : "en"} />
  );
}
