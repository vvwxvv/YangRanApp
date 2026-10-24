"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ArtworkEditForm from "@/components/forms/ArtworkEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { artworkConfig } from "@/components/configs/artworkConfig";

export default function EditArtworkPage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const artworkId = params?.id;

  // ===== DEBUG =====
  console.log('[DEBUG EditArtworkPage] params:', params);
  console.log('[DEBUG EditArtworkPage] artworkId:', artworkId);
  console.log('[DEBUG EditArtworkPage] sessionStorage keys:', 
    Object.keys(sessionStorage).filter(k => k.startsWith('artwork_edit_'))
  );
  // ===== END DEBUG =====

  useEffect(() => {
    if (!artworkId) {
      console.log('[DEBUG EditArtworkPage]  No artworkId from params');
      setError("No artwork ID provided");
      setIsLoading(false);
      return;
    }

    const loadArtworkData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `artwork_edit_${artworkId}`;
        const cachedData = sessionStorage.getItem(sessionKey);
        
        console.log('[DEBUG EditArtworkPage] Looking for sessionStorage key:', sessionKey);
        console.log('[DEBUG EditArtworkPage] cachedData found:', !!cachedData);
        
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          console.log('[DEBUG EditArtworkPage]  Loaded from sessionStorage:', {
            _id: parsedData._id,
            id: parsedData.id,
            title: parsedData.title,
          });
          setItem(parsedData);
          setIsLoading(false);
          
          // Clean up sessionStorage after use
          sessionStorage.removeItem(sessionKey);
          return;
        }

        // If no cached data, fetch from API
        const apiUrl = `${artworkConfig.api.endpoints.list}/${artworkId}`;
        console.log('[DEBUG EditArtworkPage] Fetching from API:', apiUrl);
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch artwork: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('[DEBUG EditArtworkPage] API response:', {
          _id: data?._id,
          id: data?.id,
          title: data?.title,
          keys: data ? Object.keys(data) : [],
        });
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No artwork data received");
        }
      } catch (error) {
        console.log('[DEBUG EditArtworkPage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadArtworkData();
  }, [artworkId]);

  // ...existing code...

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
          message={`Error loading artwork: ${error}`}
          subMessage="Please try again or go back to the artwork list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/artwork"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Artwork not found"
          subMessage="The requested artwork could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/artwork"}
        />
      </div>
    );
  }

  return (
        <ArtworkEditForm item={item} id={artworkId} key={isCn ? "cn" : "en"} />
  );
}