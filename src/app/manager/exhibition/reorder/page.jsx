"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { exhibitionReorderConfig } from "@/components/configs/reorderConfigs";

function ExhibitionReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [exhibitions, setExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch exhibitions from API
  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/exhibition/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setExhibitions(data);
      } catch (err) {
        console.log('Error fetching exhibitions:', err);
        setError('Failed to load exhibitions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    window.location.href = `/manager/exhibition/${id}/edit`;
  };

  // Save reordered exhibitions to database
  const handleSave = async (newExhibitions) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newExhibitions.map(exhibition => exhibition._id || exhibition.id);
      
      const response = await fetch('/api/exhibition/reorder', {
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
        setExhibitions(newExhibitions.map((exhibition, index) => ({
          ...exhibition,
          order: String(index + 1)
        })));
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving exhibition order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={exhibitionReorderConfig}
      data={exhibitions}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default ExhibitionReorderManager;
