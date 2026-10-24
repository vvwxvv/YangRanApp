"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { artworkReorderConfig } from "@/components/configs/reorderConfigs";

function ArtworkReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch artworks from API
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/artwork/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setArtworks(data);
      } catch (err) {
        console.log('Error fetching artworks:', err);
        setError('Failed to load artworks. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchArtworks();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/manager/artwork/${id}/edit`;
  };

  // Save reordered artworks to database
  const handleSave = async (newArtworks) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newArtworks.map(artwork => artwork._id || artwork.id);
      
      const response = await fetch('/api/artwork/reorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderedIds }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success) {
        setSuccess(true);
        // Update local state with new order values
        setArtworks(newArtworks.map((artwork, index) => ({
          ...artwork,
          order: String(index + 1)
        })));
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving artwork order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={artworkReorderConfig}
      data={artworks}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default ArtworkReorderManager;