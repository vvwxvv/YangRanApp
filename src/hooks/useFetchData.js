"use client";

import { useState, useEffect } from "react";

// Utility function to separate media into images and videos
const separateMedia = (mediaClusters) => {
  const images = mediaClusters.filter((cluster) =>
    cluster.media_urls.some((url) => !url.endsWith(".mp4"))
  );
  const videos = mediaClusters.filter((cluster) =>
    cluster.media_urls.some((url) => url.endsWith(".mp4"))
  );
  return { images, videos };
};

const useFetchData = (fetchItems, fetchMediaclusterItems = null) => {
  const [items, setItems] = useState([]);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null); // Reset error before fetching

      try {
        const [itemsResponse, mediasResponse] = await Promise.all([
          fetchItems(),
          fetchMediaclusterItems
            ? fetchMediaclusterItems()
            : Promise.resolve({ data: [] }), // Default to empty if no media function
        ]);

        // Process items data
        if (Array.isArray(itemsResponse?.data)) {
          setItems(itemsResponse.data);
        } else {
          throw new Error("Invalid items data format");
        }

        // Process media data if available
        if (Array.isArray(mediasResponse?.data)) {
          const { images, videos } = separateMedia(mediasResponse.data);
          setImages(images);
          setVideos(videos);
        } else {
          setImages([]);
          setVideos([]);
        }
      } catch (err) {
        console.log("Error fetching data:", err);
        setError(err.message || "An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchItems, fetchMediaclusterItems]);

  return { items, images, videos, isLoading, error };
};

export default useFetchData;