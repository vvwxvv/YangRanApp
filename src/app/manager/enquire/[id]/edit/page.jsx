"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import EnquireEditForm from "@/components/forms/EnquireEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { enquireConfig } from "@/components/configs/enquireConfig";

export default function EditEnquirePage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const enquireId = params?.id;

  // ===== DEBUG =====
  console.log('[DEBUG EditEnquirePage] params:', params);
  console.log('[DEBUG EditEnquirePage] enquireId:', enquireId);
  console.log('[DEBUG EditEnquirePage] sessionStorage keys:', 
    Object.keys(sessionStorage).filter(k => k.startsWith('enquire_edit_'))
  );
  // ===== END DEBUG =====

  useEffect(() => {
    if (!enquireId) {
      console.log('[DEBUG EditEnquirePage]  No enquireId from params');
      setError("No enquiry ID provided");
      setIsLoading(false);
      return;
    }

    const loadEnquireData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `enquire_edit_${enquireId}`;
        const cachedData = sessionStorage.getItem(sessionKey);
        
        console.log('[DEBUG EditEnquirePage] Looking for sessionStorage key:', sessionKey);
        console.log('[DEBUG EditEnquirePage] cachedData found:', !!cachedData);
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log('[DEBUG EditEnquirePage]  Loaded from sessionStorage:', {
            _id: parsedData._id,
            id: parsedData.id,
            name: parsedData.name, // Using name instead of title for Enquire
          });
          setItem(parsedData);
          setIsLoading(false);
          
          // Clean up sessionStorage after use
          sessionStorage.removeItem(sessionKey);
          return;
        }

        // If no cached data, fetch from API
        const apiUrl = `${enquireConfig.api.endpoints.list}/${enquireId}`;
        console.log('[DEBUG EditEnquirePage] Fetching from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch enquiry: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[DEBUG EditEnquirePage] API response:', {
          _id: data?._id,
          id: data?.id,
          name: data?.name,
          keys: data ? Object.keys(data) : [],
        });
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No enquiry data received");
        }
      } catch (error) {
        console.log('[DEBUG EditEnquirePage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadEnquireData();
  }, [enquireId]);

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
          message={`Error loading enquiry: ${error}`}
          subMessage="Please try again or go back to the enquiry list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/enquire"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Enquiry not found"
          subMessage="The requested enquiry could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/enquire"}
        />
      </div>
    );
  }

  return (
        <EnquireEditForm item={item} id={enquireId} key={isCn ? "cn" : "en"} />
  );
}