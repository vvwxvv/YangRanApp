"use client";
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "next/navigation";
import { LanguageContext } from "@/components/contexts/LanguageContext";
import VideoEditForm from "@/components/forms/VideoEditForm";
import LoadingLayer from "@/components/animations/LoadingLayer";
import AlertInfo from "@/components/alerts/AlertInfo";
import { videoConfig } from "@/components/configs/videoConfig";

export default function EditVideoPage() {
  const params = useParams();
  const { isCn } = useContext(LanguageContext);
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const videoId = params?.id;

  useEffect(() => {
    if (!videoId) {
      console.log('[DEBUG EditVideoPage]  No videoId from params');
      setError("No video ID provided");
      setIsLoading(false);
      return;
    }

    const loadVideoData = async () => {
      try {
        
        // First, try to get data from sessionStorage (from manager page)
        const sessionKey = `video_edit_${videoId}`;
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
        const apiUrl = `${videoConfig.api.endpoints.list}/${videoId}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch video: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data) {
          setItem(data);
        } else {
          throw new Error("No video data received");
        }
      } catch (error) {
        console.log('[DEBUG EditVideoPage]  Error:', error.message);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadVideoData();
  }, [videoId]);

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
          message={`Error loading video: ${error}`}
          subMessage="Please try again or go back to the video list."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/video"}
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <AlertInfo
          message="Video not found"
          subMessage="The requested video could not be found."
          buttonText="Back to List"
          onBack={() => window.location.href = "/manager/video"}
        />
      </div>
    );
  }

  return (
        <VideoEditForm item={item} id={videoId} key={isCn ? "cn" : "en"} />
  );
}
