"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { seriesReorderConfig } from "@/components/configs/reorderConfigs";

function SeriesReorderManager() {
  const { isCn } = useContext(LanguageContext);

  const [seriesItems, setSeriesItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch series items from API
  useEffect(() => {
    const fetchSeriesItems = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/series/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setSeriesItems(data);
      } catch (err) {
        console.log('Error fetching series items:', err);
        setError('Failed to load series items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSeriesItems();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    window.location.href = `/manager/series/${id}/edit`;
  };

  // Save reordered series items to database
  const handleSave = async (newSeriesItems) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const orderedIds = newSeriesItems.map(item => item._id || item.id);

      const response = await fetch('/api/series/reorder', {
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
        setSeriesItems(newSeriesItems.map((item, index) => ({
          ...item,
          order: String(index + 1)
        })));

        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving series item order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={seriesReorderConfig}
      data={seriesItems}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default SeriesReorderManager;
