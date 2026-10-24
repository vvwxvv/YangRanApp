"use client";
import React, { useState, useEffect, useContext } from 'react';
import { LanguageContext } from "@/components/contexts/LanguageContext";
import ReorderLayout from "@/components/layouts/ReorderLayout";
import { eventReorderConfig } from "@/components/configs/reorderConfigs";

function EventReorderManager() {
  const { isCn } = useContext(LanguageContext);
  
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/event/reorder');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.log('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle edit
  const handleEdit = (id) => {
    // Navigate to edit page
    window.location.href = `/manager/event/${id}/edit`;
  };

  // Save reordered events to database
  const handleSave = async (newEvents) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
      const orderedIds = newEvents.map(event => event._id || event.id);
      
      const response = await fetch('/api/event/reorder', {
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
        setEvents(newEvents.map((event, index) => ({
          ...event,
          order: String(index + 1)
        })));
        
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        throw new Error(result.error || 'Failed to save order');
      }
    } catch (err) {
      console.log('Error saving event order:', err);
      setError('Failed to save order. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ReorderLayout
      config={eventReorderConfig}
      data={events}
      onSave={handleSave}
      onEdit={handleEdit}
      loading={loading}
      saving={saving}
      error={error}
      success={success}
    />
  );
}

export default EventReorderManager;
