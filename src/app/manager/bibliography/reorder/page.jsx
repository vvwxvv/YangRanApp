"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { bibliographyReorderConfig } from "@/components/configs/reorderConfigs";

function BibliographyReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [bibliographyItems, setBibliographyItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch bibliography items from API
  useEffect(() => {
    const fetchBibliographyItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/bibliography/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setBibliographyItems(data);
      } catch (err) {
        console.log('Error fetching bibliography items:', err);
        setError('Failed to load bibliography items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBibliographyItems();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    window.location.href = `/manager/bibliography/${id}/edit`;
  };

  // Save reordered bibliography items to database
  const handleSave = async (newBibliographyItems) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newBibliographyItems.map(item => item._id || item.id);
      
      const response = await fetch('/api/bibliography/reorder', {
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
        setBibliographyItems(newBibliographyItems.map((item, index) => ({
          ...item,
          order: String(index + 1)
        })));
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving bibliography item order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={bibliographyReorderConfig}
      data={bibliographyItems}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default BibliographyReorderManager;