"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { writingReorderConfig } from "@/components/configs/reorderConfigs";

function WritingReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [writings, setWritings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch writings from API
  useEffect(() => {
    const fetchWritings = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/writing/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setWritings(data);
      } catch (err) {
        console.log('Error fetching writings:', err);
        setError('Failed to load writings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWritings();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    window.location.href = `/manager/writing/${id}/edit`;
  };

  // Save reordered writings to database
  const handleSave = async (newWritings) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newWritings.map(writing => writing._id || writing.id);
      
      const response = await fetch('/api/writing/reorder', {
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
        setWritings(newWritings.map((writing, index) => ({
          ...writing,
          order: String(index + 1)
        })));
        
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving writing order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={writingReorderConfig}
      data={writings}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default WritingReorderManager;
