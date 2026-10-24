"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { aboutReorderConfig } from "@/components/configs/reorderConfigs";

function AboutReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [aboutItems, setAboutItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch about items from API
  useEffect(() => {
    const fetchAboutItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/about/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setAboutItems(data);
      } catch (err) {
        console.log('Error fetching about items:', err);
        setError('Failed to load about items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutItems();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/manager/about/${id}/edit`;
  };

  // Save reordered about items to database
  const handleSave = async (newAboutItems) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newAboutItems.map(item => item._id || item.id);
      
      const response = await fetch('/api/about/reorder', {
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
        setAboutItems(newAboutItems.map((item, index) => ({
          ...item,
          order: String(index + 1)
        })));
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving about item order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={aboutReorderConfig}
      data={aboutItems}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default AboutReorderManager;
